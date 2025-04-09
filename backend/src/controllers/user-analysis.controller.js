import fetch from 'node-fetch';
import asyncHandler from 'express-async-handler';
import UserAnalysis from '../models/UserAnalysis.js';
import axios from 'axios';
import { fetchGitHubUserAnalysis } from '../services/github.service.js';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const serializeUserAnalysis = (doc) => ({
  contributionData: doc.contributionData || [],
  languageStats: doc.languageStats || [],
  metrics: {
    totalCommits: doc.stats.totalCommits || 0,
    pullRequests: doc.stats.pullRequests || 0,
    collaborators: doc.stats.collaborators || 0,
    avgDailyActivity: doc.stats.avgDailyActivity?.toString() || '0',
  },
  repoStats: doc.repoStats || [],
  activityHeatmap: doc.activityHeatmap || [],
  impactScore: doc.impactScore || [],
});
export const getUserCommits = async (req, res) => {
  const { username } = req.params;

  try {
    const response = await axios.get(
      `https://api.github.com/search/commits?q=author:${username}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.cloak-preview',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching commits:', error.message);
    res.status(500).json({ error: 'Failed to fetch commits' });
  }
};
export const getUserAnalysis = asyncHandler(async (req, res) => {
  const analysis = await UserAnalysis.findOne({ userId: req.user._id }).sort(
    '-createdAt'
  );

  if (!analysis) {
    res.status(404);
    throw new Error('Analysis not found');
  }

  // res.json(analysis);
  res.json(serializeUserAnalysis(analysis));
});

export const generateUserAnalysis = asyncHandler(async (req, res) => {
  const githubUsername = req.body.username;
  if (!githubUsername) {
    res.status(400);
    throw new Error('GitHub username is required');
  }

  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'User-Agent': 'Codenote-AI',
  };

  const reposRes = await fetch(
    `https://api.github.com/users/${githubUsername}/repos?per_page=100`,
    { headers }
  );
  const repos = await reposRes.json();

  const languageMap = {};
  const repoStats = [];
  let pullRequests = 0;
  let totalCommits = 0;
  let totalCollaborators = 0;

  for (const repo of repos) {
    const { name, stargazers_count, forks_count, languages_url, owner } = repo;

    // === Languages ===
    const langRes = await fetch(languages_url, { headers });
    const langs = await langRes.json();
    for (const [lang, val] of Object.entries(langs)) {
      languageMap[lang] = (languageMap[lang] || 0) + val;
    }

    repoStats.push({
      name,
      stars: stargazers_count,
      forks: forks_count,
    });

    // === Pull Requests ===
    const prRes = await fetch(
      `https://api.github.com/repos/${owner.login}/${name}/pulls?state=all&per_page=100`,
      { headers }
    );
    const prs = await prRes.json();
    if (Array.isArray(prs)) pullRequests += prs.length;

    // === Commits by User ===
    const contribRes = await fetch(
      `https://api.github.com/repos/${owner.login}/${name}/contributors?per_page=100`,
      { headers }
    );
    const contributors = await contribRes.json();
    if (Array.isArray(contributors)) {
      const userStats = contributors.find((c) => c.login === githubUsername);
      if (userStats) totalCommits += userStats.contributions;
      totalCollaborators += contributors.length;
    }
  }

  const languageStats = Object.entries(languageMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const analysis = await UserAnalysis.create({
    userId: req.user._id,
    stats: {
      totalCommits,
      pullRequests,
      collaborators: totalCollaborators,
      avgDailyActivity: parseFloat((pullRequests / 30).toFixed(1)),
    },
    contributionData: [],
    languageStats,
    repoStats: repoStats.slice(0, 5),
    activityHeatmap: [],
    impactScore: [],
  });

  res.status(201).json({
    metrics: analysis.stats,
    languageStats: analysis.languageStats,
    repoStats: analysis.repoStats,
    contributionData: analysis.contributionData,
    activityHeatmap: analysis.activityHeatmap,
    impactScore: analysis.impactScore,
  });
});

export const generateFullUserAnalysis = async (req, res, next) => {
  try {
    const { username } = req.params;
    const data = await fetchGitHubUserAnalysis(username);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
// import asyncHandler from 'express-async-handler';
// import UserAnalysis from '../models/UserAnalysis.js';

// export const getUserAnalysis = asyncHandler(async (req, res) => {
//   const analysis = await UserAnalysis.findOne({ userId: req.user._id }).sort(
//     '-createdAt'
//   );

//   if (!analysis) {
//     res.status(404);
//     throw new Error('Analysis not found');
//   }

//   res.json(analysis);
// });

// export const generateUserAnalysis = asyncHandler(async (req, res) => {
//   // Here you would integrate with GitHub API to fetch real data
//   const analysis = await UserAnalysis.create({
//     userId: req.user._id,
//     stats: {
//       totalCommits: Math.floor(Math.random() * 5000) + 1000,
//       pullRequests: Math.floor(Math.random() * 300) + 50,
//       collaborators: Math.floor(Math.random() * 50) + 10,
//       avgDailyActivity: parseFloat((Math.random() * 5 + 2).toFixed(1)),
//     },
//     contributionData: Array.from({ length: 12 }, (_, i) => ({
//       month: [
//         'Jan',
//         'Feb',
//         'Mar',
//         'Apr',
//         'May',
//         'Jun',
//         'Jul',
//         'Aug',
//         'Sep',
//         'Oct',
//         'Nov',
//         'Dec',
//       ][i],
//       commits: Math.floor(Math.random() * 200) + 50,
//     })),
//     languageStats: [
//       { name: 'TypeScript', value: 45 },
//       { name: 'JavaScript', value: 25 },
//       { name: 'Python', value: 15 },
//       { name: 'Go', value: 10 },
//       { name: 'Other', value: 5 },
//     ],
//     repoStats: Array.from({ length: 5 }, (_, i) => ({
//       name: `Project ${i + 1}`,
//       stars: Math.floor(Math.random() * 1000),
//       forks: Math.floor(Math.random() * 500),
//     })),
//     activityHeatmap: Array.from({ length: 52 }, (_, week) => ({
//       week: `Week ${week + 1}`,
//       contributions: Math.floor(Math.random() * 50),
//     })),
//     impactScore: [
//       { category: 'Code Quality', score: Math.floor(Math.random() * 100) },
//       { category: 'Documentation', score: Math.floor(Math.random() * 100) },
//       { category: 'Testing', score: Math.floor(Math.random() * 100) },
//       { category: 'Reviews', score: Math.floor(Math.random() * 100) },
//       { category: 'Issues', score: Math.floor(Math.random() * 100) },
//       { category: 'Features', score: Math.floor(Math.random() * 100) },
//     ],
//   });

//   res.status(201).json(analysis);
// });
