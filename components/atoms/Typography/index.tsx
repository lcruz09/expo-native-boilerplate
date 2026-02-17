import React, { ReactNode } from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";

/**
 * Typography variant types for consistent text styling.
 */
export type TypographyVariant =
  | "title"
  | "subtitle"
  | "body"
  | "label"
  | "caption"
  | "display";

/**
 * Color variants for text.
 */
export type TextColor =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "danger";

export interface TypographyProps extends RNTextProps {
  /**
   * The text content to display.
   */
  children: ReactNode;

  /**
   * Typography variant to determine size and weight.
   * @default "body"
   */
  variant?: TypographyVariant;

  /**
   * Text color variant.
   * @default "primary"
   */
  color?: TextColor;

  /**
   * Whether the text should be centered.
   * @default false
   */
  centered?: boolean;
}

/**
 * Reusable typography component with consistent styling.
 *
 * Provides semantic text variants for different use cases.
 *
 * @example
 * ```tsx
 * <Typography variant="title" color="primary">
 *   Welcome
 * </Typography>
 *
 * <Typography variant="body" color="secondary">
 *   This is body text
 * </Typography>
 * ```
 */
export const Typography = ({
  children,
  variant = "body",
  color = "primary",
  centered = false,
  className,
  ...props
}: TypographyProps) => {
  // Variant styles
  const variantClasses = {
    display: "text-6xl font-bold",
    title: "text-2xl font-bold",
    subtitle: "text-xl font-semibold",
    body: "text-base",
    label: "text-lg font-semibold",
    caption: "text-sm",
  };

  // Color styles (theme-aware)
  const colorClasses = {
    primary: "text-text-primary dark:text-text-primary-dark",
    secondary: "text-text-secondary dark:text-text-secondary-dark",
    accent: "text-primary",
    success: "text-green-600 dark:text-green-400",
    warning: "text-accent dark:text-accent-dark",
    danger: "text-red-600 dark:text-red-400",
  };

  const textClasses = [
    variantClasses[variant],
    colorClasses[color],
    centered ? "text-center" : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <RNText className={textClasses} {...props}>
      {children}
    </RNText>
  );
};
