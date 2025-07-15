import express from 'express';
const router = express.Router();
import { generateSummary } from '../controllers/geminiController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/summary', protect, generateSummary);

export default router;
