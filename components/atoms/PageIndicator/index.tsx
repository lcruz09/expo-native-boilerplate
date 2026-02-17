import { useColors } from "@/hooks/theme/useColors";
import { View } from "react-native";

interface PageIndicatorProps {
  /**
   * Total number of pages
   */
  pageCount: number;

  /**
   * Current active page (0-indexed)
   */
  currentPage: number;
}

/**
 * PageIndicator Component
 *
 * Displays dots to indicate current page in a swipeable view.
 *
 * @example
 * ```tsx
 * <PageIndicator pageCount={3} currentPage={0} />
 * ```
 */
export function PageIndicator({ pageCount, currentPage }: PageIndicatorProps) {
  const colors = useColors();

  if (pageCount <= 1) {
    return null;
  }

  return (
    <View className="flex-row justify-center items-center gap-2 py-4">
      {Array.from({ length: pageCount }).map((_, index) => {
        const isActive = index === currentPage;
        return (
          <View
            key={index}
            className="rounded-full"
            style={{
              width: isActive ? 12 : 8,
              height: isActive ? 12 : 8,
              backgroundColor: isActive ? colors.primary : colors.border.light,
              opacity: isActive ? 1 : 0.5,
            }}
          />
        );
      })}
    </View>
  );
}
