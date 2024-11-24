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
  isReady: boolean; // New property
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
  subject: string;
  currentRound: number;
  totalRounds: number;
  currentQuestion: QuestionData | null;
  gameStarted: boolean;
  bettingTimer: NodeJS.Timeout | null;
  questionTimer: NodeJS.Timeout | null;
  settings: GameSettings;
  waitingForPlayers: boolean; // New property
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
    socket.on('createRoom', ({ username, subject, settings }) => {
      const roomId = generateRoomId();
      const player: Player = {
        id: socket.id,
        username,
        money: settings.startingMoney,
        socketId: socket.id,
        betAmount: 0,
        answer: null,
        isReady: false, // Initialize to false
      };
      const room: Room = {
        id: roomId,
        players: [player],
        subject,
        currentRound: 0,
        totalRounds: settings.totalRounds,
        currentQuestion: null,
        gameStarted: false,
        bettingTimer: null,
        questionTimer: null,
        settings,
        waitingForPlayers: false, // Initialize to false
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
          isReady: false, // Initialize to false
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
    socket.on('startGame', async ({ roomId }) => {
      const room = rooms[roomId];
      if (room && !room.gameStarted) {
        room.gameStarted = true;
        io.to(roomId).emit('gameStarted');
        room.currentRound = 1;
        room.waitingForPlayers = true; // Wait for players to be ready
        // Do not call startBettingPhase yet
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
          console.log(`Player ${player.username} bet $${betAmount} in room ${roomId}`);
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
  // Add additional money to each player at the start of the round
  room.players.forEach((player) => {
    player.money += room.settings.additionalMoneyPerRound;
    player.betAmount = null;
    player.answer = null;
  });

  io.to(room.id).emit('bettingPhase', {
    round: room.currentRound,
    totalRounds: room.settings.totalRounds,
    money: room.players.map((p) => ({ username: p.username, money: p.money })),
    bettingTime: room.settings.bettingTime,
  });

  console.log(`Betting phase started for room ${room.id}`);

  // Start betting timer
  room.bettingTimer = setTimeout(() => {
    console.log(`Betting phase timer ended for room ${room.id}`);
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
    room.players.forEach((player) => {
      if (player.betAmount === null) {
        player.betAmount = 0;
        console.log(`Player ${player.username} did not place a bet. Default bet of $0 assigned.`);
      }
    });

    const questionData = await getQuestionForSubject(room.subject);
    room.currentQuestion = questionData;

    io.to(room.id).emit('questionPhase', {
      question: questionData.question,
      options: questionData.options,
      round: room.currentRound,
      questionTime: room.settings.questionTime,
    });

    console.log(`Question phase started for room ${room.id}`);

    // Start question timer using the configurable question time
    room.questionTimer = setTimeout(() => {
      console.log(`Question phase timer ended for room ${room.id}`);
      endRound(io, room);
    }, room.settings.questionTime * 1000); // Convert seconds to milliseconds
  } catch (error) {
    io.to(room.id).emit('error', { message: 'Failed to get a new question.' });
  }
};

// Check if all answers are submitted
const checkAllAnswersSubmitted = (io: Server, room: Room) => {
  const allAnswersSubmitted = room.players.every((player) => player.answer !== null);
  if (allAnswersSubmitted) {
    if (room.questionTimer) clearTimeout(room.questionTimer);
    console.log(`All answers submitted in room ${room.id}`);
    endRound(io, room);
  }
};

// End the Round
const endRound = (io: Server, room: Room) => {
  const correctAnswer = room.currentQuestion?.correctAnswer;
  room.players.forEach((player) => {
    if (player.answer === correctAnswer) {
      player.money += (player.betAmount ?? 0) * 2; // Player gains 2x bet amount (net gain of bet amount)
    }
    // If incorrect, the player has already lost their bet amount
    // Reset bet and answer for the next round
    player.betAmount = 0;
    player.answer = null;
  });

  io.to(room.id).emit('roundEnded', {
    correctAnswer,
    players: room.players.map((p) => ({
      username: p.username,
      money: p.money,
    })),
  });

  console.log(`Round ${room.currentRound} ended for room ${room.id}`);

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
};
