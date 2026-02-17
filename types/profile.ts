/**
 * User Profile Types
 *
 * Type definitions for user profile data including physical characteristics
 * used for calorie calculations.
 */

/**
 * Gender options for calorie calculation
 */
export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

/**
 * User profile interface containing personal information
 * for accurate calorie calculation.
 */
export interface UserProfile {
  /**
   * User's birth year (required for age calculation)
   */
  birthYear: number;

  /**
   * User's weight in kilograms (20-300)
   */
  weight: number;

  /**
   * User's height in centimeters (100-250)
   */
  height: number;

  /**
   * User's gender for calorie formula selection
   */
  gender: Gender;

  /**
   * User's resting heart rate in BPM (optional, 30-100)
   * Used for more accurate Heart Rate Reserve calculations
   */
  restingHeartRate?: number;

  /**
   * User's first name (optional)
   */
  firstName?: string;

  /**
   * User's last name (optional)
   */
  lastName?: string;

  /**
   * User's email address (optional)
   * Synced from Supabase auth
   */
  email?: string;
}

/**
 * Calculate age from birth year
 */
export const calculateAgeFromBirthYear = (birthYear: number): number => {
  return new Date().getFullYear() - birthYear;
};
