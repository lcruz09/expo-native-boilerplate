import { Icon } from "@/components/atoms/Icon";
import { Typography } from "@/components/atoms/Typography";
import { useColors } from "@/hooks/theme/useColors";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

interface MetricCardProps {
  /**
   * Metric label
   */
  label: string;

  /**
   * Metric value (number or string)
   */
  value: string | number;

  /**
   * Unit of measurement
   */
  unit: string;

  /**
   * Optional icon name from Ionicons
   */
  icon?: keyof typeof Ionicons.glyphMap;

  /**
   * Size of the card
   * @default "medium"
   */
  size?: "small" | "medium" | "large";
}

/**
 * MetricCard Component
 *
 * Displays a single metric with label, value, and unit.
 * Used for showing cycling metrics like speed, cadence, power, etc.
 *
 * @example
 * ```tsx
 * <MetricCard
 *   label="Speed"
 *   value={25.5}
 *   unit="km/h"
 *   icon="speedometer"
 *   size="large"
 * />
 * ```
 */
export function MetricCard({
  label,
  value,
  unit,
  icon,
  size = "medium",
}: MetricCardProps) {
  const colors = useColors();

  const sizeStyles = {
    small: {
      valueFontSize: 24,
      unitFontSize: 12,
      iconSize: 16,
      padding: "p-3",
    },
    medium: {
      valueFontSize: 32,
      unitFontSize: 14,
      iconSize: 20,
      padding: "p-4",
    },
    large: {
      valueFontSize: 48,
      unitFontSize: 16,
      iconSize: 24,
      padding: "p-6",
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View
      className={`${currentSize.padding} rounded-xl items-center justify-center`}
      style={{
        backgroundColor: `${colors.primary}10`,
        borderWidth: 1,
        borderColor: `${colors.primary}30`,
      }}
    >
      {/* Icon */}
      {icon && (
        <Icon
          name={icon}
          size={currentSize.iconSize}
          color={colors.primary}
          className="mb-2"
        />
      )}

      {/* Label */}
      <Typography
        variant="caption"
        style={{
          color: colors.text.secondary,
          fontSize: size === "large" ? 14 : 12,
        }}
        className="mb-1"
      >
        {label}
      </Typography>

      {/* Value & Unit */}
      <View className="flex-row items-baseline">
        <Typography
          variant="title"
          className="font-bold"
          style={{
            color: colors.primary,
            fontSize: currentSize.valueFontSize,
            lineHeight: currentSize.valueFontSize + 4,
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="caption"
          style={{
            color: colors.text.secondary,
            fontSize: currentSize.unitFontSize,
            marginLeft: 4,
          }}
        >
          {unit}
        </Typography>
      </View>
    </View>
  );
}
