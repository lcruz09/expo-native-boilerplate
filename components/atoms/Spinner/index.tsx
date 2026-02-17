import React from "react";
import { ActivityIndicator, ActivityIndicatorProps } from "react-native";

export interface SpinnerProps extends ActivityIndicatorProps {
  /**
   * Size variant for the spinner.
   * @default "small"
   */
  size?: "small" | "large";
}

/**
 * Reusable loading spinner with consistent theming.
 *
 * Uses primary color (#00E1A9) to match the app's design system.
 *
 * @example
 * ```tsx
 * <Spinner size="large" />
 * <Spinner size="small" />
 * ```
 */
export const Spinner = ({
  size = "small",
  color = "#00E1A9",
  ...props
}: SpinnerProps) => {
  return <ActivityIndicator size={size} color={color} {...props} />;
};
