import type {
  AuthResponse,
  AuthSession,
  AuthStateChangeCallback,
  AuthUser,
  LoginCredentials,
  RegisterData,
  UnsubscribeFn,
} from './types';

// Re-export types for convenience
export type {
  AuthResponse,
  AuthSession,
  AuthStateChangeCallback,
  AuthUser,
  LoginCredentials,
  RegisterData,
  UnsubscribeFn,
};

/**
 * Authentication Service Interface
 *
 * Vendor-agnostic interface for authentication operations.
 * All authentication service implementations must conform to this interface.
 *
 * This allows easy switching between different authentication providers
 * (Supabase, Firebase, custom API) without changing consumer code.
 *
 * @example
 * ```typescript
 * const authService = getAuthService();
 * const { user, session } = await authService.login({ email, password });
 * ```
 */
export interface IAuthService {
  /**
   * Login with email and password
   *
   * @param credentials - User's email and password
   * @returns Auth response with user and session
   * @throws AuthError if login fails
   */
  login(credentials: LoginCredentials): Promise<AuthResponse>;

  /**
   * Register a new user
   *
   * Creates an authentication account with the provided credentials and profile data.
   * May require email confirmation depending on the provider configuration.
   *
   * @param data - Registration data including email, password, and profile information
   * @returns Auth response with user and session (or partial data if confirmation required)
   * @throws AuthError if registration fails
   */
  register(data: RegisterData): Promise<AuthResponse>;

  /**
   * Logout the current user
   *
   * Clears the session and removes tokens from storage.
   *
   * @throws AuthError if logout fails
   */
  logout(): Promise<void>;

  /**
   * Get the current session
   *
   * Retrieves the active authentication session if one exists.
   *
   * @returns Current session or null if not authenticated
   */
  getCurrentSession(): Promise<AuthSession | null>;

  /**
   * Refresh the current session
   *
   * Requests a new access token using the refresh token.
   *
   * @returns Refreshed session or null if refresh fails
   */
  refreshSession(): Promise<AuthSession | null>;

  /**
   * Get the current authenticated user
   *
   * @returns Current user or null if not authenticated
   */
  getCurrentUser(): Promise<AuthUser | null>;

  /**
   * Resend confirmation email to user
   *
   * Sends a new email confirmation link to the user's email address.
   *
   * @param email - User's email address
   * @throws AuthError if resend fails
   */
  resendConfirmationEmail(email: string): Promise<void>;

  /**
   * Handle email confirmation deeplink
   *
   * Processes email confirmation tokens from a deeplink URL and establishes a session.
   * The URL format depends on the authentication provider.
   *
   * @param url - The deeplink URL containing confirmation tokens
   * @returns Auth response if successful, null otherwise
   * @throws AuthError if confirmation fails
   */
  handleEmailConfirmation(url: string): Promise<AuthResponse | null>;

  /**
   * Listen to authentication state changes
   *
   * Registers a callback to be invoked whenever the authentication state changes
   * (sign in, sign out, token refresh, etc.).
   *
   * @param callback - Function to call when auth state changes
   * @returns Unsubscribe function to remove the listener
   */
  onAuthStateChange(callback: AuthStateChangeCallback): UnsubscribeFn;
}
