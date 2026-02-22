import { AuthError } from '@/types/auth';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Minimal shape shared by Supabase auth errors.
 * Supabase AuthError subclasses carry `status` (HTTP code) and sometimes `code` (string).
 */
interface SupabaseAuthErrorShape {
  message?: string;
  status?: number;
  code?: string;
}

/**
 * Handle Supabase authentication errors and convert them to a standard format.
 *
 * @param error - The error returned from Supabase
 * @returns Standardized AuthError
 */
export const handleAuthError = (error: SupabaseAuthErrorShape): AuthError => {
  return {
    message: error.message || 'An unexpected authentication error occurred',
    code: error.status?.toString() || error.code,
  };
};

/**
 * Handle Supabase database/API errors and convert them to a standard format.
 *
 * @param error - The error returned from Supabase
 * @returns Standardized Error object
 */
export const handleDatabaseError = (error: PostgrestError): Error => {
  return new Error(error.message || 'An unexpected database error occurred');
};
