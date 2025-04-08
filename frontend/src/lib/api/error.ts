import type { ApiError } from '@/types';

export class ApiException extends Error {
  constructor(public error: ApiError) {
    super(error.message);
    this.name = 'ApiException';
  }
}

export function isApiException(error: any): error is ApiException {
  return error instanceof ApiException;
}

export function handleApiError(error: any): ApiError {
  if (isApiException(error)) {
    return error.error;
  }

  if (error.response?.data) {
    return {
      message: error.response.data.message || 'An unexpected error occurred',
      code: error.response.data.code || 'UNKNOWN_ERROR',
      status: error.response.status,
      details: error.response.data.details,
    };
  }

  return {
    message: error.message || 'Network error occurred',
    code: 'NETWORK_ERROR',
    status: 0,
  };
}
