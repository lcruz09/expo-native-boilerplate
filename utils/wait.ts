/**
 * Wait Utility
 *
 * Provides a simple async delay function.
 *
 * @example
 * ```typescript
 * import { wait } from '@/utils/wait';
 *
 * // Wait for 1 second
 * await wait(1000);
 *
 * // Wait for 100ms before retry
 * await wait(100);
 * ```
 */

/**
 * Asynchronously waits for the specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to wait
 * @returns A promise that resolves after the specified delay
 *
 * @example
 * ```typescript
 * // Wait 500ms between API calls
 * await wait(500);
 * console.log('500ms have passed');
 * ```
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
