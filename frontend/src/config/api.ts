// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  repositories: {
    list: '/repositories',
    create: '/repositories',
    get: (id: string) => `/repositories/${id}`,
    update: (id: string) => `/repositories/${id}`,
    delete: (id: string) => `/repositories/${id}`,
    analyze: (id: string) => `/repositories/${id}/analyze`,
  },
  analysis: {
    codeQuality: (id: string) => `/analysis/${id}/quality`,
    security: (id: string) => `/analysis/${id}/security`,
    performance: (id: string) => `/analysis/${id}/performance`,
    file: '/file-analysis',
    getFile: (id: string) => `/file-analysis/${id}`,
  },
  user: {
    profile: '/user/profile',
    settings: '/user/settings',
    stats: '/user/stats',
    analysis: '/user-analysis',
    generateAnalysis: '/user-analysis/generate',
  },
};
