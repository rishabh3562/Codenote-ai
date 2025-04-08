import axios from "axios";
import { API_CONFIG } from "@/config/api";
import { useAuth } from "@/lib/auth";

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
  withCredentials: true, // Sends cookies with requests
});

// Response interceptor for auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Only attempt refresh if the request is not for session or refresh endpoints.
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/session") &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        await useAuth.getState().refreshToken();
        // Retry the original request after refresh
        return apiClient(originalRequest);
      } catch {
        // Logout if refresh fails
        await useAuth.getState().logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
