import { Pressable, PressableProps } from '@/components/atoms/Pressable';
import { useColors } from '@/hooks/theme/useColors';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { memo, ReactNode } from 'react';
import { ActivityIndicator, Text } from 'react-native';

/**
 * Button variant types following a consistent design system.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger';

/**
 * Button size variants.
 */
export type ButtonSize = 'small' | 'medium' | 'large';

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

  /**
   * Whether the button is in a loading state.
   * @default false
   */
  loading?: boolean;
}

/**
 * Reusable button component with consistent styling across the app.
 *
 * Supports three variants: primary (cyan), secondary (gray), and danger (red).
 * Includes light haptic feedback on press by default.
 * Wrapped in `memo` to avoid re-renders when props are unchanged.
 */
export const Button = memo(
  ({
    children,
    variant = 'primary',
    size = 'large',
    fullWidth = false,
    loading = false,
    disabled,
    className,
    hapticStyle = ImpactFeedbackStyle.Light,
    ...props
  }: ButtonProps) => {
    const colors = useColors();

    // Variant styles (theme-aware)
    const variantClasses = {
      primary: 'bg-primary active:bg-primary/80',
      secondary:
        'bg-secondary dark:bg-secondary-dark active:bg-secondary/80 dark:active:bg-secondary-dark/80',
      danger: 'bg-red-600 active:bg-red-700',
    };

    // Size styles
    const sizeClasses = {
      small: 'py-2 px-4',
      medium: 'py-3 px-6',
      large: 'py-4 px-8',
    };

    // Text size styles
    const textSizeClasses = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
    };

    const buttonClasses = [
      variantClasses[variant],
      sizeClasses[size],
      'rounded-xl',
      'items-center',
      'justify-center',
      fullWidth ? 'w-full' : '',
      disabled || loading ? 'opacity-50' : '',
      className || '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Pressable
        className={buttonClasses}
        disabled={disabled || loading}
        hapticStyle={hapticStyle}
        accessibilityState={{ disabled: !!(disabled || loading), busy: loading }}
        {...props}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' ? '#000' : colors.text.primary}
            size="small"
          />
        ) : typeof children === 'string' ? (
          <Text
            className={`text-center ${variant === 'primary' ? 'text-text-primary-dark' : 'text-text-primary dark:text-text-primary-dark'} font-semibold ${textSizeClasses[size]}`}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    );
  }
);
Button.displayName = 'Button';
