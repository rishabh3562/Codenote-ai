import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { authService } from "@/services/api/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  init: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          const { user } = await authService.login(email, password);
          set({ user, isAuthenticated: true });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to login";
          set({ error: message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      register: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const { user } = await authService.register(data);
          set({ user, isAuthenticated: true });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to register";
          set({ error: message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          await authService.logout();
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to logout";
          set({ error: message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      refreshToken: async () => {
        try {
          set({ isLoading: true, error: null });
          const { user } = await authService.refreshToken();
          console.log("user in refreshToken useAuth", user);
          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ user: null, isAuthenticated: false });
          const message =
            error instanceof Error ? error.message : "Failed to refresh token";
          set({ error: message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      clearError: () => set({ error: null }),
      init: async () => {
        try {
          set({ isLoading: true, error: null });
          const { user } = await authService.refreshToken();
          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
