import apiClient from '@/services/api/client';
import { API_ENDPOINTS } from '@/config/api';
import type { User } from '@/types';

interface LoginResponse {
  user: User;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    console.log('Sending Login Request:', { email, password });
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.auth.login,
      { email, password }
    );
    return response.data;
  },
  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.auth.register,
      data
    );
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.auth.logout);
  },

  async refreshToken(): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.auth.refresh
    );
    return response.data;
  },
};
