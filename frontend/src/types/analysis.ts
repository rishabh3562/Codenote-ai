export interface AnalysisResult {
  id: string;
  repositoryId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  quality: CodeQualityAnalysis;
  security: SecurityAnalysis;
  performance: PerformanceAnalysis;
  createdAt: string;
  completedAt?: string;
}

export interface CodeQualityAnalysis {
  score: number;
  issues: string[];
  suggestions: string[];
  complexity: {
    score: number;
    details: string[];
  };
}

export interface SecurityAnalysis {
  score: number;
  vulnerabilities: {
    severity: 'low' | 'medium' | 'high';
    description: string;
    location: string;
  }[];
  recommendations: string[];
}

export interface PerformanceAnalysis {
  score: number;
  metrics: {
    loadTime: number;
    resourceUsage: number;
    efficiency: number;
  };
  optimizations: string[];
}
