import { getAuthService } from '@/services/api/factory';
import { LoginCredentials, RegisterData } from '@/types/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation, useQuery } from './useQuery';

const AUTH_QUERY_KEY = ['auth', 'session'];

/**
 * Hook for managing authentication state and operations.
 *
 * Uses TanStack Query for session caching and mutations for actions.
 */
export function useAuth() {
  const authService = getAuthService();
  const queryClient = useQueryClient();

  // Session Query
  const { data: session, isLoading } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: () => authService.getCurrentSession(),
  });

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
    },
  });

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session,
    isLoading,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
