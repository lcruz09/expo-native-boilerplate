/**
 * UUID Generation Utility
 *
 * Provides UUID v4 generation for workout and route IDs.
 * Compatible with PostgreSQL UUID type in Supabase.
 */

/**
 * Generate a UUID v4 (random UUID)
 *
 * @returns A UUID v4 string in format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 *
 * @example
 * ```typescript
 * const id = generateUUID();
 * // => "550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
export const generateUUID = (): string => {
  // Use crypto.randomUUID() if available (modern browsers/React Native >= 0.71)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback: Manual UUID v4 generation
  // Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  // Where:
  // - 4 indicates UUID version 4
  // - y is one of [8, 9, A, B] (variant bits)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Validate if a string is a valid UUID
 *
 * @param uuid - String to validate
 * @returns True if valid UUID format
 *
 * @example
 * ```typescript
 * isValidUUID("550e8400-e29b-41d4-a716-446655440000"); // => true
 * isValidUUID("invalid"); // => false
 * isValidUUID("workout-123456"); // => false
 * ```
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};
