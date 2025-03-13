import { create } from "zustand";
import apiClient from "@/services/api/client";

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
  error: string | null;
  init: () => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,

  init: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await apiClient.get("/auth/session");
      set({ isAuthenticated: true, user: res.data, isLoading: false });
    } catch (error: any) {
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error.message,
      });
    }
  },

  login: async ({ email, password }) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.post("/auth/login", { email, password });
      await useAuth.getState().init();
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
      set({ isAuthenticated: false, user: null, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
    }
  },

  refreshToken: async () => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.get("/auth/refresh");
      await useAuth.getState().init();
    } catch (error) {
      await useAuth.getState().logout();
    } finally {
      set({ isLoading: false });
    }
  },
}));

// import { create } from "zustand";
// import type { User } from "@/types";
// import { authService } from "@/services/api/auth";

// interface AuthState {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   error: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   register: (data: {
//     name: string;
//     email: string;
//     password: string;
//   }) => Promise<void>;
//   logout: () => Promise<void>;
//   refreshToken: () => Promise<void>;
//   clearError: () => void;
//   init: () => Promise<void>;
// }

// export const useAuth = create<AuthState>((set) => ({
//   user: null,
//   isAuthenticated: false,
//   isLoading: false,
//   error: null,
//   login: async (email, password) => {
//     try {
//       set({ isLoading: true, error: null });
//       const { user } = await authService.login(email, password);
//       set({ user, isAuthenticated: true });
//     } catch (error) {
//       const message =
//         error instanceof Error ? error.message : "Failed to login";
//       set({ error: message });
//       throw error;
//     } finally {
//       set({ isLoading: false });
//     }
//   },
//   register: async (data) => {
//     try {
//       set({ isLoading: true, error: null });
//       const { user } = await authService.register(data);
//       set({ user, isAuthenticated: true });
//     } catch (error) {
//       const message =
//         error instanceof Error ? error.message : "Failed to register";
//       set({ error: message });
//       throw error;
//     } finally {
//       set({ isLoading: false });
//     }
//   },
//   logout: async () => {
//     try {
//       set({ isLoading: true, error: null });
//       await authService.logout();
//       set({ user: null, isAuthenticated: false });
//     } catch (error) {
//       const message =
//         error instanceof Error ? error.message : "Failed to logout";
//       set({ error: message });
//       throw error;
//     } finally {
//       set({ isLoading: false });
//     }
//   },
//   refreshToken: async () => {
//     try {
//       set({ isLoading: true, error: null });
//       const { user } = await authService.refreshToken();
//       console.log("user in refreshToken useAuth", user);
//       set({ user, isAuthenticated: true });
//     } catch (error) {
//       set({ user: null, isAuthenticated: false });
//       const message =
//         error instanceof Error ? error.message : "Failed to refresh token";
//       set({ error: message });
//       throw error;
//     } finally {
//       set({ isLoading: false });
//     }
//   },
//   clearError: () => set({ error: null }),
//   init: async () => {
//     try {
//       set({ isLoading: true, error: null });
//       const { user } = await authService.refreshToken();
//       set({ user, isAuthenticated: true });
//     } catch (error) {
//       set({ user: null, isAuthenticated: false });
//     } finally {
//       set({ isLoading: false });
//     }
//   },
// }));
