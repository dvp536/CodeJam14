import { Server, Socket } from 'socket.io';
import { getQuestionForSubject } from './utils/questionGenerator';

interface Player {
  id: string;
  username: string;
  money: number;
  socketId: string;
}

interface Room {
  id: string;
  players: Player[];
  subject: string;
  currentRound: number;
  totalRounds: number;
  currentQuestion: QuestionData | null;
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
    socket.on('createRoom', async ({ username, subject }) => {
      const roomId = generateRoomId();
      const player: Player = { id: socket.id, username, money: 100, socketId: socket.id };
      const room: Room = {
        id: roomId,
        players: [player],
        subject,
        currentRound: 0,
        totalRounds: 5,
        currentQuestion: null,
      };
      rooms[roomId] = room;
      socket.join(roomId);
      socket.emit('roomCreated', { roomId });
      console.log(`Room created with ID: ${roomId}`);
    });

    // Handle 'joinRoom' event
    socket.on('joinRoom', ({ username, roomId }) => {
      const room = rooms[roomId];
      if (room) {
        const player: Player = { id: socket.id, username, money: 100, socketId: socket.id };
        room.players.push(player);
        socket.join(roomId);
        io.to(roomId).emit('playerJoined', { players: room.players });
        console.log(`User ${username} joined room ${roomId}`);
      } else {
        socket.emit('error', { message: 'Room not found' });
      }
    });

    // Handle 'startGame' event
    socket.on('startGame', async ({ roomId }) => {
      const room = rooms[roomId];
      if (room) {
        room.currentRound = 1;
        await sendNewQuestion(io, room);
      }
    });

    // Handle 'submitAnswer' event
    socket.on('submitAnswer', async ({ roomId, answer, betAmount }) => {
      const room = rooms[roomId];
      const player = room?.players.find((p) => p.id === socket.id);
      if (room && player && room.currentQuestion) {
        // Check if the answer is correct
        const isCorrect = answer === room.currentQuestion.correctAnswer;
        if (isCorrect) {
          player.money += betAmount * 2;
        } else {
          player.money -= betAmount;
        }
        // Proceed to next round or end game
        if (room.currentRound < room.totalRounds) {
          room.currentRound += 1;
          await sendNewQuestion(io, room);
        } else {
          // End game and announce winner
          const winner = room.players.reduce((prev, current) =>
            prev.money > current.money ? prev : current
          );
          io.to(roomId).emit('gameOver', { winner });
          delete rooms[roomId];
          console.log(`Game over in room ${roomId}. Winner: ${winner.username}`);
        }
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
  });
};

const generateRoomId = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const sendNewQuestion = async (io: Server, room: Room) => {
  try {
    const questionData = await getQuestionForSubject(room.subject);
    room.currentQuestion = questionData;
    io.to(room.id).emit('newRound', {
      round: room.currentRound,
      question: questionData.question,
      options: questionData.options,
    });
    console.log(`New question sent to room ${room.id}`);
  } catch (error) {
    io.to(room.id).emit('error', { message: 'Failed to get a new question.' });
  }
};
