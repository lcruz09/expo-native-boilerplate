import { Ionicons } from "@expo/vector-icons";
import React from "react";

export type IconName = keyof typeof Ionicons.glyphMap;

export interface IconProps {
  /**
   * The name of the icon from Ionicons
   */
  name: IconName;
  /**
   * Size of the icon
   */
  size?: number;
  /**
   * Color of the icon
   */
  color?: string;
  /**
   * Optional custom styling
   */
  className?: string;
}

/**
 * Icon component using Ionicons.
 *
 * @example
 * ```tsx
 * <Icon name="settings" size={24} color="#00E1A9" />
 * ```
 */
export const Icon = ({ name, size = 24, color, className }: IconProps) => {
  return (
    <Ionicons name={name} size={size} color={color} className={className} />
  );
};
