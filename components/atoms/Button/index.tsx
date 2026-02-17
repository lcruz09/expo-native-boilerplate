import { Pressable, PressableProps } from "@/components/atoms/Pressable";
import { ImpactFeedbackStyle } from "expo-haptics";
import React, { ReactNode } from "react";
import { Text } from "react-native";

/**
 * Button variant types following a consistent design system.
 */
export type ButtonVariant = "primary" | "secondary" | "danger";

/**
 * Button size variants.
 */
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps extends PressableProps {
  /**
   * The content to display inside the button (text or elements).
   */
  children: ReactNode;

  /**
   * Button style variant.
   * @default "primary"
   */
  variant?: ButtonVariant;

  /**
   * Button size.
   * @default "large"
   */
  size?: ButtonSize;

  /**
   * Whether the button should take full width of its container.
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * Reusable button component with consistent styling across the app.
 *
 * Supports three variants: primary (cyan), secondary (gray), and danger (red).
 * Includes light haptic feedback on press by default.
 *
 * @example
 * ```tsx
 * <Button variant="primary" onPress={handlePress}>
 *   Connect
 * </Button>
 *
 * <Button variant="danger" size="large" onPress={handleDisconnect}>
 *   Disconnect
 * </Button>
 *
 * <Button variant="primary" hapticStyle={ImpactFeedbackStyle.Heavy}>
 *   Important Action
 * </Button>
 * ```
 */
export const Button = ({
  children,
  variant = "primary",
  size = "large",
  fullWidth = false,
  disabled,
  className,
  hapticStyle = ImpactFeedbackStyle.Light,
  ...props
}: ButtonProps) => {
  // Variant styles (theme-aware)
  const variantClasses = {
    primary: "bg-primary active:bg-primary/80",
    secondary:
      "bg-secondary dark:bg-secondary-dark active:bg-secondary/80 dark:active:bg-secondary-dark/80",
    danger: "bg-red-600 active:bg-red-700",
  };

  // Size styles
  const sizeClasses = {
    small: "py-2 px-4",
    medium: "py-3 px-6",
    large: "py-4 px-8",
  };

  // Text size styles
  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const buttonClasses = [
    variantClasses[variant],
    sizeClasses[size],
    "rounded-xl",
    "items-center", // Center content horizontally
    "justify-center", // Center content vertically
    fullWidth ? "w-full" : "",
    disabled ? "opacity-50" : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Pressable
      className={buttonClasses}
      disabled={disabled}
      hapticStyle={hapticStyle}
      {...props}
    >
      {typeof children === "string" ? (
        <Text
          className={`text-center ${variant === "primary" ? "text-text-primary-dark" : "text-text-primary dark:text-text-primary-dark"} font-semibold ${textSizeClasses[size]}`}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
};
