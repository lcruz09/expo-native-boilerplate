import { AuthError } from "@/types/auth";
import { Gender, UserProfile } from "@/types/profile";
import { AuthError as SupabaseAuthError } from "@supabase/supabase-js";

/**
 * Supabase Utilities
 *
 * Utility functions for working with Supabase-specific data types and errors.
 */

/**
 * Profile database type
 * Matches the structure in Supabase database
 */
export interface ProfileRow {
  id: string; // UUID - matches auth.users.id
  email: string;
  first_name: string | null;
  last_name: string | null;
  gender: "male" | "female" | "other";
  birth_year: number;
  height: number; // cm
  weight: number; // kg
  resting_heart_rate: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Convert Supabase auth error to app auth error
 */
export const handleAuthError = (
  error: SupabaseAuthError | Error,
): AuthError => {
  if ("status" in error) {
    const supabaseError = error as SupabaseAuthError;
    return {
      message: supabaseError.message,
      code: supabaseError.code,
    };
  }

  return {
    message: error.message || "An unexpected error occurred",
  };
};

/**
 * Convert UserProfile to ProfileRow for database
 */
export const profileToRow = (
  userId: string,
  email: string,
  profile: Partial<UserProfile>,
): Partial<ProfileRow> => {
  return {
    id: userId,
    email,
    first_name: profile.firstName || null,
    last_name: profile.lastName || null,
    gender: profile.gender,
    birth_year: profile.birthYear,
    height: profile.height,
    weight: profile.weight,
    resting_heart_rate: profile.restingHeartRate || null,
  };
};

/**
 * Convert ProfileRow to UserProfile
 */
export const rowToProfile = (row: ProfileRow): UserProfile => {
  // Convert string gender to Gender enum
  let gender: Gender;
  switch (row.gender) {
    case "male":
      gender = Gender.MALE;
      break;
    case "female":
      gender = Gender.FEMALE;
      break;
    case "other":
      gender = Gender.OTHER;
      break;
    default:
      gender = Gender.OTHER;
  }

  return {
    email: row.email,
    firstName: row.first_name || undefined,
    lastName: row.last_name || undefined,
    gender,
    birthYear: row.birth_year,
    height: row.height,
    weight: row.weight,
    restingHeartRate: row.resting_heart_rate || undefined,
  };
};
