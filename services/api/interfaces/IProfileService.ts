import type { UserProfile } from "./types";

// Re-export type for convenience
export type { UserProfile };

/**
 * Profile Service Interface
 *
 * Vendor-agnostic interface for user profile operations.
 * All profile service implementations must conform to this interface.
 *
 * This allows easy switching between different backend providers
 * (Supabase, Firebase, custom API) without changing consumer code.
 *
 * @example
 * ```typescript
 * const profileService = getProfileService();
 * const profile = await profileService.getProfile(userId);
 * ```
 */
export interface IProfileService {
  /**
   * Create a new user profile
   *
   * Stores profile data in the backend database.
   * The profile is linked to the user's authentication account via userId.
   *
   * @param userId - User's authentication ID
   * @param email - User's email address
   * @param profileData - Profile data to save
   * @returns Created profile
   * @throws Error if creation fails
   */
  createProfile(
    userId: string,
    email: string,
    profileData: Partial<UserProfile>,
  ): Promise<UserProfile>;

  /**
   * Get a user's profile
   *
   * Retrieves profile data from the backend database.
   *
   * @param userId - User's authentication ID
   * @returns Profile data or null if not found
   * @throws Error if fetch fails (not found returns null, network errors throw)
   */
  getProfile(userId: string): Promise<UserProfile | null>;

  /**
   * Update a user's profile
   *
   * Updates existing profile data with the provided changes.
   * Only the fields present in the updates object will be modified.
   *
   * @param userId - User's authentication ID
   * @param updates - Partial profile data to update
   * @returns Updated profile
   * @throws Error if update fails or profile not found
   */
  updateProfile(
    userId: string,
    updates: Partial<UserProfile>,
  ): Promise<UserProfile>;

  /**
   * Delete a user's profile
   *
   * Permanently removes profile data from the backend database.
   * This does not delete the authentication account.
   *
   * @param userId - User's authentication ID
   * @throws Error if deletion fails
   */
  deleteProfile(userId: string): Promise<void>;
}
