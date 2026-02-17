import { getAuthService } from "@/services/api/factory";
import {
    createZustandStorage,
    STORAGE_IDS,
} from "@/services/storage/kvStorage";
import { AuthSession, AuthUser } from "@/types/auth";
import { createLogger } from "@/utils/logger";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const authService = getAuthService();
const logger = createLogger("AuthStore");

/**
 * Auth Store State Interface
 */
interface AuthStore {
  /**
   * Current authenticated user
   */
  user: AuthUser | null;

  /**
   * Current auth session
   */
  session: AuthSession | null;

  /**
   * Whether user is authenticated
   */
  isAuthenticated: boolean;

  /**
   * Loading state
   */
  isLoading: boolean;

  /**
   * Set user session
   */
  setSession: (user: AuthUser | null, session: AuthSession | null) => void;

  /**
   * Clear user session (logout)
   */
  clearSession: () => void;

  /**
   * Initialize auth state (check for existing session)
   */
  initialize: () => Promise<void>;

  /**
   * Set loading state
   */
  setLoading: (isLoading: boolean) => void;
}

/**
 * Authentication Store
 *
 * Manages authentication state with Supabase integration.
 * Persists auth session data locally for offline access.
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, initialize } = useAuthStore();
 *
 * // Initialize auth on app start
 * useEffect(() => {
 *   initialize();
 * }, []);
 *
 * // Check auth status
 * if (isAuthenticated) {
 *   // User is logged in
 * }
 * ```
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: true,

      setSession: (user, session) => {
        logger.debug("Setting session:", user?.email);
        set({
          user,
          session,
          isAuthenticated: Boolean(user && session),
          isLoading: false,
        });
      },

      clearSession: () => {
        logger.info("Clearing session");
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      initialize: async () => {
        try {
          logger.debug("Initializing auth store");
          set({ isLoading: true });

          // Try to get current session
          const session = await authService.getCurrentSession();

          if (session && session.user) {
            logger.debug("Found existing session for:", session.user.email);
            get().setSession(session.user, session);
          } else {
            logger.debug("No existing session found");
            get().clearSession();
          }
        } catch (error) {
          logger.error("Error initializing auth:", error);
          get().clearSession();
        }
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => createZustandStorage(STORAGE_IDS.AUTH)),
      // Only persist non-sensitive data
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

/**
 * Setup auth state listener
 * Should be called once at app initialization
 */
export const setupAuthListener = () => {
  logger.debug("Setting up auth state listener");

  return authService.onAuthStateChange((event, session) => {
    logger.info("Auth state changed:", event);

    const store = useAuthStore.getState();

    if (event === "SIGNED_IN" && session) {
      store.setSession(session.user, session);
    } else if (event === "SIGNED_OUT") {
      store.clearSession();
    } else if (event === "TOKEN_REFRESHED" && session) {
      store.setSession(session.user, session);
    } else if (event === "USER_UPDATED" && session) {
      store.setSession(session.user, session);
    }
  });
};
