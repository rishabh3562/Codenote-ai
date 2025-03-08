import mongoose from 'mongoose';
import crypto from 'crypto';
import logger from '../config/logger.js';

const webhookSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  secret: {
    type: String,
    required: true
  },
  events: [{
    type: String,
    enum: ['analysis.completed', 'analysis.failed', 'repository.updated']
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  lastDelivery: Date,
  failureCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Webhook = mongoose.model('Webhook', webhookSchema);

export const webhookService = {
  async create(userId, url, events) {
    const secret = crypto.randomBytes(32).toString('hex');
    return await Webhook.create({
      userId,
      url,
      secret,
      events
    });
  },

  async trigger(event, payload) {
    const webhooks = await Webhook.find({
      events: event,
      active: true
    });

    const deliveryPromises = webhooks.map(async (webhook) => {
      const signature = crypto
        .createHmac('sha256', webhook.secret)
        .update(JSON.stringify(payload))
        .digest('hex');

      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Hub-Signature': `sha256=${signature}`,
            'X-Event-Type': event
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        webhook.lastDelivery = new Date();
        webhook.failureCount = 0;
        await webhook.save();

        logger.info(`Webhook delivered successfully: ${webhook._id}`);
      } catch (error) {
        webhook.failureCount += 1;
        
        // Deactivate webhook after 5 consecutive failures
        if (webhook.failureCount >= 5) {
          webhook.active = false;
          logger.warn(`Webhook deactivated due to failures: ${webhook._id}`);
        }
        
        await webhook.save();
        logger.error(`Webhook delivery failed: ${webhook._id}`, error);
      }
    });

    await Promise.all(deliveryPromises);
  }
};