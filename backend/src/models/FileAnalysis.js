import mongoose from 'mongoose';

const fileAnalysisSchema = new mongoose.Schema(
  {
    repositoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Repository',
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    content: String,
    metrics: {
      complexity: {
        score: Number,
        details: [String],
      },
      maintainability: {
        score: Number,
        issues: [String],
      },
      duplication: {
        score: Number,
        locations: [String],
      },
    },
    suggestions: [
      {
        type: String,
        severity: {
          type: String,
          enum: ['low', 'medium', 'high'],
        },
        description: String,
        line: Number,
      },
    ],
    dependencies: [
      {
        name: String,
        version: String,
        type: String,
      },
    ],
    functions: [
      {
        name: String,
        complexity: Number,
        lines: Number,
        params: [String],
        returnType: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const FileAnalysis = mongoose.model('FileAnalysis', fileAnalysisSchema);

export default FileAnalysis;
