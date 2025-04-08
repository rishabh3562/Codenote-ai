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
      console.log('instanceof error', err);
      if (err instanceof AxiosError) {
        console.log('Error during token refresh', err.response?.data?.message);
        console.log('Error during token refresh', err);
        const errorMsg = err?.response?.data?.message;
        console.log('Error during session check', errorMsg);
        if (
          errorMsg === 'No session found' ||
          errorMsg === 'Invalid session' ||
          errorMsg === 'No session found' ||
          errorMsg.toLowerCase().includes('No session found')
        ) {
          if (!get().refreshInProgress) {
            await get().refreshToken();

            // ⚠️ Only retry init if refreshToken *succeeds*
            if (get().isAuthenticated) {
              await get().init();
            }

            return;
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
      // console.log('Refresh successful:', res.data);

      await get().init(); // optional
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const msg = error.response?.data?.message;
        console.log('Error during token refresh:', msg);

        if (msg === '"No refresh token provided') {
          console.log('No refresh token — stop further calls');
          return; // 🚫 prevent further attempts
        }

        if (error.response?.status === 401 && msg === 'Refresh token expired') {
          await get().logout();
        } else {
          await get().logout();
        }
      } else {
        console.log('Unknown error during refresh', error);
        await get().logout();
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
