import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  repositoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repository',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  quality: {
    score: Number,
    issues: [String],
    suggestions: [String],
    complexity: {
      score: Number,
      details: [String]
    }
  },
  security: {
    score: Number,
    vulnerabilities: [{
      severity: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      description: String,
      location: String
    }],
    recommendations: [String]
  },
  performance: {
    score: Number,
    metrics: {
      loadTime: Number,
      resourceUsage: Number,
      efficiency: Number
    },
    optimizations: [String]
  },
  completedAt: Date
}, {
  timestamps: true
});

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;