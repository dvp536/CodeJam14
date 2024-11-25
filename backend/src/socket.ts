// src/socket.ts

import { Server, Socket } from 'socket.io';
import { getQuestionForSubject } from './utils/questionGenerator';

interface Player {
  id: string;
  username: string;
  money: number;
  socketId: string;
  betAmount: number | null;
  answer: string | null;
  isReady: boolean;
  isCorrect: boolean | null;
}

interface GameSettings {
  startingMoney: number;
  additionalMoneyPerRound: number;
  totalRounds: number;
  bettingTime: number; // in seconds
  questionTime: number; // in seconds
}

interface Room {
  id: string;
  players: Player[];
  subjects: string[]; // Array of subjects for the game
  subjectsPerRound: string[]; // Subjects assigned per round
  currentSubject: string; // Current round's subject
  currentRound: number;
  totalRounds: number;
  currentQuestion: QuestionData | null;
  gameStarted: boolean;
  bettingTimer: NodeJS.Timeout | null;
  questionTimer: NodeJS.Timeout | null;
  leaderboardTimer: NodeJS.Timeout | null;
  settings: GameSettings;
  waitingForPlayers: boolean;
  roundInProgress: boolean;
  usedQuestions: Set<string>;
}

interface QuestionData {
  question: string;
  options: string[];
  correctAnswer: string;
}

const rooms: { [key: string]: Room } = {};

export const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle 'createRoom' event
    socket.on('createRoom', ({ username, subjects, settings }) => {
      const roomId = generateRoomId();
      const player: Player = {
        id: socket.id,
        username,
        money: settings.startingMoney,
        socketId: socket.id,
        betAmount: 0,
        answer: null,
        isReady: false,
        isCorrect: null,
      };
      const room: Room = {
        id: roomId,
        players: [player],
        subjects,
        subjectsPerRound: [],
        currentSubject: '',
        currentRound: 0,
        totalRounds: settings.totalRounds,
        currentQuestion: null,
        gameStarted: false,
        bettingTimer: null,
        questionTimer: null,
        leaderboardTimer: null,
        settings,
        waitingForPlayers: false,
        roundInProgress: false,
        usedQuestions: new Set(),
      };
      rooms[roomId] = room;
      socket.join(roomId);
      socket.emit('roomCreated', { roomId });
      console.log(`Room created with ID: ${roomId}`);
    });

    // Handle 'joinRoom' event
    socket.on('joinRoom', ({ username, roomId }) => {
      const room = rooms[roomId];
      if (room && !room.gameStarted) {
        const player: Player = {
          id: socket.id,
          username,
          money: room.settings.startingMoney,
          socketId: socket.id,
          betAmount: 0,
          answer: null,
          isReady: false,
          isCorrect: null,
        };
        room.players.push(player);
        socket.join(roomId);
        io.to(roomId).emit('playerJoined', { players: room.players });
        console.log(`User ${username} joined room ${roomId}`);
      } else {
        socket.emit('error', { message: 'Room not found or game already started' });
      }
    });

    // Handle 'startGame' event
    socket.on('startGame', ({ roomId }) => {
      const room = rooms[roomId];
      if (room && !room.gameStarted) {
        room.gameStarted = true;
        io.to(roomId).emit('gameStarted');
        room.currentRound = 1;
        room.waitingForPlayers = true;

        // Generate subjectsPerRound
        room.subjectsPerRound = [];
        for (let i = 0; i < room.settings.totalRounds; i++) {
          const subject =
            room.subjects[Math.floor(Math.random() * room.subjects.length)];
          room.subjectsPerRound.push(subject);
        }

        // Do not call startBettingPhase yet; wait for players to be ready
      }
    });

    socket.on('playerReady', ({ roomId }) => {
      const room = rooms[roomId];
      const player = room?.players.find((p) => p.id === socket.id);
      if (room && player) {
        player.isReady = true;
        console.log(`Player ${player.username} is ready in room ${roomId}`);
        // Check if all players are ready
        if (room.players.every((p) => p.isReady)) {
          room.waitingForPlayers = false;
          startBettingPhase(io, room);
        }
      }
    });

    // Handle 'placeBet' event
    socket.on('placeBet', ({ roomId, betAmount }) => {
      const room = rooms[roomId];
      const player = room?.players.find((p) => p.id === socket.id);
      if (room && player) {
        // Validate bet amount
        if (betAmount >= 0 && betAmount <= player.money) {
          player.betAmount = betAmount;
          player.money -= betAmount; // Deduct bet amount from player's money
          console.log(
            `Player ${player.username} bet $${betAmount} in room ${roomId}`
          );
          checkAllBetsPlaced(io, room);
        } else {
          // Send error to player
          socket.emit('error', { message: 'Invalid bet amount' });
        }
      }
    });

    // Handle 'submitAnswer' event
    socket.on('submitAnswer', ({ roomId, answer }) => {
      const room = rooms[roomId];
      const player = room?.players.find((p) => p.id === socket.id);
      if (room && player) {
        player.answer = answer; // This could be null
        console.log(`Player ${player.username} answered in room ${roomId}`);
        checkAllAnswersSubmitted(io, room);
      }
    });

    // Handle 'disconnect' event
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      for (const roomId in rooms) {
        const room = rooms[roomId];
        const playerIndex = room.players.findIndex((p) => p.id === socket.id);
        if (playerIndex !== -1) {
          const player = room.players.splice(playerIndex, 1)[0];
          io.to(roomId).emit('playerLeft', { playerId: socket.id });
          console.log(`User ${player.username} left room ${roomId}`);
          if (room.players.length === 0) {
            delete rooms[roomId];
            console.log(`Room ${roomId} deleted due to no players`);
          }
          break;
        }
      }
    });

    socket.on('getPlayers', ({ roomId }) => {
      const room = rooms[roomId];
      if (room) {
        socket.emit('playerJoined', { players: room.players });
      }
    });
  });
};

