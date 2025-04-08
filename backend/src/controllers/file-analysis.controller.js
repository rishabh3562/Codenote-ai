import asyncHandler from 'express-async-handler';
import FileAnalysis from '../models/FileAnalysis.js';
import Repository from '../models/Repository.js';

export const analyzeFile = asyncHandler(async (req, res) => {
  const { repositoryId, filePath, content } = req.body;

  const repository = await Repository.findOne({
    _id: repositoryId,
    owner: req.user._id,
  });

  if (!repository) {
    res.status(404);
    throw new Error('Repository not found');
  }

  // Here you would integrate with AI service for analysis
  const analysis = await FileAnalysis.create({
    repositoryId,
    filePath,
    content,
    metrics: {
      complexity: {
        score: Math.floor(Math.random() * 100),
        details: ['Multiple nested conditions', 'High cyclomatic complexity'],
      },
      maintainability: {
        score: Math.floor(Math.random() * 100),
        issues: ['Consider breaking down large functions', 'Add more comments'],
      },
      duplication: {
        score: Math.floor(Math.random() * 100),
        locations: ['src/utils/helpers.ts:25', 'src/components/Button.tsx:45'],
      },
    },
    suggestions: [
      {
        type: 'refactor',
        severity: 'medium',
        description: 'Consider extracting this logic into a separate function',
        line: 25,
      },
      {
        type: 'performance',
        severity: 'high',
        description: 'Use React.memo to prevent unnecessary re-renders',
        line: 42,
      },
    ],
    dependencies: [
      { name: 'react', version: '^18.0.0', type: 'peer' },
      { name: 'lodash', version: '^4.17.21', type: 'production' },
    ],
    functions: [
      {
        name: 'handleSubmit',
        complexity: 8,
        lines: 25,
        params: ['event', 'data'],
        returnType: 'Promise<void>',
      },
    ],
  });

  res.status(201).json(analysis);
});

export const getFileAnalysis = asyncHandler(async (req, res) => {
  const analysis = await FileAnalysis.findById(req.params.id);

  if (!analysis) {
    res.status(404);
    throw new Error('Analysis not found');
  }

  const repository = await Repository.findOne({
    _id: analysis.repositoryId,
    owner: req.user._id,
  });

  if (!repository) {
    res.status(404);
    throw new Error('Repository not found');
  }

  res.json(analysis);
});
