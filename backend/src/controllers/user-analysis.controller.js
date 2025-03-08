import asyncHandler from 'express-async-handler';
import UserAnalysis from '../models/UserAnalysis.js';

export const getUserAnalysis = asyncHandler(async (req, res) => {
  const analysis = await UserAnalysis.findOne({ userId: req.user._id })
    .sort('-createdAt');

  if (!analysis) {
    res.status(404);
    throw new Error('Analysis not found');
  }

  res.json(analysis);
});

export const generateUserAnalysis = asyncHandler(async (req, res) => {
  // Here you would integrate with GitHub API to fetch real data
  const analysis = await UserAnalysis.create({
    userId: req.user._id,
    stats: {
      totalCommits: Math.floor(Math.random() * 5000) + 1000,
      pullRequests: Math.floor(Math.random() * 300) + 50,
      collaborators: Math.floor(Math.random() * 50) + 10,
      avgDailyActivity: parseFloat((Math.random() * 5 + 2).toFixed(1)),
    },
    contributionData: Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      commits: Math.floor(Math.random() * 200) + 50,
    })),
    languageStats: [
      { name: 'TypeScript', value: 45 },
      { name: 'JavaScript', value: 25 },
      { name: 'Python', value: 15 },
      { name: 'Go', value: 10 },
      { name: 'Other', value: 5 },
    ],
    repoStats: Array.from({ length: 5 }, (_, i) => ({
      name: `Project ${i + 1}`,
      stars: Math.floor(Math.random() * 1000),
      forks: Math.floor(Math.random() * 500),
    })),
    activityHeatmap: Array.from({ length: 52 }, (_, week) => ({
      week: `Week ${week + 1}`,
      contributions: Math.floor(Math.random() * 50),
    })),
    impactScore: [
      { category: 'Code Quality', score: Math.floor(Math.random() * 100) },
      { category: 'Documentation', score: Math.floor(Math.random() * 100) },
      { category: 'Testing', score: Math.floor(Math.random() * 100) },
      { category: 'Reviews', score: Math.floor(Math.random() * 100) },
      { category: 'Issues', score: Math.floor(Math.random() * 100) },
      { category: 'Features', score: Math.floor(Math.random() * 100) },
    ],
  });

  res.status(201).json(analysis);
});