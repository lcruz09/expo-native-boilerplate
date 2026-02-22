import { config } from '@/config';
import { secureStorage } from '@/services/storage/secureStorage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.publishableKey;

/**
 * Supabase Client Instance
 *
 * Configured with:
 * - Modern publishable key (sb_publishable_...) for client-side security
 * - Secure token storage using expo-secure-store
 * - Automatic session refresh
 * - Persistent sessions across app restarts
 *
 * Uses centralized AppConfig for configuration management.
 * In test environments, values are loaded from jest.env.js.
 *
 * See: https://supabase.com/docs/guides/api/api-keys
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: secureStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public',
  },
});

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(config.supabase.url && config.supabase.publishableKey);
};
