import axios from 'axios';
import { API_CONFIG } from '@/config/api';
import { useAuth } from '@/lib/auth';
import { handleApiError } from '@/utils/error';

const apiClient = axios.create({
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

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const auth = useAuth.getState();
        await auth.refreshToken();
        return apiClient(originalRequest);
      } catch (refreshError) {
        const auth = useAuth.getState();
        await auth.logout();
        throw refreshError;
      }
    }

    throw handleApiError(error);
  }
);

export default apiClient;