// -ai\backend\src\controllers\auth.controller.js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { cookieConfig } from '../middleware/cookie.js';
import logger from '../config/logger.js';

const generateTokens = (userId) => ({
  accessToken: jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  }),
  refreshToken: jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  }),
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const { accessToken, refreshToken } = generateTokens(user._id);

  // Set secure cookies
  res.cookie('accessToken', accessToken, cookieConfig);
  res.cookie('refreshToken', refreshToken, {
    ...cookieConfig,
    // path: '/api/auth/refresh',
  });

  logger.info(`New user registered: ${user._id}`);

  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
  });
});
export const logout = asyncHandler(async (req, res) => {
  // Clear cookies
  res.cookie('accessToken', '', { ...cookieConfig, maxAge: 0 });
  res.cookie('refreshToken', '', {
    ...cookieConfig,

    maxAge: 0,
  });

  logger.info(`User logged out: ${req.user?._id}`);

  res.json({ message: 'Logged out successfully' });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const { accessToken, refreshToken } = generateTokens(user._id);
  console.log('accessToken', accessToken);
  console.log('refresh', refreshToken);
  // Set secure cookies
  res.cookie('accessToken', accessToken, cookieConfig);
  res.cookie('refreshToken', refreshToken, {
    ...cookieConfig,
    // path: '/api/auth/refresh'
  });

  logger.info(`User logged in: ${user._id}`);

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const tokens = generateTokens(user._id);

    res.cookie('accessToken', tokens.accessToken, cookieConfig);
    res.cookie('refreshToken', tokens.refreshToken, cookieConfig);

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    // Handle token expiration error
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    // Handle invalid refresh token error
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
});

export const session = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: 'No session found' });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Invalid session', error: error.message });
  }
});
