import { create } from "zustand";
import apiClient from "@/services/api/client";

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

  // Initialize session (calls /auth/session)
  init: async () => {
    if (get().initialized) return;
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.get("/auth/session", {
        withCredentials: true,
      });
      set({
        isAuthenticated: true,
        user: res.data,
        isLoading: false,
        initialized: true,
      });
    } catch (err: any) {
      // When no access token or invalid session,
      // mark as initialized to avoid repeated init loops.
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: err?.response?.data?.message || "Session invalid",
        initialized: true,
      });
    }
  },

  login: async ({ email, password }) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.post("/auth/login", { email, password });
      await get().init();
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Login failed",
      });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.post("/auth/logout");
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
      const res = await apiClient.get("/auth/refresh", {
        withCredentials: true,
      });
      console.log("Refresh successful:", res.data);
      // Reinitialize session after a successful refresh
      await get().init();
    } catch (error) {
      // If refresh fails, logout to force re-login
      await get().logout();
    } finally {
      set({ isLoading: false });
    }
  },
}));
