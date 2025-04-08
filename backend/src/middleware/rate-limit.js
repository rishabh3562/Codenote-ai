import rateLimit from 'express-rate-limit';
import logger from '../config/logger.js';

// General API rate limit
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      message: 'Too many requests from this IP, please try again later',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

// Stricter limit for analysis endpoints
export const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 analysis requests per hour
  message: 'Analysis rate limit exceeded, please try again later',
  handler: (req, res) => {
    logger.warn(`Analysis rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      message: 'Analysis rate limit exceeded, please try again later',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

// GitHub API rate limit
export const githubLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 GitHub API requests per hour
  message: 'GitHub API rate limit exceeded, please try again later',
  handler: (req, res) => {
    logger.warn(`GitHub API rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      message: 'GitHub API rate limit exceeded, please try again later',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});
