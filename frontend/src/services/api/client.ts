import axios from 'axios';
import { useAuth } from '@/lib/auth';
// import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from '@/config/api';
export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
  withCredentials: true, // Sends cookies with requests
});

// Response interceptor for handling 401 errors (auth issues)
apiClient.interceptors.response.use(
  (response) => response, // successful response
  async (error) => {
    const originalRequest = error.config;
    // const navigate = useNavigate(); // Use `useNavigate` from react-router-dom for redirection

    if (
      error.response?.status === 401 && // 401 error means unauthorized (token expired)
      !originalRequest._retry && // Prevent retrying the same request multiple times
      !originalRequest.url.includes('/auth/session') && // Exclude refresh & session routes from the retry logic
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true; // Mark as retried to prevent infinite retry loop
      try {
        // Handle the case where the refresh token is not provided
        if (error.response?.data?.message === 'No refresh token provided') {
          // Redirect to login if no refresh token is found
          window.location.href = '/login'; // Redirect to login page
          return Promise.reject(error); // Reject the error to avoid further processing
        }

        await useAuth.getState().refreshToken(); // Call the refresh route to get new tokens
        return apiClient(originalRequest); // Retry the original request with new tokens
      } catch {
        await useAuth.getState().logout(); // Logout if refresh fails
        window.location.href = '/login'; // Redirect to login on logout
        return Promise.reject(error);
      }
    }

    return Promise.reject(error); // Handle any other errors
  }
);

export default apiClient;
