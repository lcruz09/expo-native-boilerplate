import { createZustandStorage, STORAGE_IDS } from '@/services/storage/kvStorage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Supported app languages.
 * Extend this union when adding new locales.
 */
export type AppLanguage = 'en' | 'es';

/**
 * User preferences store state interface.
 */
interface UserStore {
  /**
   * User's preferred app language.
   */
  language: AppLanguage;

  /**
   * Whether the user has completed the onboarding flow.
   */
  hasSeenOnboarding: boolean;

  /**
   * Set the preferred language.
   */
  setLanguage: (language: AppLanguage) => void;

  /**
   * Mark onboarding as seen (or reset it).
   */
  setHasSeenOnboarding: (seen: boolean) => void;
}

/**
 * Zustand store for persisted user preferences.
 *
 * Add any app-wide user settings here (language, notifications, etc.).
 * State is persisted to SQLite KV storage and restored on app start.
 *
 * @example
 * ```tsx
 * const { language, setLanguage } = useUserStore();
 * setLanguage("es");
 * ```
 */
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      language: 'en',
      hasSeenOnboarding: false,

      setLanguage: (language) => set({ language }),

      setHasSeenOnboarding: (seen) => set({ hasSeenOnboarding: seen }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => createZustandStorage(STORAGE_IDS.SETTINGS)),
      // Only persist user-controlled preferences, not derived/transient state
      partialize: (state) => ({
        language: state.language,
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
    }
  )
);
