import asyncHandler from 'express-async-handler';
import Repository from '../models/Repository.js';
import axios from 'axios';
export const getRepositories = asyncHandler(async (req, res) => {
  const repositories = await Repository.find({ owner: req.user._id })
    .populate('lastAnalysis')
    .sort('-updatedAt');
  res.json(repositories);
});

export const getRepository = asyncHandler(async (req, res) => {
  const repository = await Repository.findOne({
    _id: req.params.id,
    owner: req.user._id,
  }).populate('lastAnalysis');

  if (!repository) {
    res.status(404);
    throw new Error('Repository not found');
  }

  res.json(repository);
});

export const createRepository = asyncHandler(async (req, res) => {
  const repository = await Repository.create({
    ...req.body,
    owner: req.user._id,
  });

  res.status(201).json(repository);
});

export const updateRepository = asyncHandler(async (req, res) => {
  const repository = await Repository.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!repository) {
    res.status(404);
    throw new Error('Repository not found');
  }

  res.json(repository);
});

export const deleteRepository = asyncHandler(async (req, res) => {
  const repository = await Repository.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!repository) {
    res.status(404);
    throw new Error('Repository not found');
  }

  res.json({ message: 'Repository deleted' });
});

// commitsController.js

export const getDailyCommits = async (req, res) => {
  const { username, repo } = req.params;
  const token = process.env.GITHUB_TOKEN;

  const since = new Date();
  since.setDate(since.getDate() - 30);
  const until = new Date();

  const commitsUrl = `https://api.github.com/repos/${username}/${repo}/commits`;

  try {
    const response = await axios.get(commitsUrl, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        since: since.toISOString(),
        until: until.toISOString(),
        per_page: 100,
      },
    });

    const dailyCounts = {};
    for (let i = 0; i < 30; i++) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const key = day.toISOString().split('T')[0];
      dailyCounts[key] = 0;
    }

    response.data.forEach((commit) => {
      const date = commit.commit.author.date.split('T')[0];
      if (dailyCounts[date] !== undefined) {
        dailyCounts[date]++;
      }
    });

    const formatted = Object.entries(dailyCounts)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, count]) => ({ date, count }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch commits' });
  }
};
