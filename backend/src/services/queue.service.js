import mongoose from 'mongoose';
import logger from '../config/logger.js';

const jobSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['analysis', 'userAnalysis', 'fileAnalysis'],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    priority: {
      type: Number,
      default: 0,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    error: String,
    startedAt: Date,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);

export const queueService = {
  async addJob(type, data, priority = 0) {
    try {
      const job = await Job.create({
        type,
        data,
        priority,
      });
      logger.info(`Job added to queue: ${job._id}`);
      return job;
    } catch (error) {
      logger.error('Queue add job error:', error);
      throw error;
    }
  },

  async processJobs() {
    try {
      const job = await Job.findOneAndUpdate(
        {
          status: 'pending',
          attempts: { $lt: '$maxAttempts' },
        },
        {
          $set: { status: 'processing', startedAt: new Date() },
          $inc: { attempts: 1 },
        },
        { sort: { priority: -1, createdAt: 1 }, new: true }
      );

      if (!job) return null;

      try {
        // Process job based on type
        switch (job.type) {
          case 'analysis':
            await processAnalysisJob(job);
            break;
          case 'userAnalysis':
            await processUserAnalysisJob(job);
            break;
          case 'fileAnalysis':
            await processFileAnalysisJob(job);
            break;
        }

        job.status = 'completed';
        job.completedAt = new Date();
        await job.save();
      } catch (error) {
        job.status = 'failed';
        job.error = error.message;
        await job.save();
        throw error;
      }

      return job;
    } catch (error) {
      logger.error('Queue process job error:', error);
      throw error;
    }
  },
};

// Start the job processor
const POLLING_INTERVAL = 5000; // 5 seconds

function startJobProcessor() {
  setInterval(async () => {
    try {
      await queueService.processJobs();
    } catch (error) {
      logger.error('Job processor error:', error);
    }
  }, POLLING_INTERVAL);
}

startJobProcessor();
