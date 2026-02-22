import { config } from '@/config';
import { createLogger } from '@/utils/logger';
import { IAuthService } from './interfaces/IAuthService';
import { SupabaseAuthService } from './supabase/SupabaseAuthService';

const logger = createLogger('APIFactory');

/**
 * API Service Factory
 *
 * Creates service instances based on the configured API provider.
 */

// Singleton instances
let authServiceInstance: IAuthService | null = null;

/**
 * Get the authentication service instance
 */
export const getAuthService = (): IAuthService => {
  if (authServiceInstance) {
    return authServiceInstance;
  }

  const provider = config.api.provider;

  switch (provider) {
    case 'supabase':
      logger.debug('Creating Supabase auth service');
      authServiceInstance = new SupabaseAuthService();
      return authServiceInstance;

    default:
      throw new Error(`Unsupported API provider: ${provider}. Supported providers: supabase`);
  }
};

/**
 * Reset service instances (useful for testing)
 */
export const resetServiceInstances = () => {
  authServiceInstance = null;
};
