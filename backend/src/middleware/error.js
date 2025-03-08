import logger from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  // Get status code from response or default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log error details
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?._id,
    requestId: req.id,
    timestamp: new Date().toISOString()
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    message: err.message,
    code: err.code || 'INTERNAL_SERVER_ERROR',
    status: statusCode,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.details
    })
  });
};