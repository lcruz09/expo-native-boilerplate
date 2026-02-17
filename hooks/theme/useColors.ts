import { useTheme } from "./useTheme";

/**
 * Color palette for the app.
 * Automatically returns the correct colors based on the current theme.
 */
interface ColorPalette {
  // Backgrounds
  background: string;
  secondary: string;
  card: string;

  // Primary & Accent
  primary: string;
  accent: string;

  // Text
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };

  // Borders
  border: {
    light: string;
    medium: string;
  };

  // Status colors (theme-independent)
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };

  // Heart Rate Zones
  heartRateZones: {
    resting: string;
    easy: string;
    moderate: string;
    hard: string;
    maximum: string;
  };

  // Overlays
  overlay: string;
}

const lightColors: ColorPalette = {
  background: "#FFFFFF",
  secondary: "#F3F4F6",
  card: "#FFFFFF",

  primary: "#00E1A9",
  accent: "#00E1A9",

  text: {
    primary: "#1F2937",
    secondary: "#6B7280",
    tertiary: "#9CA3AF",
  },

  border: {
    light: "#E5E7EB",
    medium: "#D1D5DB",
  },

  status: {
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },

  heartRateZones: {
    resting: "#6B7280", // gray
    easy: "#3B82F6", // blue
    moderate: "#10B981", // green
    hard: "#F59E0B", // orange
    maximum: "#EF4444", // red
  },

  overlay: "rgba(0, 0, 0, 0.5)",
};

const darkColors: ColorPalette = {
  background: "#000000",
  secondary: "#1F2937",
  card: "#1F2937",

  primary: "#00FFB9",
  accent: "#00FFB9",

  text: {
    primary: "#F9FAFB",
    secondary: "#9CA3AF",
    tertiary: "#6B7280",
  },

  border: {
    light: "#374151",
    medium: "#4B5563",
  },

  status: {
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },

  heartRateZones: {
    resting: "#6B7280", // gray
    easy: "#3B82F6", // blue
    moderate: "#10B981", // green
    hard: "#F59E0B", // orange
    maximum: "#EF4444", // red
  },

  overlay: "rgba(0, 0, 0, 0.7)",
};

/**
 * Hook to get theme-aware colors.
 *
 * Returns the appropriate color palette based on the current theme.
 * Use this instead of hardcoding colors or checking `isDark` everywhere.
 *
 * @returns Color palette object with theme-aware colors
 *
 * @example
 * ```tsx
 * const colors = useColors();
 *
 * // Use colors directly
 * <View style={{ backgroundColor: colors.background }}>
 *   <Text style={{ color: colors.text.primary }}>Hello</Text>
 * </View>
 *
 * // In Tabs or other components
 * screenOptions={{
 *   tabBarActiveTintColor: colors.primary,
 *   tabBarInactiveTintColor: colors.text.secondary,
 *   headerStyle: { backgroundColor: colors.background },
 * }}
 * ```
 */
export const useColors = (): ColorPalette => {
  const { isDark } = useTheme();
  return isDark ? darkColors : lightColors;
};
