import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    res.status(401);
    throw new Error('Not authorized - No token provided');
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized - User not found');
    }

    next();
  } catch (error) {
    res.status(401);
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Not authorized - Invalid token');
    } else if (error.name === 'TokenExpiredError') {
      throw new Error('Not authorized - Token expired');
    }
    throw error;
  }
});
