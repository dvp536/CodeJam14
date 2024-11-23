import app from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { setupSocket } from './socket';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Replace with your frontend URL in production
    methods: ['GET', 'POST'],
  },
});

// Initialize Socket.IO
setupSocket(io);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
