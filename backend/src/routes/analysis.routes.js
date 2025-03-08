import express from 'express';
import { startAnalysis, getAnalysis } from '../controllers/analysis.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/repositories/:id/analyze', startAnalysis);
router.get('/analysis/:id', getAnalysis);

export default router;