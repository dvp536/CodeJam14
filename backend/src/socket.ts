// src/socket.ts

import { Server, Socket } from 'socket.io';
import { getQuestionForSubject } from './utils/questionGenerator';

interface Player {
  id: string;
  username: string;
  money: number;
  socketId: string;
  betAmount: number;
  answer: string | null;
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
    socket.on('createRoom', ({ username, subject }) => {
      const roomId = generateRoomId();
      const player: Player = {
        id: socket.id,
        username,
        money: 100,
        socketId: socket.id,
        betAmount: 0,
        answer: null,
      };
      const room: Room = {
        id: roomId,
        players: [player],
        subject,
        currentRound: 0,
        totalRounds: 5,
        currentQuestion: null,
        gameStarted: false,
        bettingTimer: null,
        questionTimer: null,
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
          money: 100,
          socketId: socket.id,
          betAmount: 0,
          answer: null,
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
        await startBettingPhase(io, room);
      }
    });

    // Handle 'placeBet' event
    socket.on('placeBet', ({ roomId, betAmount }) => {
      const room = rooms[roomId];
      const player = room?.players.find((p) => p.id === socket.id);
      if (room && player) {
        player.betAmount = betAmount;
        console.log(`Player ${player.username} bet $${betAmount} in room ${roomId}`);
        checkAllBetsPlaced(io, room);
      }
    });

    // Handle 'submitAnswer' event
    socket.on('submitAnswer', ({ roomId, answer }) => {
      const room = rooms[roomId];
      const player = room?.players.find((p) => p.id === socket.id);
      if (room && player) {
        player.answer = answer;
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
  // Reset bets and answers
  room.players.forEach((player) => {
    player.betAmount = 0;
    player.answer = null;
  });

  io.to(room.id).emit('bettingPhase', {
    round: room.currentRound,
    totalRounds: room.totalRounds,
    money: room.players.map((p) => ({ username: p.username, money: p.money })),
  });

  console.log(`Betting phase started for room ${room.id}`);

  // Start betting timer
  room.bettingTimer = setTimeout(() => {
    // Proceed to question phase even if not all bets are placed
    console.log(`Betting phase timer ended for room ${room.id}`);
    startQuestionPhase(io, room);
  }, 15000); // 15 seconds
};

// Check if all bets are placed
const checkAllBetsPlaced = (io: Server, room: Room) => {
  const allBetsPlaced = room.players.every((player) => player.betAmount > 0);
  if (allBetsPlaced) {
    if (room.bettingTimer) clearTimeout(room.bettingTimer);
    console.log(`All bets placed in room ${room.id}`);
    startQuestionPhase(io, room);
  }
};

// Start Question Phase
const startQuestionPhase = async (io: Server, room: Room) => {
  try {
    const questionData = await getQuestionForSubject(room.subject);
    room.currentQuestion = questionData;

    io.to(room.id).emit('questionPhase', {
      question: questionData.question,
      options: questionData.options,
      round: room.currentRound,
    });

    console.log(`Question phase started for room ${room.id}`);

    // Start question timer
    room.questionTimer = setTimeout(() => {
      console.log(`Question phase timer ended for room ${room.id}`);
      endRound(io, room);
    }, 60000); // 60 seconds
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
      player.money += player.betAmount * 2;
    } else {
      // No change since bet amount was already deducted
    }
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
  if (room.currentRound < room.totalRounds) {
    room.currentRound += 1;
    startBettingPhase(io, room);
  } else {
    // End game and announce winner
    const winner = room.players.reduce((prev, current) =>
      prev.money > current.money ? prev : current
    );
    io.to(room.id).emit('gameOver', { winner });
    delete rooms[room.id];
    console.log(`Game over in room ${room.id}. Winner: ${winner.username}`);
  }
};
