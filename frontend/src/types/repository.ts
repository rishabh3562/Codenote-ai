export interface Repository {
  id: string;
  name: string;
  description: string;
  url: string;
  defaultBranch: string;
  private: boolean;
  owner: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
  stats: {
    stars: number;
    forks: number;
    watchers: number;
    issues: number;
  };
  createdAt: string;
  updatedAt: string;
  lastAnalysis?: AnalysisResult;
}