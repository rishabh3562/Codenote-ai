import { API_BASE_URL } from '@/lib/constants';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    refresh: `${API_BASE_URL}/auth/refresh`,
  },
  repositories: {
    list: `${API_BASE_URL}/repositories`,
    create: `${API_BASE_URL}/repositories`,
    get: (id: string) => `${API_BASE_URL}/repositories/${id}`,
    update: (id: string) => `${API_BASE_URL}/repositories/${id}`,
    delete: (id: string) => `${API_BASE_URL}/repositories/${id}`,
    analyze: (id: string) => `${API_BASE_URL}/repositories/${id}/analyze`,
  },
  analysis: {
    codeQuality: (id: string) => `${API_BASE_URL}/analysis/${id}/quality`,
    security: (id: string) => `${API_BASE_URL}/analysis/${id}/security`,
    performance: (id: string) => `${API_BASE_URL}/analysis/${id}/performance`,
  },
  user: {
    profile: `${API_BASE_URL}/user/profile`,
    settings: `${API_BASE_URL}/user/settings`,
    stats: `${API_BASE_URL}/user/stats`,
  },
};

export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
};