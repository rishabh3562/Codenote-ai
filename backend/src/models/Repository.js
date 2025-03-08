import mongoose from 'mongoose';

const repositorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a repository name'],
    trim: true
  },
  description: String,
  url: {
    type: String,
    required: [true, 'Please provide a repository URL']
  },
  defaultBranch: {
    type: String,
    default: 'main'
  },
  private: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stats: {
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    watchers: { type: Number, default: 0 },
    issues: { type: Number, default: 0 }
  },
  lastAnalysis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Analysis'
  }
}, {
  timestamps: true
});

const Repository = mongoose.model('Repository', repositorySchema);

export default Repository;