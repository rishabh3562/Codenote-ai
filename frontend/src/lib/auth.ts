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
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: err?.response?.data?.message || "Session invalid",
        initialized: true, // prevent infinite loop
      });
    }
  },

  login: async ({ email, password }) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.post("/auth/login", { email, password });
      await get().init(); // can safely use get now
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
      await apiClient.get("/auth/refresh");
      await get().init();
    } catch (error) {
      await get().logout();
    } finally {
      set({ isLoading: false });
    }
  },
}));

// import { create } from "zustand";
// import apiClient from "@/services/api/client";

// interface AuthState {
//   isAuthenticated: boolean;
//   user: any | null;
//   initialized: boolean;
//   error: string | null;
//   init: () => Promise<void>;
//   login: (credentials: { email: string; password: string }) => Promise<void>;
//   logout: () => Promise<void>;
// }
//
// export const useAuth = create<AuthState>((set, get) => ({
//   isAuthenticated: false,
//   user: null,
//   initialized: false,
//   error: null,

//   init: async () => {
//     if (get().initialized) return;
//     try {
//       const res = await apiClient.get("/auth/session", {
//         withCredentials: true,
//       });
//       set({
//         isAuthenticated: true,
//         user: res.data,
//         initialized: true,
//       });
//     } catch (err: any) {
//       set({
//         isAuthenticated: false,
//         user: null,
//         error: err?.response?.data?.message || "Session invalid",
//         initialized: true,
//       });
//     }
//   },

//   login: async ({ email, password }) => {
//     await apiClient.post("/auth/login", { email, password });
//     await get().init();
//   },

//   logout: async () => {
//     await apiClient.post("/auth/logout");
//     set({
//       isAuthenticated: false,
//       user: null,
//       initialized: false,
//     });
//   },
// }));
