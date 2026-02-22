/**
 * Jest Environment Setup
 *
 * Sets up environment variables for test execution.
 * This file runs before all tests and mocks.
 *
 * ## How it works:
 * 1. Provides default test values for Supabase credentials
 * 2. Values are only used if not already set (CI/CD can override)
 * 3. Keeps test configuration out of production code
 * 4. All tests run with consistent, predictable environment
 *
 * ## Optional: Create .env.test for local overrides
 * You can create a `.env.test` file in the root directory to override
 * these defaults with your own test Supabase project:
 *
 * ```
 * EXPO_PUBLIC_SUPABASE_URL=https://your-test-project.supabase.co
 * EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * ```
 *
 * Note: `.env.test` is git-ignored, so it won't be committed.
 */

// Set test environment variables with fallback defaults
process.env.EXPO_PUBLIC_SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://test-placeholder.supabase.co';

process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'test_key_for_ci_environment';

process.env.EXPO_PUBLIC_AUTH_CALLBACK_URL =
  process.env.EXPO_PUBLIC_AUTH_CALLBACK_URL || 'wattr-app://auth-callback';

// Provide minimal FormData polyfill before Expo test setup runs
if (typeof global.FormData === 'undefined') {
  class FormDataPolyfill {
    append() {
      // no-op for tests
    }
  }

  // @ts-ignore - assign to global for Jest environment
  global.FormData = FormDataPolyfill;
  // @ts-ignore - align with globalThis references
  globalThis.FormData = FormDataPolyfill;
}
