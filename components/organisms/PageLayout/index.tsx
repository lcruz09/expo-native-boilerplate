import { ReactNode } from "react";
import { Platform, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
}

/**
 * Page Layout Component
 *
 * A reusable layout wrapper that adds appropriate padding to account for the bottom tab bar.
 * This ensures content is not hidden behind the tab bar when scrolling to the bottom.
 * The padding includes the safe area inset for devices with home indicators.
 *
 * Features:
 * - Automatic bottom padding when tab bar is present
 * - Safe area handling for devices with home indicators
 * - Flexible styling options
 * - Can be used with or without tab bar
 *
 * @example
 * ```tsx
 * <PageLayout>
 *   <ScrollView>
 *     {/* Your page content *\/}
 *   </ScrollView>
 * </PageLayout>
 *
 * // Without tab bar padding
 * <PageLayout hasTabBar={false}>
 *   <View>{/* Content *\/}</View>
 * </PageLayout>
 * ```
 */
export const PageLayout = ({
  children,
  style,
  hasTabBar = true,
}: PageLayoutProps) => {
  const insets = useSafeAreaInsets();

  const paddingExtra = Platform.OS === "ios" ? 16 : 46;
  // Tab bar height is approximately 60px (icon + text + padding)
  // Add safe area inset to ensure content clears both tab bar AND home indicator
  const paddingBottom = hasTabBar ? paddingExtra + insets.bottom : 0;

  return (
    <View
      style={[
        {
          flex: 1,
          paddingBottom: paddingBottom,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
