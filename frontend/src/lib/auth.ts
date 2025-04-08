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

  // Initialize session by calling /auth/session.
  // - If no token exists, backend returns "No session found".
  // - If token exists but is expired, backend returns "Invalid session" with error "jwt expired"
  init: async () => {
    // Run init only once per mount cycle.
    if (get().initialized) return;
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.get("/auth/session", {
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
      const errorDetail = err?.response?.data?.error || "";
      // If the access token is present but expired, you'll likely see "Invalid session" along with an error indicating token expiration.
      if (
        errorMsg === "Invalid session" &&
        errorDetail.toLowerCase().includes("expired")
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
        error: "Please login",
        initialized: true,
      });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.post("/auth/login", credentials, {
        withCredentials: true, // 🔥 Required to accept httpOnly cookies
      });
      set({ user: res.data.user, isAuthenticated: true });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Login failed" });
      throw err;
    } finally {
      set({ isLoading: false });
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
      const res = await apiClient.post("/auth/refresh", null, {
        withCredentials: true,
      });
      console.log("Refresh successful:", res.data);
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
