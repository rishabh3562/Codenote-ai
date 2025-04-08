import mongoose from 'mongoose';
import logger from '../config/logger.js';

const cacheSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
});

const Cache = mongoose.model('Cache', cacheSchema);

export const cacheService = {
  async get(key) {
    try {
      const cached = await Cache.findOne({ key });
      return cached?.data || null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  },

  async set(key, data, ttl = 3600) {
    try {
      const expiresAt = new Date(Date.now() + ttl * 1000);
      await Cache.findOneAndUpdate(
        { key },
        { key, data, expiresAt },
        { upsert: true, new: true }
      );
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  },

  async delete(key) {
    try {
      await Cache.deleteOne({ key });
    } catch (error) {
      logger.error('Cache delete error:', error);
    }
  },

  async clear() {
    try {
      await Cache.deleteMany({});
    } catch (error) {
      logger.error('Cache clear error:', error);
    }
  },
};
