import { config } from '@/config';
import { AuthError } from '@/types/auth';
import { createLogger } from '@/utils/logger';
import {
  AuthResponse,
  AuthSession,
  AuthStateChangeCallback,
  AuthUser,
  IAuthService,
  LoginCredentials,
  RegisterData,
  UnsubscribeFn,
} from '../interfaces/IAuthService';
import { supabase } from './client';
import { handleAuthError } from './utils';

const logger = createLogger('SupabaseAuthService');

/**
 * Supabase Authentication Service
 *
 * Implementation of IAuthService for Supabase Auth.
 * Handles all authentication operations using Supabase as the backend.
 *
 * @example
 * ```typescript
 * const authService = new SupabaseAuthService();
 * const { user, session } = await authService.login({ email, password });
 * ```
 */
export class SupabaseAuthService implements IAuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    logger.info('Attempting login for:', credentials.email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw handleAuthError(error);
    }

    if (!data.session) {
      throw {
        message: 'Login failed - no session returned',
      } as AuthError;
    }

    logger.info('Login successful for:', credentials.email);
    return { user: data.user, session: data.session };
  }

  /**
   * Register a new user with email and password
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    logger.info('Attempting registration for:', data.email);

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName || null,
          last_name: data.lastName || null,
        },
        emailRedirectTo: config.supabase.authCallbackUrl,
      },
    });

    if (error) {
      throw handleAuthError(error);
    }

    if (!authData.user) {
      throw {
        message: 'Registration failed - no user returned',
      } as AuthError;
    }

    logger.info('Registration successful for:', data.email);
    return { user: authData.user, session: authData.session! };
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    logger.info('Attempting logout');

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw handleAuthError(error);
    }

    logger.info('Logout successful');
  }

  /**
   * Get the current session
   */
  async getCurrentSession(): Promise<AuthSession | null> {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return null;
      }

      return data.session;
    } catch {
      return null;
    }
  }

  /**
   * Refresh the current session
   */
  async refreshSession(): Promise<AuthSession | null> {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        return null;
      }

      return data.session;
    } catch {
      return null;
    }
  }

  /**
   * Get the current user
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        return null;
      }

      return user;
    } catch {
      return null;
    }
  }

  /**
   * Resend confirmation email to user
   */
  async resendConfirmationEmail(email: string): Promise<void> {
    logger.info('Resending confirmation email to:', email);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: config.supabase.authCallbackUrl,
      },
    });

    if (error) {
      throw handleAuthError(error);
    }

    logger.info('Confirmation email resent successfully to:', email);
  }

  /**
   * Handle email confirmation deeplink
   *
   * Extracts tokens from the deeplink URL and sets the session.
   * Called when the app receives a deeplink from email confirmation.
   *
   * Supabase sends tokens in the URL fragment (hash) in this format:
   * wattr-app://auth-callback#access_token=...&refresh_token=...&type=signup
   */
  async handleEmailConfirmation(url: string): Promise<AuthResponse | null> {
    try {
      logger.debug('Handling email confirmation deeplink', url);

      // Parse the URL - Supabase uses hash fragment, not query params
      const urlObj = new URL(url);

      // Extract params from hash (everything after #)
      const hashParams = new URLSearchParams(urlObj.hash.substring(1));

      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (!accessToken || !refreshToken) {
        logger.warn('Invalid confirmation link - missing tokens');
        return null;
      }

      // Set the session directly using the tokens from the URL
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        logger.error('Error setting session from confirmation:', error);
        throw handleAuthError(error);
      }

      if (!data.session || !data.user) {
        logger.warn('No session or user returned from email confirmation');
        return null;
      }

      logger.info('Email confirmed successfully for:', data.user.email);
      return { user: data.user, session: data.session };
    } catch (error) {
      logger.error('Error handling email confirmation:', error);
      throw error;
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: AuthStateChangeCallback): UnsubscribeFn {
    const { data } = supabase.auth.onAuthStateChange(callback);
    return data.subscription.unsubscribe;
  }
}
