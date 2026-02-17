/**
 * Error Handling Utilities
 *
 * Provides type-safe error code extraction and constants for common error codes.
 */

/**
 * Supabase Auth Error Codes
 *
 * Common error codes returned by Supabase Auth API.
 * @see https://supabase.com/docs/reference/javascript/auth-error-codes
 */
export const AUTH_ERROR_CODES = {
  EMAIL_NOT_CONFIRMED: "email_not_confirmed",
  CONFIRMATION_REQUIRED: "confirmation_required",
  INVALID_CREDENTIALS: "invalid_credentials",
  USER_ALREADY_REGISTERED: "user_already_registered",
  WEAK_PASSWORD: "weak_password",
  OVER_EMAIL_SEND_RATE_LIMIT: "over_email_send_rate_limit",
  INVALID_EMAIL: "invalid_email",
  EMAIL_NOT_FOUND: "email_not_found",
} as const;

/**
 * Type for all known auth error codes
 */
export type AuthErrorCode =
  (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

/**
 * Expected/known error codes that are part of normal user flow.
 * These should be logged as warnings, not errors.
 *
 * These are user-facing errors we handle gracefully (invalid credentials,
 * unconfirmed email, etc.) - not system errors or bugs.
 */
export const EXPECTED_AUTH_ERRORS = [
  AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED,
  AUTH_ERROR_CODES.CONFIRMATION_REQUIRED,
  AUTH_ERROR_CODES.INVALID_CREDENTIALS,
  AUTH_ERROR_CODES.USER_ALREADY_REGISTERED,
  AUTH_ERROR_CODES.WEAK_PASSWORD,
  AUTH_ERROR_CODES.OVER_EMAIL_SEND_RATE_LIMIT,
  AUTH_ERROR_CODES.INVALID_EMAIL,
  AUTH_ERROR_CODES.EMAIL_NOT_FOUND,
] as const;

/**
 * Extracts the error code from an error object.
 *
 * Safely checks if the error object has a 'code' property and returns it.
 * Returns the code if found, 'unknown' if the error doesn't have a code.
 *
 * @param error - The error object to extract the code from
 * @returns The error code as a string, or 'unknown' if no code is present
 *
 * @example
 * ```typescript
 * try {
 *   await supabase.auth.signIn(credentials);
 * } catch (error) {
 *   const code = getErrorCode(error);
 *   if (code === AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED) {
 *     // Handle unconfirmed email
 *   }
 * }
 * ```
 */
export const getErrorCode = (error: unknown): string | "unknown" => {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code: unknown }).code;
    return typeof code === "string" ? code : "unknown";
  }
  return "unknown";
};

/**
 * Type guard to check if an error code is a known auth error code
 *
 * @param code - The error code to check
 * @returns True if the code is a known auth error code
 *
 * @example
 * ```typescript
 * const code = getErrorCode(error);
 * if (isAuthErrorCode(code)) {
 *   // TypeScript knows code is AuthErrorCode here
 *   console.log("Known auth error:", code);
 * }
 * ```
 */
export const isAuthErrorCode = (code: string): code is AuthErrorCode => {
  return Object.values(AUTH_ERROR_CODES).includes(code as AuthErrorCode);
};

/**
 * Check if an error code is an expected/known error.
 *
 * Expected errors are part of normal user flow (invalid credentials, unconfirmed email, etc.)
 * and should be logged as warnings, not errors.
 *
 * @param code - The error code to check
 * @returns True if the error code is expected
 *
 * @example
 * ```typescript
 * const code = getErrorCode(error);
 * if (isExpectedError(code)) {
 *   logger.warn("Expected auth error:", code);
 * } else {
 *   logger.error("Unexpected error:", error);
 * }
 * ```
 */
export const isExpectedError = (code: string | "unknown"): boolean => {
  return EXPECTED_AUTH_ERRORS.includes(code as AuthErrorCode);
};
