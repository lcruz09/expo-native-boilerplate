import { ResolvedTheme, ThemeMode, useThemeStore } from '@/stores/theme/themeStore';

/**
 * Return type for the useTheme hook.
 */
export interface UseThemeReturn {
  /**
   * Current theme mode (light, dark, or system).
   */
  mode: ThemeMode;

  /**
   * Resolved theme (what's actually displayed).
   */
  theme: ResolvedTheme;

  /**
   * Whether dark mode is active.
   */
  isDark: boolean;

  /**
   * Whether light mode is active.
   */
  isLight: boolean;

  /**
   * Set the theme mode.
   */
  setTheme: (mode: ThemeMode) => void;

  /**
   * Toggle between light and dark mode.
   * If currently on system, switches to dark.
   */
  toggleTheme: () => void;
}

/**
 * Hook to access and control the app theme.
 *
 * Provides easy access to theme state and control functions.
 *
 * @returns Theme state and control functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, isDark, setTheme, toggleTheme } = useTheme();
 *
 *   return (
 *     <View className={isDark ? "bg-background-dark" : "bg-background"}>
 *       <Button onPress={toggleTheme}>
 *         Switch to {isDark ? "Light" : "Dark"} Mode
 *       </Button>
 *     </View>
 *   );
 * }
 * ```
 */
export const useTheme = (): UseThemeReturn => {
  const mode = useThemeStore((state) => state.mode);
  const theme = useThemeStore((state) => state.resolvedTheme);
  const setMode = useThemeStore((state) => state.setMode);

  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  const toggleTheme = () => {
    if (theme === 'dark') {
      setMode('light');
    } else {
      setMode('dark');
    }
  };

  return {
    mode,
    theme,
    isDark,
    isLight,
    setTheme: setMode,
    toggleTheme,
  };
};
