import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { apiLimiter } from './middleware/rate-limit.js';
import { errorHandler } from './middleware/error.js';
import connectDB from './config/db.js';
import logger from './config/logger.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import repositoryRoutes from './routes/repository.routes.js';
import analysisRoutes from './routes/analysis.routes.js';
import userAnalysisRoutes from './routes/user-analysis.routes.js';
import fileAnalysisRoutes from './routes/file-analysis.routes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
// app.use('/api', apiLimiter);
app.get('/health', (req, res) => {
  res.send({ message: "working fine" })
})
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/repositories', repositoryRoutes);
app.use('/api', analysisRoutes);
app.use('/api', userAnalysisRoutes);
app.use('/api', fileAnalysisRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});