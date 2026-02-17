/**
 * Format a number for display with consistent decimal places and handling of null/undefined values.
 *
 * @param value - The number to format (can be null, undefined, or a number)
 * @param decimalPlaces - Number of decimal places to display (default: 0)
 * @param defaultValue - Value to return if input is null/undefined (default: "0")
 * @returns Formatted string representation of the number
 *
 * @example
 * ```typescript
 * formatNumber(123.456, 2) // "123.46"
 * formatNumber(123, 2) // "123.00"
 * formatNumber(null, 0, "-") // "-"
 * formatNumber(undefined, 1) // "0.0"
 * ```
 */
export const formatNumber = (
  value: number | null | undefined,
  decimalPlaces = 0,
  defaultValue = "0",
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return defaultValue;
  }

  return value.toFixed(decimalPlaces);
};

/**
 * Format a number for display with automatic decimal place selection based on magnitude.
 * - Integers (no decimals): 0 decimal places
 * - Small numbers (< 10): 2 decimal places
 * - Medium numbers (10-100): 1 decimal place
 * - Large numbers (>= 100): 0 decimal places
 *
 * @param value - The number to format (can be null, undefined, or a number)
 * @param defaultValue - Value to return if input is null/undefined (default: "0")
 * @returns Formatted string representation of the number
 *
 * @example
 * ```typescript
 * formatNumberAuto(123.456) // "123"
 * formatNumberAuto(12.456) // "12.5"
 * formatNumberAuto(1.456) // "1.46"
 * formatNumberAuto(null, "-") // "-"
 * ```
 */
export const formatNumberAuto = (
  value: number | null | undefined,
  defaultValue = "0",
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return defaultValue;
  }

  // Check if it's an integer
  if (Number.isInteger(value)) {
    return value.toString();
  }

  // Automatic decimal places based on magnitude
  if (Math.abs(value) < 10) {
    return value.toFixed(2);
  } else if (Math.abs(value) < 100) {
    return value.toFixed(1);
  } else {
    return value.toFixed(0);
  }
};
