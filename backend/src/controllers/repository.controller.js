import asyncHandler from 'express-async-handler';
import Repository from '../models/Repository.js';

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
