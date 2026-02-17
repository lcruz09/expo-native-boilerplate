import Constants from "expo-constants";
import { createLogger } from "@/utils/logger";

const appExtra = (Constants.expoConfig?.extra ?? {}) as {
  sentry?: {
    dsn?: string;
  };
};

const logger = createLogger("Config");

/**
 * Application Configuration
 *
 * Centralized configuration management for the app.
 * Loads environment variables and provides type-safe access to configuration values.
 */
class AppConfig {
  /**
   * MapTiler Configuration
   *
   * MapTiler provides high-quality map tiles with a free tier (100k map views/month).
   * Sign up at https://www.maptiler.com/cloud/pricing/ to get your API key.
   *
   * Available map styles:
   * - streets-v2: Default street map
   * - outdoor-v2: Outdoor/hiking focused
   * - satellite: Satellite imagery
   * - hybrid: Satellite with labels
   * - topo-v2: Topographic map
   * - winter-v2: Winter sports focused
   * - basic-v2: Minimalist style
   */
  readonly mapTiler = {
    /**
     * MapTiler API key from environment variables
     */
    apiKey: process.env.EXPO_PUBLIC_MAPTILER_API_KEY || "",

    /**
     * Get the style URL for a given map style
     * @param style - The map style to use (default: "streets-v2")
     * @returns Complete style URL with API key
     */
    getStyleUrl: (
      style:
        | "streets-v2"
        | "outdoor-v2"
        | "satellite"
        | "hybrid"
        | "topo-v2"
        | "winter-v2"
        | "basic-v2" = "streets-v2",
    ): string => {
      const apiKey = process.env.EXPO_PUBLIC_MAPTILER_API_KEY;
      if (!apiKey) {
        logger.warn(
          "⚠️ MapTiler API key not found. Using demo tiles. Add EXPO_PUBLIC_MAPTILER_API_KEY to .env",
        );
        return "https://demotiles.maplibre.org/style.json";
      }
      return `https://api.maptiler.com/maps/${style}/style.json?key=${apiKey}`;
    },

    /**
     * Check if MapTiler is configured
     */
    isConfigured: (): boolean => {
      return !!process.env.EXPO_PUBLIC_MAPTILER_API_KEY;
    },
  };

  /**
   * Supabase Configuration
   *
   * Backend services for authentication and data storage
   * Uses modern publishable keys (sb_publishable_...) instead of deprecated JWT-based anon keys
   */
  readonly supabase = {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || "",
    publishableKey: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
    authCallbackUrl:
      process.env.EXPO_PUBLIC_AUTH_CALLBACK_URL || "wattr-app://auth-callback",
  };

  /**
   * Sentry configuration (error monitoring)
   */
  readonly sentry = {
    dsn: appExtra.sentry?.dsn || process.env.EXPO_PUBLIC_SENTRY_DSN || "",
  };

  /**
   * API Provider Configuration
   *
   * Determines which backend API provider to use for authentication and data storage.
   * This allows easy switching between different backend services (Supabase, Firebase, custom API).
   *
   * Supported providers:
   * - "supabase": Use Supabase for authentication and data storage
   * - "firebase": Use Firebase (not yet implemented)
   * - "wattr-api": Use custom Wattr API (not yet implemented)
   *
   * Set EXPO_PUBLIC_API_PROVIDER in your .env file to configure.
   * Defaults to "supabase" if not set.
   */
  readonly api = {
    /**
     * API provider selection
     * Build-time configuration - requires rebuild to change
     */
    provider: (process.env.EXPO_PUBLIC_API_PROVIDER || "supabase") as
      | "supabase"
      | "firebase"
      | "wattr-api",
  };

  /**
   * Validate all required environment variables
   */
  validate(): void {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate API provider
    const validProviders = ["supabase", "firebase", "wattr-api"];
    if (!validProviders.includes(this.api.provider)) {
      errors.push(
        `Invalid API provider: ${this.api.provider}. Must be one of: ${validProviders.join(", ")}`,
      );
    }

    // Validate provider-specific configuration
    if (this.api.provider === "supabase") {
      if (!this.supabase.url) {
        errors.push("EXPO_PUBLIC_SUPABASE_URL is not set");
      }
      if (!this.supabase.publishableKey) {
        errors.push("EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set");
      }
    } else if (this.api.provider === "firebase") {
      errors.push("Firebase provider is not yet implemented");
    } else if (this.api.provider === "wattr-api") {
      errors.push("Wattr API provider is not yet implemented");
    }

    // Validate MapTiler configuration (optional but recommended)
    if (!this.mapTiler.apiKey) {
      warnings.push(
        "EXPO_PUBLIC_MAPTILER_API_KEY is not set - using demo tiles with limitations",
      );
    }

    if (!this.sentry.dsn) {
      warnings.push(
        "Sentry DSN is not set - add SENTRY_DSN to your environment to enable monitoring",
      );
    }

    if (errors.length > 0) {
      logger.warn("⚠️ Missing required environment variables:");
      errors.forEach((error) => logger.warn(`  - ${error}`));
      logger.warn("Please check your .env file for required configuration.");
    }

    if (warnings.length > 0) {
      logger.info("ℹ️ Optional configuration:");
      warnings.forEach((warning) => logger.info(`  - ${warning}`));
    }
  }
}

// Export singleton instance
export const config = new AppConfig();

// Validate config on import (development only)
if (__DEV__) {
  config.validate();
}
