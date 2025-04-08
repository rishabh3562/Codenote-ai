import { create } from 'zustand';
import apiClient from '@/services/api/client';
import { AxiosError } from 'axios';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
  initialized: boolean;
  error: string | null;
  init: () => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  refreshInProgress: boolean;
  setRedirect: (url: string | null) => void;
  redirectTo: string | null;
}

export const useAuth = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
  initialized: false,
  refreshInProgress: false,

  init: async () => {
    if (get().initialized) return;
    set({ isLoading: true, error: null });

    try {
      const res = await apiClient.get('/auth/session', {
        withCredentials: true,
      });
      set({
        isAuthenticated: true,
        user: res.data,
        isLoading: false,
        initialized: true,
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const errorMsg = err?.response?.data?.message;
        if (errorMsg === 'No session found' || errorMsg === 'Invalid session') {
          if (!get().refreshInProgress) {
            await get().refreshToken();
            await get().init();
          }
        } else {
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: 'Please login',
            initialized: true,
          });
        }
      } else {
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: 'An unknown error occurred',
          initialized: true,
        });
      }
    }
  },

  refreshToken: async () => {
    if (get().refreshInProgress) return;
    set({ refreshInProgress: true });

    try {
      const res = await apiClient.post(
        '/auth/refresh',
        {},
        { withCredentials: true }
      );
      console.log('Refresh successful:', res.data);
      await get().init(); // Reinitialize the auth state after a successful refresh
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log('Error during token refresh', error);
        if (
          error.response?.status === 401 &&
          error.response?.data?.message === 'Refresh token expired'
        ) {
          console.log('Refresh token expired');
          await get().logout(); // Force logout if refresh fails
        } else {
          console.log('Error during token refresh', error);
          await get().logout(); // Force logout for any other errors
        }
      } else {
        console.log('Unknown error during refresh', error);
        await get().logout(); // Force logout for any unknown errors
      }
    } finally {
      set({ refreshInProgress: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.post('/auth/login', credentials, {
        withCredentials: true,
      });
      set({ user: res.data.user, isAuthenticated: true });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        set({ error: err.response?.data?.message || 'Login failed' });
      } else {
        set({ error: 'Unknown error during login' });
      }
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post('/auth/logout');
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        initialized: false,
      });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
    }
  },
  redirectTo: null, // To store redirection URL

  setRedirect: (url: string | null) => set({ redirectTo: url }),
}));
