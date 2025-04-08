import axios, { AxiosError } from 'axios';
import type { ApiError } from '@/types';

export class ApiException extends Error {
  constructor(public error: ApiError) {
    super(error.message);
    this.name = 'ApiException';
  }
}

export function isApiException(error: unknown): error is ApiException {
  return error instanceof ApiException;
}

export function handleApiError(error: unknown): never {
  if (isApiException(error)) {
    throw error;
  }

  if (axios.isAxiosError(error)) {
    const apiError: ApiError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred',
      code: error.response?.data?.code || 'UNKNOWN_ERROR',
      status: error.response?.status || 500,
      details: error.response?.data?.details,
    };
    throw new ApiException(apiError);
  }

  throw new ApiException({
    message:
      error instanceof Error ? error.message : 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    status: 500,
  });
}
