import express from 'express';
import {
  getUserAnalysis,
  generateUserAnalysis,
  getUserCommits,
  generateFullUserAnalysis,
} from '../controllers/user-analysis.controller.js';

import {
  fetchUserContributions,
  fetchUserStats,
} from '../services/github.service.js';

const router = express.Router();

// Auth-protected routes (uncomment if needed)
// router.use(protect);

// Existing REST-based user analysis routes
router.get('/user-analysis', getUserAnalysis);
router.post('/user-analysis/generate', generateUserAnalysis);
router.get('/github/commits/:username', getUserCommits);

router.get('/github/user-analysis/:username', generateFullUserAnalysis);
// GitHub-specific GraphQL routes
router.get('/github/:username/contributions', async (req, res, next) => {
  try {
    const data = await fetchUserContributions(req.params.username);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/github/:username/stats', async (req, res, next) => {
  try {
    const data = await fetchUserStats(req.params.username);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
