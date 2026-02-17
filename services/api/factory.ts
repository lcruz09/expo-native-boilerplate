import { config } from "@/config";
import { createLogger } from "@/utils/logger";
import { IAuthService } from "./interfaces/IAuthService";
import { IProfileService } from "./interfaces/IProfileService";
import { IRouteService } from "./interfaces/IRouteService";
import { IWorkoutService } from "./interfaces/IWorkoutService";
import { SupabaseAuthService } from "./supabase/SupabaseAuthService";
import { SupabaseProfileService } from "./supabase/SupabaseProfileService";
import { SupabaseRouteService } from "./supabase/SupabaseRouteService";
import { SupabaseWorkoutService } from "./supabase/SupabaseWorkoutService";

const logger = createLogger("APIFactory");

/**
 * API Service Factory
 *
 * Creates service instances based on the configured API provider.
 * This factory pattern enables easy switching between different backend providers
 * (Supabase, Firebase, custom API) without changing consumer code.
 *
 * Services are created as singletons - the same instance is returned on subsequent calls.
 *
 * @example
 * ```typescript
 * const authService = getAuthService();
 * const { user, session } = await authService.login({ email, password });
 * ```
 */

// Singleton instances
let authServiceInstance: IAuthService | null = null;
let profileServiceInstance: IProfileService | null = null;
let workoutServiceInstance: IWorkoutService | null = null;
let routeServiceInstance: IRouteService | null = null;

/**
 * Get the authentication service instance
 *
 * Returns a singleton instance of the auth service for the configured API provider.
 *
 * @returns Auth service implementation
 * @throws Error if API provider is not configured or unsupported
 */
export const getAuthService = (): IAuthService => {
  if (authServiceInstance) {
    return authServiceInstance;
  }

  const provider = config.api.provider;

  switch (provider) {
    case "supabase":
      logger.debug("Creating Supabase auth service");
      authServiceInstance = new SupabaseAuthService();
      return authServiceInstance;

    case "firebase":
      throw new Error(
        "Firebase auth service not yet implemented. Set API_PROVIDER=supabase in your .env file.",
      );

    case "wattr-api":
      throw new Error(
        "Wattr API auth service not yet implemented. Set API_PROVIDER=supabase in your .env file.",
      );

    default:
      throw new Error(
        `Unsupported API provider: ${provider}. Supported providers: supabase, firebase, wattr-api`,
      );
  }
};

/**
 * Get the profile service instance
 *
 * Returns a singleton instance of the profile service for the configured API provider.
 *
 * @returns Profile service implementation
 * @throws Error if API provider is not configured or unsupported
 */
export const getProfileService = (): IProfileService => {
  if (profileServiceInstance) {
    return profileServiceInstance;
  }

  const provider = config.api.provider;

  switch (provider) {
    case "supabase":
      logger.debug("Creating Supabase profile service");
      profileServiceInstance = new SupabaseProfileService();
      return profileServiceInstance;

    case "firebase":
      throw new Error(
        "Firebase profile service not yet implemented. Set API_PROVIDER=supabase in your .env file.",
      );

    case "wattr-api":
      throw new Error(
        "Wattr API profile service not yet implemented. Set API_PROVIDER=supabase in your .env file.",
      );

    default:
      throw new Error(
        `Unsupported API provider: ${provider}. Supported providers: supabase, firebase, wattr-api`,
      );
  }
};

/**
 * Get the workout service instance
 *
 * Returns a singleton instance of the workout service for the configured API provider.
 *
 * @returns Workout service implementation
 * @throws Error if API provider is not configured or unsupported
 */
export const getWorkoutService = (): IWorkoutService => {
  if (workoutServiceInstance) {
    return workoutServiceInstance;
  }

  const provider = config.api.provider;

  switch (provider) {
    case "supabase":
      logger.debug("Creating Supabase workout service");
      workoutServiceInstance = new SupabaseWorkoutService();
      return workoutServiceInstance;

    case "firebase":
      throw new Error(
        "Firebase workout service not yet implemented. Set API_PROVIDER=supabase in your .env file.",
      );

    case "wattr-api":
      throw new Error(
        "Wattr API workout service not yet implemented. Set API_PROVIDER=supabase in your .env file.",
      );

    default:
      throw new Error(
        `Unsupported API provider: ${provider}. Supported providers: supabase, firebase, wattr-api`,
      );
  }
};

/**
 * Get the route service instance
 *
 * Returns a singleton instance of the route service for the configured API provider.
 *
 * @returns Route service implementation
 * @throws Error if API provider is not configured or unsupported
 */
export const getRouteService = (): IRouteService => {
  if (routeServiceInstance) {
    return routeServiceInstance;
  }

  const provider = config.api.provider;

  switch (provider) {
    case "supabase":
      logger.debug("Creating Supabase route service");
      routeServiceInstance = new SupabaseRouteService();
      return routeServiceInstance;

    case "firebase":
      throw new Error(
        "Firebase route service not yet implemented. Set API_PROVIDER=supabase in your .env file.",
      );

    case "wattr-api":
      throw new Error(
        "Wattr API route service not yet implemented. Set API_PROVIDER=supabase in your .env file.",
      );

    default:
      throw new Error(
        `Unsupported API provider: ${provider}. Supported providers: supabase, firebase, wattr-api`,
      );
  }
};

/**
 * Reset service instances (useful for testing)
 *
 * @internal
 */
export const resetServiceInstances = () => {
  authServiceInstance = null;
  profileServiceInstance = null;
  workoutServiceInstance = null;
  routeServiceInstance = null;
};
