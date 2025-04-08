import apiClient from './client';
import { API_ENDPOINTS } from './config';
import type { Repository, AnalysisResult } from '@/types';

export const repositoryApi = {
  list: async () => {
    const response = await apiClient.get<Repository[]>(
      API_ENDPOINTS.repositories.list
    );
    return response.data;
  },

  get: async (id: string) => {
    const response = await apiClient.get<Repository>(
      API_ENDPOINTS.repositories.get(id)
    );
    return response.data;
  },

  create: async (data: Partial<Repository>) => {
    const response = await apiClient.post<Repository>(
      API_ENDPOINTS.repositories.create,
      data
    );
    return response.data;
  },

  update: async (id: string, data: Partial<Repository>) => {
    const response = await apiClient.put<Repository>(
      API_ENDPOINTS.repositories.update(id),
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(API_ENDPOINTS.repositories.delete(id));
  },

  analyze: async (id: string) => {
    const response = await apiClient.post<AnalysisResult>(
      API_ENDPOINTS.repositories.analyze(id)
    );
    return response.data;
  },
};
