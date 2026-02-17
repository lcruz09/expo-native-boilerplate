import { Session, User } from "@supabase/supabase-js";

/**
 * Authentication Types
 *
 * Type definitions for authentication and user management.
 */

/**
 * Authentication user - wraps Supabase User type
 */
export type AuthUser = User;

/**
 * Authentication session - wraps Supabase Session type
 */
export type AuthSession = Session;

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data interface
 * Contains both auth credentials and profile information
 */
export interface RegisterData {
  // Auth fields
  email: string;
  password: string;

  // Required profile fields
  gender: "male" | "female" | "other";
  birthYear: number;
  height: number; // cm
  weight: number; // kg

  // Optional profile fields
  firstName?: string;
  lastName?: string;
  restingHeartRate?: number;
}

/**
 * Auth error types
 */
export interface AuthError {
  message: string;
  code?: string;
}

/**
 * Auth state
 */
export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
