import mongoose from 'mongoose';

const userAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stats: {
    totalCommits: Number,
    pullRequests: Number,
    collaborators: Number,
    avgDailyActivity: Number,
  },
  contributionData: [{
    month: String,
    commits: Number,
  }],
  languageStats: [{
    name: String,
    value: Number,
  }],
  repoStats: [{
    name: String,
    stars: Number,
    forks: Number,
  }],
  activityHeatmap: [{
    week: String,
    contributions: Number,
  }],
  impactScore: [{
    category: String,
    score: Number,
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const UserAnalysis = mongoose.model('UserAnalysis', userAnalysisSchema);

export default UserAnalysis;