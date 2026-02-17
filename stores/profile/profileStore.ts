import { getProfileService } from "@/services/api/factory";
import {
    createZustandStorage,
    STORAGE_IDS,
} from "@/services/storage/kvStorage";
import { UserProfile } from "@/types/profile";
import { createLogger } from "@/utils/logger";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useAuthStore } from "../auth/authStore";

const profileService = getProfileService();
const logger = createLogger("ProfileStore");

/**
 * Profile Store State Interface
 */
interface ProfileStore {
  /**
   * User profile data (null if not yet created)
   */
  profile: UserProfile | null;

  /**
   * Set user profile
   */
  setProfile: (profile: UserProfile, syncToSupabase?: boolean) => Promise<void>;

  /**
   * Update existing profile
   */
  updateProfile: (
    profile: Partial<UserProfile>,
    syncToSupabase?: boolean,
  ) => Promise<void>;

  /**
   * Clear profile
   */
  clearProfile: () => void;

  /**
   * Sync profile with Supabase
   */
  syncWithSupabase: (userId: string, email: string) => Promise<void>;

  /**
   * Load profile from Supabase
   */
  loadFromSupabase: (userId: string) => Promise<void>;
}

/**
 * User Profile Store
 *
 * Manages user profile data with MMKV persistence.
 * Used for calorie calculations and user preferences.
 *
 * @example
 * ```tsx
 * const { profile, setProfile } = useProfileStore();
 *
 * // Create profile during registration
 * setProfile({
 *   birthYear: 1990,
 *   weight: 70,
 *   height: 175,
 *   gender: Gender.MALE
 * });
 *
 * // Check if user has a profile
 * if (!profile) {
 *   // Redirect to registration
 * }
 * ```
 */
export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: null,

      setProfile: async (profile, syncToSupabase = true) => {
        logger.debug("Setting profile");

        // Update local state
        set({
          profile,
        });

        // Optionally sync to Supabase
        if (syncToSupabase) {
          const { user } = useAuthStore.getState();
          if (user && profile.email) {
            try {
              await profileService.createProfile(
                user.id,
                profile.email,
                profile,
              );
              logger.debug("Profile synced to Supabase");
            } catch (error) {
              logger.error("Failed to sync profile to Supabase:", error);
              // Don't throw - local profile is still saved
            }
          }
        }
      },

      updateProfile: async (updates, syncToSupabase = true) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          const updatedProfile = { ...currentProfile, ...updates };

          // Update local state
          set({
            profile: updatedProfile,
          });

          // Optionally sync to Supabase
          if (syncToSupabase) {
            const { user } = useAuthStore.getState();
            if (user) {
              try {
                await profileService.updateProfile(user.id, updates);
                logger.debug("Profile updates synced to Supabase");
              } catch (error) {
                logger.error(
                  "Failed to sync profile updates to Supabase:",
                  error,
                );
                // Don't throw - local profile is still saved
              }
            }
          }
        }
      },

      clearProfile: () => {
        logger.info("Clearing profile");
        set({
          profile: null,
        });
      },

      syncWithSupabase: async (userId: string, email: string) => {
        try {
          logger.debug("Syncing profile with Supabase");
          const currentProfile = get().profile;

          if (!currentProfile) {
            logger.warn("No local profile to sync");
            return;
          }

          // Try to create or update profile in Supabase
          try {
            await profileService.createProfile(userId, email, currentProfile);
            logger.debug("Profile created in Supabase");
          } catch (error) {
            // If creation fails, try updating
            logger.debug("Profile exists, updating instead");
            await profileService.updateProfile(userId, currentProfile);
          }
        } catch (error) {
          logger.error("Failed to sync with Supabase:", error);
          throw error;
        }
      },

      loadFromSupabase: async (userId: string) => {
        try {
          logger.debug("Loading profile from Supabase");
          const profile = await profileService.getProfile(userId);

          if (profile) {
            logger.debug("Profile loaded from Supabase");
            set({
              profile,
            });
          } else {
            logger.debug("No profile found in Supabase");
          }
        } catch (error) {
          logger.error("Failed to load profile from Supabase:", error);
          throw error;
        }
      },
    }),
    {
      name: "user-profile",
      storage: createJSONStorage(() =>
        createZustandStorage(STORAGE_IDS.USER_PROFILE),
      ),
    },
  ),
);
