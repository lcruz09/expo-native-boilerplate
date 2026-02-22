import { memo, ReactNode } from 'react';
import { Platform, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface PageLayoutProps {
  /**
   * Content to render inside the layout
   */
  children: ReactNode;

  /**
   * Optional additional styles to apply to the container
   */
  style?: ViewStyle;

  /**
   * Whether to add bottom padding for the tab bar
   * @default true
   */
  hasTabBar?: boolean;

  /**
   * Whether to add top padding for the safe area (status bar)
   * @default false
   */
  hasSafeAreaTop?: boolean;
}

/**
 * Page Layout Component
 *
 * A reusable layout wrapper that adds appropriate padding to account for the bottom tab bar and safe areas.
 * This ensures content is not hidden behind the tab bar or status bar.
 *
 * @example
 * ```tsx
 * // Default usage with tab bar padding
 * <PageLayout>
 *   <ScrollView>
 *     <Text>Content</Text>
 *   </ScrollView>
 * </PageLayout>
 *
 * // With top safe area padding and no tab bar
 * <PageLayout hasSafeAreaTop hasTabBar={false}>
 *   <View>
 *     <Text>Content</Text>
 *   </View>
 * </PageLayout>
 * ```
 */
export const PageLayout = memo(
  ({ children, style, hasTabBar = true, hasSafeAreaTop = false }: PageLayoutProps) => {
    const insets = useSafeAreaInsets();

    const paddingExtra = Platform.OS === 'ios' ? 16 : 46;
    // Tab bar height is approximately 60px (icon + text + padding)
    // Add safe area inset to ensure content clears both tab bar AND home indicator
    const paddingBottom = hasTabBar ? paddingExtra + insets.bottom : 0;
    const paddingTop = hasSafeAreaTop ? insets.top : 0;

    return (
      <View
        style={[
          {
            flex: 1,
            paddingBottom: paddingBottom,
            paddingTop: paddingTop,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }
);
PageLayout.displayName = 'PageLayout';
