import {
  AuthError,
  AuthSession,
  AuthUser,
  LoginCredentials,
  RegisterData,
} from "@/types/auth";
import { UserProfile } from "@/types/profile";

/**
 * Shared Types for Service Interfaces
 *
 * Vendor-agnostic types used across all service interfaces.
 * These types provide a common contract that all API implementations must follow.
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
export type AuthStateChangeEvent =
  | "SIGNED_IN"
  | "SIGNED_OUT"
  | "TOKEN_REFRESHED"
  | "USER_UPDATED";

/**
 * Auth state change callback
 */
export type AuthStateChangeCallback = (
  event: string,
  session: AuthSession | null,
) => void;

/**
 * Unsubscribe function for auth state listener
 */
export type UnsubscribeFn = () => void;

// Re-export types from app types for convenience
export type {
  AuthUser,
  AuthSession,
  AuthError,
  LoginCredentials,
  RegisterData,
  UserProfile,
};
