import asyncHandler from 'express-async-handler';
import Analysis from '../models/Analysis.js';
import Repository from '../models/Repository.js';
import { analyzeCode } from '../services/ai.service.js';
import { fetchRepositoryContent } from '../services/github.service.js';
import logger from '../config/logger.js';

export const startAnalysis = asyncHandler(async (req, res) => {
  const repository = await Repository.findOne({
    _id: req.params.id,
    owner: req.user._id
  }).populate('owner');

  if (!repository) {
    res.status(404);
    throw new Error('Repository not found');
  }

  // Create initial analysis record
  const analysis = await Analysis.create({
    repositoryId: repository._id,
    status: 'processing'
  });

  try {
    // Extract owner and repo name from GitHub URL
    const [owner, repo] = repository.url.split('/').slice(-2);
    
    // Fetch repository content
    const files = await fetchRepositoryContent(owner, repo);
    
    // Analyze each file
    const analysisResults = await Promise.all(
      files
        .filter(file => file.type === 'file' && file.name.match(/\.(js|ts|jsx|tsx)$/))
        .map(async (file) => {
          const content = await fetchRepositoryContent(owner, repo, file.path);
          const fileAnalysis = await analyzeCode(content.content, file.name.split('.').pop());
          return {
            path: file.path,
            ...fileAnalysis
          };
        })
    );

    // Aggregate results
    const aggregatedResults = aggregateAnalysisResults(analysisResults);

    // Update analysis with results
    analysis.status = 'completed';
    analysis.quality = aggregatedResults.quality;
    analysis.security = aggregatedResults.security;
    analysis.performance = aggregatedResults.performance;
    analysis.completedAt = new Date();
    await analysis.save();

    // Update repository with latest analysis
    repository.lastAnalysis = analysis._id;
    await repository.save();

    res.json(analysis);
  } catch (error) {
    logger.error('Analysis Error:', error);
    analysis.status = 'failed';
    await analysis.save();
    throw error;
  }
});

export const getAnalysis = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findById(req.params.id);

  if (!analysis) {
    res.status(404);
    throw new Error('Analysis not found');
  }

  const repository = await Repository.findOne({
    _id: analysis.repositoryId,
    owner: req.user._id
  });

  if (!repository) {
    res.status(404);
    throw new Error('Repository not found');
  }

  res.json(analysis);
});

// Helper function to aggregate analysis results
function aggregateAnalysisResults(results) {
  const totalFiles = results.length;
  
  return {
    quality: {
      score: Math.round(
        results.reduce((acc, curr) => acc + curr.quality.score, 0) / totalFiles
      ),
      issues: [...new Set(results.flatMap(r => r.quality.issues))],
      suggestions: [...new Set(results.flatMap(r => r.quality.suggestions))]
    },
    security: {
      score: Math.round(
        results.reduce((acc, curr) => acc + curr.security.score, 0) / totalFiles
      ),
      vulnerabilities: results.flatMap(r => r.security.vulnerabilities),
      recommendations: [...new Set(results.flatMap(r => r.security.recommendations))]
    },
    performance: {
      score: Math.round(
        results.reduce((acc, curr) => acc + curr.performance.score, 0) / totalFiles
      ),
      optimizations: [...new Set(results.flatMap(r => r.performance.optimizations))]
    }
  };
}