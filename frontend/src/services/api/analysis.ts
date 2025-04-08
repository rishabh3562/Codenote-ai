import { apiClient } from './client';
import { API_ENDPOINTS } from '@/config/api';
import type { AnalysisResult, FileAnalysis } from '@/types';

export const analysisService = {
  async analyzeRepository(id: string): Promise<AnalysisResult> {
    const response = await apiClient.post<AnalysisResult>(
      API_ENDPOINTS.repositories.analyze(id)
    );
    return response.data;
  },

  async analyzeFile(
    repositoryId: string,
    filePath: string,
    content: string
  ): Promise<FileAnalysis> {
    const response = await apiClient.post<FileAnalysis>(
      API_ENDPOINTS.analysis.file,
      {
        repositoryId,
        filePath,
        content,
      }
    );
    return response.data;
  },

  async getFileAnalysis(id: string): Promise<FileAnalysis> {
    const response = await apiClient.get<FileAnalysis>(
      API_ENDPOINTS.analysis.getFile(id)
    );
    return response.data;
  },
};
