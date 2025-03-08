import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { handleApiError } from '@/lib/api/error';
import type { ApiError } from '@/types';

export function useApiQuery<TData = unknown, TError = ApiError>(
  key: string[],
  fetcher: () => Promise<TData>,
  options?: UseQueryOptions<TData, TError>
) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      try {
        return await fetcher();
      } catch (error) {
        throw handleApiError(error);
      }
    },
    ...options,
  });
}

export function useApiMutation<TData = unknown, TVariables = unknown, TError = ApiError>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return useMutation({
    mutationFn: async (variables) => {
      try {
        return await mutationFn(variables);
      } catch (error) {
        throw handleApiError(error);
      }
    },
    ...options,
  });
}