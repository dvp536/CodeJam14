// src/routes/gameRoutes.ts

import { Router } from 'express';
import { healthCheck } from '../controllers/gameController';

const router = Router();

router.get('/health', healthCheck);

export default router;
