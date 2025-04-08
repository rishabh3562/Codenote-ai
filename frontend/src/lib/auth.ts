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

/*
import { create } from 'zustand';
import apiClient from '@/services/api/client';

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
}

export const useAuth = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
  initialized: false,

  // Initialize session by calling /auth/session.
  // - If no token exists, backend returns "No session found".
  // - If token exists but is expired, backend returns "Invalid session" with error "jwt expired"
  init: async () => {
    // Run init only once per mount cycle.
    if (get().initialized) return;
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.get('/auth/session', {
        withCredentials: true,
      });
      // Session exists and the access token is valid.
      set({
        isAuthenticated: true,
        user: res.data,
        isLoading: false,
        initialized: true,
      });
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message;
      const errorDetail = err?.response?.data?.error || '';
      // If the access token is present but expired, you'll likely see "Invalid session" along with an error indicating token expiration.
      if (
        (errorMsg === 'Invalid session' &&
          errorDetail.toLowerCase().includes('expired')) ||
        errorMsg === 'No session found' ||
        errorMsg.toLowerCase().includes('No session found')
      ) {
        // Try to refresh the token, then re-run init.
        try {
          await get().refreshToken();
          // After refresh, recall init and exit this call.
          await get().init();
          return;
        } catch {
          // If refresh fails, fall through to setting state as not authenticated.
        }
      }
      // If no token was present or refresh did not succeed,
      // set error to prompt the user to log in.
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: 'Please login',
        initialized: true,
      });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.post('/auth/login', credentials, {
        withCredentials: true, // 🔥 Required to accept httpOnly cookies
      });
      set({ user: res.data.user, isAuthenticated: true });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Login failed' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
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

  refreshToken: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await apiClient.post(
        '/auth/refresh',
        {},
        {
          withCredentials: true,
        }
      );
      console.log('Refresh successful:', res.data);
      // After refresh, reinitialize session state.
      await get().init();
    } catch (error) {
      // On refresh failure, force logout to prompt login.
      await get().logout();
    } finally {
      set({ isLoading: false });
    }
  },
}));
*/
