import { apiClient } from './client';
import { API_ENDPOINTS } from '@/config/api';
import type { User, UserAnalysis } from '@/types';

export const userService = {
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.user.profile);
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>(API_ENDPOINTS.user.profile, data);
    return response.data;
  },

  async getUserAnalysis(): Promise<UserAnalysis> {
    const response = await apiClient.get<UserAnalysis>(API_ENDPOINTS.user.analysis);
    return response.data;
  },

  async generateUserAnalysis(): Promise<UserAnalysis> {
    const response = await apiClient.post<UserAnalysis>(API_ENDPOINTS.user.generateAnalysis);
    return response.data;
  },
};