const generateRoomId = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Start Betting Phase
const startBettingPhase = async (io: Server, room: Room) => {
  // Reset roundInProgress flag
  room.roundInProgress = true;

  // Set currentSubject for this round
  room.currentSubject = room.subjectsPerRound[room.currentRound - 1];

  // Clear any existing timers
  if (room.bettingTimer) clearTimeout(room.bettingTimer);
  if (room.questionTimer) clearTimeout(room.questionTimer);
  if (room.leaderboardTimer) clearTimeout(room.leaderboardTimer);

  // Add additional money to each player at the start of the round
  room.players.forEach((player) => {
    player.money += room.settings.additionalMoneyPerRound;
    player.betAmount = null;
    player.answer = null;
    player.isCorrect = null;
  });

  io.to(room.id).emit('bettingPhase', {
    round: room.currentRound,
    totalRounds: room.settings.totalRounds,
    subject: room.currentSubject, // Announce the subject
    money: room.players.map((p) => ({ username: p.username, money: p.money })),
    bettingTime: room.settings.bettingTime,
  });

  console.log(
    `Betting phase started for room ${room.id} with subject ${room.currentSubject}`
  );

  // Start betting timer
  room.bettingTimer = setTimeout(() => {
    console.log(`Betting phase timer ended for room ${room.id}`);
    // Assign default bet of $0 to players who didn't place a bet
    room.players.forEach((player) => {
      if (player.betAmount === null) {
        player.betAmount = 0;
        console.log(
          `Player ${player.username} did not place a bet. Default bet of $0 assigned.`
        );
      }
    });
    startQuestionPhase(io, room);
  }, room.settings.bettingTime * 1000);
};

// Check if all bets are placed
const checkAllBetsPlaced = (io: Server, room: Room) => {
  const allBetsPlaced = room.players.every((player) => player.betAmount !== null);
  if (allBetsPlaced) {
    if (room.bettingTimer) clearTimeout(room.bettingTimer);
    console.log(`All bets placed in room ${room.id}`);
    startQuestionPhase(io, room);
  }
};

// Start Question Phase
const startQuestionPhase = async (io: Server, room: Room) => {
  try {
    // Clear any existing timers
    if (room.questionTimer) clearTimeout(room.questionTimer);

    // Fetch a unique question, passing the set of used questions
    const questionData = await getQuestionForSubject(
      room.currentSubject,
      room.usedQuestions // Pass the usedQuestions set
    );

    if (!questionData) {
      console.error("Failed to fetch a valid question. Falling back to a default action.");
      io.to(room.id).emit('error', { message: 'Failed to fetch a valid question for this round.' });
      return; // Exit the method early if no question is returned
    }

    // Add the question to the set of used questions
    room.usedQuestions.add(questionData.question);

    // Set the current question
    room.currentQuestion = questionData;


    io.to(room.id).emit('questionPhase', {
      question: questionData.question,
      options: questionData.options,
      round: room.currentRound,
      questionTime: room.settings.questionTime,
    });

    console.log(
      `Question phase started for room ${room.id} with subject ${room.currentSubject}`
    );

    // Start question timer
    room.questionTimer = setTimeout(() => {
      console.log(`Question phase timer ended for room ${room.id}`);
      // Assign null answers to players who didn't submit
      room.players.forEach((player) => {
        if (player.answer === null) {
          player.answer = null;
          console.log(
            `Player ${player.username} did not answer. Default answer assigned.`
          );
        }
      });
      endRound(io, room);
    }, room.settings.questionTime * 1000);
  } catch (error) {
    io
      .to(room.id)
      .emit('error', { message: 'Failed to get a new question.' });
  }
};

