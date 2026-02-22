import { createLogger } from '@/utils/logger';
import Constants from 'expo-constants';

const appExtra = (Constants.expoConfig?.extra ?? {}) as {
  sentry?: {
    dsn?: string;
  };
};

const logger = createLogger('Config');

/**
 * Application Configuration
 *
 * Centralized configuration management for the app.
 * Loads environment variables and provides type-safe access to configuration values.
 */
class AppConfig {
  /**
   * Application name
   */
  readonly name = 'Expo Native Boilerplate';

  /**
   * Supabase Configuration
   *
   * Backend services for authentication and data storage
   * Uses modern publishable keys (sb_publishable_...) instead of deprecated JWT-based anon keys
   */
  readonly supabase = {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    publishableKey: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '',
    authCallbackUrl:
      process.env.EXPO_PUBLIC_AUTH_CALLBACK_URL || 'expo-native-boilerplate://auth-callback',
  };

  /**
   * Sentry configuration (error monitoring)
   */
  readonly sentry = {
    dsn: appExtra.sentry?.dsn || process.env.EXPO_PUBLIC_SENTRY_DSN || '',
  };

  /**
   * API Provider Configuration
   *
   * Determines which backend API provider to use for authentication and data storage.
   * Currently supports Supabase out of the box.
   */
  readonly api = {
    /**
     * API provider selection
     */
    provider: (process.env.EXPO_PUBLIC_API_PROVIDER || 'supabase') as 'supabase',
  };

  /**
   * Validate all required environment variables
   */
  validate(): void {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate API provider
    if (this.api.provider !== 'supabase') {
      errors.push(
        `Invalid API provider: ${this.api.provider}. Only "supabase" is currently supported.`
      );
    }

    // Validate Supabase configuration
    if (this.api.provider === 'supabase') {
      if (!this.supabase.url) {
        errors.push('EXPO_PUBLIC_SUPABASE_URL is not set');
      }
      if (!this.supabase.publishableKey) {
        errors.push('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set');
      }
    }

    if (!this.sentry.dsn) {
      warnings.push(
        'Sentry DSN is not set - add SENTRY_DSN to your environment to enable monitoring'
      );
    }

    if (errors.length > 0) {
      const message = [
        'Missing required environment variables:',
        ...errors.map((e) => `  - ${e}`),
        'Please check your .env file. See .env.example for reference.',
      ].join('\n');
      throw new Error(message);
    }

    if (warnings.length > 0) {
      logger.info('ℹ️ Optional configuration:');
      warnings.forEach((warning) => logger.info(`  - ${warning}`));
    }
  }
}

// Export singleton instance
export const config = new AppConfig();

// Validate required config on startup — throws immediately so misconfigured
// builds fail fast rather than surfacing cryptic runtime errors later.
config.validate();
