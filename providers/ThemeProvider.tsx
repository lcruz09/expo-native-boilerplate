import { useThemeStore } from '@/stores/theme/themeStore';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import React, { ReactNode, useEffect, useMemo, useRef } from 'react';
import { Appearance } from 'react-native';

/**
 * ThemeProvider component that manages theme state and system theme detection.
 *
 * This provider:
 * - Detects system color scheme changes
 * - Updates the theme store accordingly
 * - Syncs with NativeWind's dark mode
 * - Should wrap the entire app at the root level
 *
 * @example
 * ```tsx
 * // In app/_layout.tsx
 * export default function RootLayout() {
 *   return (
 *     <ThemeProvider>
 *       <App />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { setColorScheme } = useNativeWindColorScheme();
  const setSystemColorScheme = useThemeStore((state) => state.setSystemColorScheme);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);

  // Use refs to track OS theme separately from app theme
  const lastOsThemeRef = useRef<'light' | 'dark' | null | undefined>(null);
  const lastAppThemeRef = useRef<'light' | 'dark'>(resolvedTheme);

  // Initialize NativeWind color scheme synchronously to prevent flicker
  useMemo(() => {
    setColorScheme(resolvedTheme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen to OS-level Appearance changes only
  // Note: We don't use useColorScheme() because NativeWind's setColorScheme affects it
  useEffect(() => {
    // Get current system theme immediately
    const currentScheme = Appearance.getColorScheme();

    if (currentScheme !== null) {
      lastOsThemeRef.current = currentScheme;
      setSystemColorScheme(currentScheme);
    }

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Ignore changes that match our app theme (these are from NativeWind, not the OS)
      if (colorScheme === lastAppThemeRef.current && colorScheme !== lastOsThemeRef.current) {
        return;
      }

      // This is a real OS change
      if (colorScheme !== null && colorScheme !== lastOsThemeRef.current) {
        lastOsThemeRef.current = colorScheme;
        setSystemColorScheme(colorScheme);
      }
    });

    return () => subscription.remove();
  }, [setSystemColorScheme]);

  // Update app theme tracking reference
  useEffect(() => {
    lastAppThemeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  // Sync with NativeWind when resolved theme changes
  useEffect(() => {
    setColorScheme(resolvedTheme);
  }, [resolvedTheme, setColorScheme]);

  return <>{children}</>;
};
