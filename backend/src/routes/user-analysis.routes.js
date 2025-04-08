import express from 'express';
import {
  getUserAnalysis,
  generateUserAnalysis,
} from '../controllers/user-analysis.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/user-analysis', getUserAnalysis);
router.post('/user-analysis/generate', generateUserAnalysis);

export default router;
