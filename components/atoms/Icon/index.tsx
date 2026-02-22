import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';

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
  /**
   * Accessibility label for screen readers.
   * When omitted the icon is treated as decorative and hidden from the accessibility tree.
   */
  accessibilityLabel?: string;
}

/**
 * Icon component using Ionicons.
 *
 * Pass `accessibilityLabel` when the icon conveys meaning on its own (e.g. a
 * standalone close button). Omit it when the icon is decorative and a sibling
 * element (e.g. a Button label) already describes the action.
 *
 * @example
 * ```tsx
 * // Decorative — hidden from screen readers
 * <Icon name="settings" size={24} color="#00E1A9" />
 *
 * // Meaningful standalone icon
 * <Icon name="close" accessibilityLabel="Close dialog" />
 * ```
 */
export const Icon = memo(({ name, size = 24, color, className, accessibilityLabel }: IconProps) => {
  const isDecorative = !accessibilityLabel;

  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
      className={className}
      accessibilityLabel={accessibilityLabel}
      accessible={!isDecorative}
      importantForAccessibility={isDecorative ? 'no' : 'yes'}
    />
  );
});
Icon.displayName = 'Icon';
