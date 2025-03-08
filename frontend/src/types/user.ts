export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  location?: string;
  company?: string;
  website?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  autoAnalyze: boolean;
  includePrivateRepos: boolean;
}