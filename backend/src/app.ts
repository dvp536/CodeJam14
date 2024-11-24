import express from 'express';
import cors from 'cors';
import gameRoutes from './routes/gameRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Attach API routes (if any)
app.use('/api', gameRoutes);

export default app;
