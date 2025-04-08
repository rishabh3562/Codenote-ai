import { useState, useCallback } from 'react';

interface UseAsyncReturn<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  execute: (...args: any[]) => Promise<void>;
}

export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate = false
): UseAsyncReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await asyncFunction(...args);
        setData(response);
        return response;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFunction]
  );

  return { data, error, isLoading, execute };
}
