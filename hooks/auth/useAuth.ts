import { getAuthService } from "@/services/api/factory";
import { useAuthStore } from "@/stores/auth/authStore";
import { useProfileStore } from "@/stores/profile/profileStore";
import { LoginCredentials, RegisterData } from "@/types/auth";
import { Gender } from "@/types/profile";
import {
  AUTH_ERROR_CODES,
  getErrorCode,
  isExpectedError,
} from "@/utils/errors";
import { createLogger } from "@/utils/logger";
import { useCallback, useState } from "react";

const authService = getAuthService();

const logger = createLogger("useAuth");

/**
 * Authentication Hook
 *
 * Provides convenient access to authentication state and methods.
 * Handles login, registration, logout, and auth state management.
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, login, logout, isLoading } = useAuth();
 *
 * const handleLogin = async () => {
 *   try {
 *     await login({ email: 'user@example.com', password: 'password' });
 *   } catch (error) {
 *     // Handle error
 *   }
 * };
 * ```
 */
export const useAuth = () => {
  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Login with email and password
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setIsLoading(true);
        setError(null);
        logger.info("Logging in user:", credentials.email);

        // Authenticate with Supabase
        const { user, session } = await authService.login(credentials);

        if (!user || !session) {
          throw new Error("Login failed - no user or session returned");
        }

        // Update auth store
        authStore.setSession(user, session);

        // Try to load profile from Supabase
        try {
          await profileStore.loadFromSupabase(user.id);
        } catch (profileError) {
          // Log actual database errors (network issues, etc.)
          logger.error("Error loading profile from database:", profileError);
          // Continue - we'll check if profile exists and create from metadata if needed
        }

        // Check if profile was loaded
        const currentProfile = useProfileStore.getState().profile;
        if (currentProfile) {
          logger.info("Profile loaded from database");
        } else {
          logger.warn("No profile found in database");

          // Check if we have profile data in user metadata (from registration)
          const metadata = user.user_metadata;
          if (metadata && metadata.gender && metadata.birth_year) {
            logger.debug(
              "Creating profile from user metadata after email confirmation",
            );

            // Create profile from metadata
            const profileData = {
              email: user.email || credentials.email,
              firstName: metadata.first_name || undefined,
              lastName: metadata.last_name || undefined,
              gender: metadata.gender as Gender,
              birthYear: metadata.birth_year,
              height: metadata.height,
              weight: metadata.weight,
              restingHeartRate: metadata.resting_heart_rate || undefined,
            };

            // Save profile to database and local storage
            await profileStore.setProfile(profileData, true);
            logger.info("Profile created from metadata");
          } else {
            logger.warn(
              "No profile metadata found - user may need to complete profile onboarding",
            );
            // User will be redirected to profile onboarding by the router
          }
        }

        logger.info("Login successful");
        return { user, session };
      } catch (err) {
        const errorCode = getErrorCode(err);
        const errorMessage =
          err instanceof Error ? err.message : "Login failed";

        // Log expected errors as warnings, unexpected errors as errors
        if (isExpectedError(errorCode)) {
          logger.warn("Login failed with expected error:", errorCode);
        } else {
          logger.error("Login failed with unexpected error:", err);
        }

        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [authStore, profileStore],
  );

  /**
   * Register a new user
   */
  const register = useCallback(
    async (data: RegisterData) => {
      try {
        setIsLoading(true);
        setError(null);
        logger.info("Registering user:", data.email);

        // Register with Supabase Auth
        const { user, session } = await authService.register(data);

        if (!user) {
          throw new Error("Registration failed - no user returned");
        }

        // Check if email confirmation is required
        const requiresEmailConfirmation = !session;

        if (requiresEmailConfirmation) {
          logger.info(
            "Registration successful - email confirmation required for:",
            data.email,
          );
          // Don't create profile or set session - user must confirm email first
          // Profile will be created from metadata when user logs in after confirmation
          const confirmationError = new Error(
            "Please check your email to confirm your account before logging in.",
          );
          (confirmationError as any).code =
            AUTH_ERROR_CODES.CONFIRMATION_REQUIRED;
          throw confirmationError;
        }

        // If we have a session (no email confirmation needed), create profile immediately
        authStore.setSession(user, session);

        // Create profile data
        const profileData = {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender as Gender,
          birthYear: data.birthYear,
          height: data.height,
          weight: data.weight,
          restingHeartRate: data.restingHeartRate,
        };

        // Save profile to Supabase and local storage
        await profileStore.setProfile(profileData, true);

        logger.info("Registration successful with immediate login");
        return { user, session };
      } catch (err) {
        const errorCode = getErrorCode(err);
        const errorMessage =
          err instanceof Error ? err.message : "Registration failed";

        // Log expected errors as warnings, unexpected errors as errors
        if (isExpectedError(errorCode)) {
          logger.warn("Registration failed with expected error:", errorCode);
        } else {
          logger.error("Registration failed with unexpected error:", err);
        }

        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [authStore, profileStore],
  );

  /**
   * Logout current user
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      logger.info("Logging out user");

      // Logout from Supabase
      await authService.logout();

      // Clear local state
      authStore.clearSession();
      profileStore.clearProfile();

      logger.info("Logout successful");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      logger.error("Logout error:", err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [authStore, profileStore]);

  /**
   * Initialize auth (check for existing session)
   */
  const initialize = useCallback(async () => {
    try {
      logger.info("Initializing auth");
      await authStore.initialize();

      // If authenticated, try to load profile
      const { user } = authStore;
      if (user) {
        try {
          await profileStore.loadFromSupabase(user.id);
        } catch (profileError) {
          logger.warn("Could not load profile during init:", profileError);
        }
      }
    } catch (err) {
      logger.error("Initialize error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to initialize auth";
      setError(errorMessage);
    }
  }, [authStore, profileStore]);

  return {
    // State
    user: authStore.user,
    session: authStore.session,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: isLoading || authStore.isLoading,
    error,

    // Methods
    login,
    register,
    logout,
    initialize,
    clearError: () => setError(null),
  };
};
