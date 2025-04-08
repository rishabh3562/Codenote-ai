import express from 'express';
import {
  analyzeFile,
  getFileAnalysis,
} from '../controllers/file-analysis.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/file-analysis', analyzeFile);
router.get('/file-analysis/:id', getFileAnalysis);

export default router;
