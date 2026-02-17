import { Icon, IconName } from "@/components/atoms/Icon";
import { Typography } from "@/components/atoms/Typography";
import { useColors } from "@/hooks/theme/useColors";
import { View } from "react-native";

export interface EmptyStateProps {
  /**
   * Icon name from Ionicons
   */
  icon: IconName;

  /**
   * Title text
   */
  title: string;

  /**
   * Optional description text
   */
  description?: string;
}

/**
 * Empty State Component
 *
 * Displays a centered message when no content is available.
 * Shows an icon, title, and optional description.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon="document-text-outline"
 *   title="No logs found"
 *   description="Logs will appear here once you use the app"
 * />
 * ```
 */
export const EmptyState = ({ icon, title, description }: EmptyStateProps) => {
  const colors = useColors();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
      }}
    >
      <Icon name={icon} size={64} color={colors.text.tertiary} />
      <Typography
        variant="subtitle"
        color="primary"
        style={{ marginTop: 16, textAlign: "center" }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body"
          color="secondary"
          style={{ marginTop: 8, textAlign: "center" }}
        >
          {description}
        </Typography>
      )}
    </View>
  );
};
