// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import type { User } from '@/types';
// import apiClient from '../api/axios';
// import { API_ENDPOINTS } from '@/config/api';

// interface AuthState {
//   user: User | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (data: { name: string; email: string; password: string }) => Promise<void>;
//   logout: () => Promise<void>;
//   refreshToken: () => Promise<void>;
// }

// export const useAuth = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       isAuthenticated: false,
//       login: async (email, password) => {
//         const response = await apiClient.post(API_ENDPOINTS.auth.login, {
//           email,
//           password
//         });
//         set({ user: response.data.user, isAuthenticated: true });
//       },
//       register: async (data) => {
//         const response = await apiClient.post(API_ENDPOINTS.auth.register, data);
//         set({ user: response.data.user, isAuthenticated: true });
//       },
//       logout: async () => {
//         await apiClient.post(API_ENDPOINTS.auth.logout);
//         set({ user: null, isAuthenticated: false });
//       },
//       refreshToken: async () => {
//         const response = await apiClient.post(API_ENDPOINTS.auth.refresh);
//         if (response.data.user) {
//           set({ user: response.data.user, isAuthenticated: true });
//         }
//       }
//     }),
//     {
//       name: 'auth-storage',
//       partialize: (state) => ({ user: state.user })
//     }
//   )
// );
