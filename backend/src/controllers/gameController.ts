// src/controllers/gameController.ts

import { Request, Response } from 'express';

// Example controller function
export const healthCheck = (req: Request, res: Response) => {
  res.json({ status: 'OK' });
};
