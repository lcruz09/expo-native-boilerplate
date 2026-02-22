import { Button } from '@/components/atoms/Button';
import { Icon, IconName } from '@/components/atoms/Icon';
import { useColors } from '@/hooks/theme/useColors';
import { memo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { styles } from './styles';

export interface IconButtonProps {
  /**
   * Ionicon name for the icon
   */
  icon: IconName;

  /**
   * Button label text — also used as the accessibility label for screen readers.
   */
  label: string;

  /**
   * Callback when button is pressed
   */
  onPress: () => void;

  /**
   * Whether the button is in loading state
   */
  loading?: boolean;

  /**
   * Whether the button is disabled
   */
  disabled?: boolean;

  /**
   * Button variant style
   */
  variant?: 'primary' | 'secondary';

  /**
   * Custom icon color (overrides theme colors)
   */
  iconColor?: string;

  /**
   * Custom text color (overrides theme colors)
   */
  textColor?: string;

  /**
   * Test ID for e2e testing
   */
  testID?: string;
}

/**
 * Icon Button Component
 *
 * A button with an icon on the left and text label on the right.
 * Supports loading state with spinner, disabled state, and theme variants.
 *
 * The `label` prop doubles as the accessibility label so screen readers
 * announce the button's purpose without extra configuration.
 *
 * Features:
 * - Icon + text layout
 * - Loading state (shows spinner instead of icon)
 * - Theme-aware colors
 * - Primary and secondary variants
 * - Disabled state support
 *
 * @example
 * ```tsx
 * <IconButton
 *   icon="log-out-outline"
 *   label="Logout"
 *   onPress={handleLogout}
 *   iconColor={colors.status.error}
 *   textColor={colors.status.error}
 * />
 *
 * <IconButton
 *   icon="cloud-upload-outline"
 *   label="Import Workout"
 *   onPress={handleImport}
 *   loading={isImporting}
 * />
 * ```
 */
export const IconButton = memo(
  ({
    icon,
    label,
    onPress,
    loading = false,
    disabled = false,
    variant = 'secondary',
    iconColor,
    textColor,
    testID,
  }: IconButtonProps) => {
    const colors = useColors();

    // Determine colors based on variant if not explicitly provided
    const finalIconColor = iconColor || colors.primary;
    const finalTextColor = textColor || colors.primary;

    return (
      <Button
        onPress={onPress}
        disabled={disabled || loading}
        variant={variant}
        testID={testID}
        accessibilityLabel={label}
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
      >
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="small" color={finalIconColor} />
          ) : (
            <Icon name={icon} size={24} color={finalIconColor} />
          )}
          <Text style={[styles.text, { color: finalTextColor }]}>{label}</Text>
        </View>
      </Button>
    );
  }
);
IconButton.displayName = 'IconButton';