// Check if all answers are submitted
const checkAllAnswersSubmitted = (io: Server, room: Room) => {
  const allAnswersSubmitted = room.players.every(
    (player) => player.answer !== null
  );
  if (allAnswersSubmitted) {
    if (room.questionTimer) clearTimeout(room.questionTimer);
    console.log(`All answers submitted in room ${room.id}`);
    endRound(io, room);
  }
};

// End the Round
const endRound = (io: Server, room: Room) => {
  if (!room.roundInProgress) {
    // Round has already ended; do not proceed
    return;
  }
  // Mark the round as ended
  room.roundInProgress = false;

  const correctAnswer = room.currentQuestion?.correctAnswer;

  room.players.forEach((player) => {
    if (player.answer === correctAnswer) {
      player.money += (player.betAmount ?? 0) * 2; // Player gains 2x bet amount
      player.isCorrect = true;
    } else {
      player.isCorrect = false;
    }
    // Reset bet and answer for the next round
    player.betAmount = 0;
    player.answer = null;
  });

  // Emit 'leaderboardPhase'
  io.to(room.id).emit('leaderboardPhase', {
    players: room.players.map((p) => ({
      username: p.username,
      money: p.money,
      isCorrect: p.isCorrect,
    })),
    correctAnswer,
    round: room.currentRound,
    totalRounds: room.settings.totalRounds,
    leaderboardTime: 10, // 10-second timer
  });

  console.log(`Round ${room.currentRound} ended for room ${room.id}`);

  // Start Leaderboard Timer
  room.leaderboardTimer = setTimeout(() => {
    console.log(`Leaderboard timer ended for room ${room.id}`);

    // Proceed to next round or end game
    if (room.currentRound < room.settings.totalRounds) {
      room.currentRound += 1;
      startBettingPhase(io, room);
    } else {
      // Clear any existing timers
      if (room.bettingTimer) clearTimeout(room.bettingTimer);
      if (room.questionTimer) clearTimeout(room.questionTimer);
      if (room.leaderboardTimer) clearTimeout(room.leaderboardTimer);

      // Proceed to end the game
      const winner = room.players.reduce((prev, current) =>
        prev.money > current.money ? prev : current
      );
      io.to(room.id).emit('gameOver', {
        winner: { username: winner.username, money: winner.money },
        players: room.players.map((p) => ({
          username: p.username,
          money: p.money,
        })),
      });
      delete rooms[room.id];
      console.log(`Game over in room ${room.id}. Winner: ${winner.username}`);
    }
  }, 10000); // 10 seconds
};

// Start Leaderboard Phase
const startLeaderboardPhase = (io: Server, room: Room) => {
  io.to(room.id).emit('leaderboardPhase', {
    players: room.players.map((p) => ({
      username: p.username,
      money: p.money,
      isCorrect: p.isCorrect,
    })),
    round: room.currentRound,
    totalRounds: room.settings.totalRounds,
    leaderboardTime: 10, // 10-second timer for leaderboard phase
  });

  console.log(`Leaderboard phase started for room ${room.id}`);

  // Start leaderboard timer
  room.leaderboardTimer = setTimeout(() => {
    console.log(`Leaderboard timer ended for room ${room.id}`);

    // Proceed to next round or end game
    if (room.currentRound < room.settings.totalRounds) {
      room.currentRound += 1;
      startBettingPhase(io, room);
    } else {
      // End game and announce winner
      const winner = room.players.reduce((prev, current) =>
        prev.money > current.money ? prev : current
      );
      io.to(room.id).emit('gameOver', {
        winner: { username: winner.username, money: winner.money },
        players: room.players.map((p) => ({
          username: p.username,
          money: p.money,
        })),
      });
      delete rooms[room.id];
      console.log(`Game over in room ${room.id}. Winner: ${winner.username}`);
    }
  }, 10000); // 10 seconds
};