import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics';
import { memo, ReactNode } from 'react';
import {
  GestureResponderEvent,
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
} from 'react-native';

export interface PressableProps extends RNPressableProps {
  children: ReactNode;
  hapticStyle?: ImpactFeedbackStyle;
  className?: string;
}

/**
 * Enhanced Pressable component with built-in haptic feedback support.
 * Wraps React Native's Pressable and adds a hapticStyle prop.
 *
 * Defaults `accessibilityRole` to "button" so all tappable elements are
 * correctly announced by screen readers without extra boilerplate.
 * Wrapped in `memo` to avoid re-renders when props are unchanged.
 */
export const Pressable = memo(
  ({ children, onPress, hapticStyle, accessibilityRole = 'button', ...props }: PressableProps) => {
    const handlePress = (event: GestureResponderEvent) => {
      if (hapticStyle) {
        impactAsync(hapticStyle);
      }
      if (onPress) {
        onPress(event);
      }
    };

    return (
      <RNPressable accessibilityRole={accessibilityRole} onPress={handlePress} {...props}>
        {children}
      </RNPressable>
    );
  }
);
Pressable.displayName = 'Pressable';
