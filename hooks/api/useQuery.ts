import { createLogger } from '@/utils/logger';
import {
  useMutation as useBaseMutation,
  useQuery as useBaseQuery,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';

const logger = createLogger('APIHooks');

/**
 * Standardized Query Hook
 *
 * Wraps TanStack useQuery with integrated logging and consistent error handling.
 */
export function useQuery<TData = unknown, TError = Error>(options: UseQueryOptions<TData, TError>) {
  const query = useBaseQuery(options);

  if (query.error) {
    logger.error(`Query Error [${String(options.queryKey[0])}]:`, query.error);
  }

  return query;
}

/**
 * Standardized Mutation Hook
 *
 * Wraps TanStack useMutation with integrated logging.
 */
export function useMutation<TData = unknown, TError = Error, TVariables = void, TContext = unknown>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
) {
  return useBaseMutation({
    ...options,
    onError: (error, variables, context, mutation) => {
      logger.error('Mutation Error:', error);
      options.onError?.(error, variables, context, mutation);
    },
  });
}
