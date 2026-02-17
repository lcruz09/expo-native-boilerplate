import { UserProfile } from "@/types/profile";
import { createLogger } from "@/utils/logger";
import { IProfileService } from "../interfaces/IProfileService";
import { supabase } from "./client";
import { ProfileRow, profileToRow, rowToProfile } from "./utils";

const logger = createLogger("SupabaseProfileService");

/**
 * Supabase Profile Service
 *
 * Implementation of IProfileService for Supabase database.
 * Handles all profile CRUD operations using Supabase as the backend.
 *
 * @example
 * ```typescript
 * const profileService = new SupabaseProfileService();
 * const profile = await profileService.getProfile(userId);
 * ```
 */
export class SupabaseProfileService implements IProfileService {
  /**
   * Create a new profile in Supabase
   */
  async createProfile(
    userId: string,
    email: string,
    profileData: Partial<UserProfile>,
  ): Promise<UserProfile> {
    logger.debug("Creating profile for user:", userId);

    const row = profileToRow(userId, email, profileData);

    const { data, error } = await supabase
      .from("profiles")
      .insert(row)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }

    logger.debug("Profile created successfully for user:", userId);
    return rowToProfile(data as ProfileRow);
  }

  /**
   * Get a profile from Supabase
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    logger.debug("Fetching profile for user:", userId);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        logger.debug("No profile found for user:", userId);
        return null;
      }
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    logger.debug("Profile fetched successfully for user:", userId);
    return rowToProfile(data as ProfileRow);
  }

  /**
   * Update a profile in Supabase
   */
  async updateProfile(
    userId: string,
    updates: Partial<UserProfile>,
  ): Promise<UserProfile> {
    logger.debug("Updating profile for user:", userId);

    // Get current profile to preserve email
    const currentProfile = await this.getProfile(userId);
    if (!currentProfile) {
      throw new Error("Profile not found");
    }

    const row = profileToRow(userId, currentProfile.email || "", updates);

    const { data, error } = await supabase
      .from("profiles")
      .update(row)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    logger.debug("Profile updated successfully for user:", userId);
    return rowToProfile(data as ProfileRow);
  }

  /**
   * Delete a profile from Supabase
   */
  async deleteProfile(userId: string): Promise<void> {
    logger.debug("Deleting profile for user:", userId);

    const { error } = await supabase.from("profiles").delete().eq("id", userId);

    if (error) {
      throw new Error(`Failed to delete profile: ${error.message}`);
    }

    logger.debug("Profile deleted successfully for user:", userId);
  }
}
