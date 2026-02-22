import { AuthError, AuthSession, AuthUser, LoginCredentials, RegisterData } from '@/types/auth';

/**
 * Shared Types for Service Interfaces
 *
 * Vendor-agnostic types used across all service interfaces.
 */

/**
 * Authentication response returned by auth service
 */
export interface AuthResponse {
  user: AuthUser;
  session: AuthSession;
}

/**
 * Auth state change event types
 */
export type AuthStateChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED';

/**
 * Auth state change callback
 */
export type AuthStateChangeCallback = (event: string, session: AuthSession | null) => void;

/**
 * Unsubscribe function for auth state listener
 */
export type UnsubscribeFn = () => void;

// Re-export types for convenience
export type { AuthError, AuthSession, AuthUser, LoginCredentials, RegisterData };
