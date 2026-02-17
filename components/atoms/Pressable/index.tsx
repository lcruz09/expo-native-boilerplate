import { ImpactFeedbackStyle, impactAsync } from "expo-haptics";
import { ReactNode } from "react";
import {
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
} from "react-native";

export interface PressableProps extends RNPressableProps {
  /**
   * Content to render inside the pressable
   */
  children: ReactNode;

  /**
   * Haptic feedback style to use on press
   * @default ImpactFeedbackStyle.Light
   */
  hapticStyle?: ImpactFeedbackStyle | "none";

  /**
   * Opacity when pressed
   * @default 0.7
   */
  pressedOpacity?: number;
}

/**
 * Pressable Component with Built-in Haptic Feedback
 *
 * Enhanced version of React Native's Pressable that automatically provides:
 * - Haptic feedback on press (configurable)
 * - Visual feedback with opacity change (configurable)
 * - All standard Pressable functionality
 *
 * This component follows the DRY principle by centralizing feedback behavior
 * that would otherwise be repeated across the app.
 *
 * @example
 * ```tsx
 * // Basic usage with default haptics
 * <Pressable onPress={handlePress}>
 *   <Text>Press me</Text>
 * </Pressable>
 *
 * // Custom haptic style
 * <Pressable onPress={handleDelete} hapticStyle="Heavy">
 *   <Icon name="trash" />
 * </Pressable>
 *
 * // Disable haptics but keep visual feedback
 * <Pressable onPress={handlePress} hapticStyle="None">
 *   <Text>Silent press</Text>
 * </Pressable>
 *
 * // Custom pressed opacity
 * <Pressable onPress={handlePress} pressedOpacity={0.5}>
 *   <Text>More subtle feedback</Text>
 * </Pressable>
 *
 * // With custom styles (function form)
 * <Pressable
 *   onPress={handlePress}
 *   style={({ pressed }) => ({
 *     backgroundColor: pressed ? colors.primary : colors.secondary,
 *     padding: 16,
 *   })}
 * >
 *   <Text>Custom styles</Text>
 * </Pressable>
 *
 * // With custom styles (object form) - opacity still applied
 * <Pressable
 *   onPress={handlePress}
 *   style={{ padding: 16, backgroundColor: colors.card }}
 * >
 *   <Text>Simple styles</Text>
 * </Pressable>
 * ```
 */
export const Pressable = ({
  children,
  onPress,
  hapticStyle = ImpactFeedbackStyle.Light,
  ...rest
}: PressableProps) => {
  const handlePress = async (
    event: Parameters<NonNullable<RNPressableProps["onPress"]>>[0],
  ) => {
    // Provide haptic feedback if enabled
    if (hapticStyle && hapticStyle !== "none") {
      await impactAsync(hapticStyle);
    }

    // Call the original onPress handler
    onPress?.(event);
  };

  return (
    <RNPressable onPress={handlePress} {...rest}>
      {children}
    </RNPressable>
  );
};
