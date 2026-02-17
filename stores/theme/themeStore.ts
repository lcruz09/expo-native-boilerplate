import {
    createZustandStorage,
    STORAGE_IDS,
} from "@/services/storage/kvStorage";
import { Appearance, ColorSchemeName } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Theme mode options.
 */
export type ThemeMode = "light" | "dark" | "system";

/**
 * Resolved theme (what's actually displayed).
 */
export type ResolvedTheme = "light" | "dark";

/**
 * Theme store state interface.
 */
interface ThemeStore {
  /**
   * User-selected theme mode (light, dark, or system).
   */
  mode: ThemeMode;

  /**
   * Resolved theme based on mode and system preference.
   */
  resolvedTheme: ResolvedTheme;

  /**
   * System color scheme from device settings.
   */
  systemColorScheme: ColorSchemeName;

  /**
   * Set the theme mode and persist to storage.
   */
  setMode: (mode: ThemeMode) => void;

  /**
   * Update system color scheme (called when device theme changes).
   */
  setSystemColorScheme: (scheme: ColorSchemeName) => void;

  /**
   * Get the current resolved theme.
   */
  getResolvedTheme: () => ResolvedTheme;
}

/**
 * Resolve the actual theme based on mode and system preference.
 */
const resolveTheme = (
  mode: ThemeMode,
  systemColorScheme: ColorSchemeName,
): ResolvedTheme => {
  if (mode === "system") {
    return systemColorScheme === "dark" ? "dark" : "light";
  }
  return mode;
};

/**
 * Zustand store for theme management.
 *
 * Features:
 * - Persistent storage with MMKV via Zustand persist middleware
 * - System theme detection
 * - Light/dark/system modes
 *
 * @example
 * ```tsx
 * const { mode, resolvedTheme, setMode } = useThemeStore();
 *
 * // Change theme
 * setMode("dark");
 * setMode("system");
 *
 * // Check current theme
 * if (resolvedTheme === "dark") {
 *   // Apply dark styles
 * }
 * ```
 */
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => {
      // Get system color scheme synchronously to prevent flicker on app start
      const initialSystem: ColorSchemeName = Appearance.getColorScheme();

      return {
        mode: "system", // Default value, will be overridden by persisted value
        systemColorScheme: initialSystem,
        resolvedTheme: resolveTheme("system", initialSystem),

        setMode: (mode) => {
          // Use the current systemColorScheme from the store
          // DO NOT call Appearance.getColorScheme() here as NativeWind affects it
          const systemColorScheme = get().systemColorScheme;
          const newResolvedTheme = resolveTheme(mode, systemColorScheme);

          set({
            mode,
            resolvedTheme: newResolvedTheme,
          });
        },

        setSystemColorScheme: (scheme) => {
          const { mode, systemColorScheme: currentScheme } = get();

          // Keep current scheme if new scheme is null (Android can sometimes return null)
          const newScheme = scheme ?? currentScheme ?? "light";
          const newResolvedTheme = resolveTheme(mode, newScheme);

          set({
            systemColorScheme: newScheme,
            resolvedTheme: newResolvedTheme,
          });
        },

        getResolvedTheme: () => get().resolvedTheme,
      };
    },
    {
      name: "theme-storage", // Storage key in MMKV
      storage: createJSONStorage(() => createZustandStorage(STORAGE_IDS.THEME)),
      // Only persist the mode, not derived state (systemColorScheme and resolvedTheme are derived)
      partialize: (state) => ({ mode: state.mode }),
    },
  ),
);
