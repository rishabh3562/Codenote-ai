import axios from 'axios';
import { API_CONFIG } from '@/config/api';
import { useAuth } from '@/lib/auth';
import { handleApiError } from '@/utils/error';

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
  withCredentials: true // Enable sending cookies with requests
});

// Response interceptor for handling auth and errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await useAuth.getState().refreshToken();
        return apiClient(originalRequest);
      } catch {
        await useAuth.getState().logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);


export default apiClient;