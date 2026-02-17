import { useColors } from "@/hooks/theme/useColors";
import React, { ReactNode } from "react";
import { View } from "react-native";
import { Pressable } from "../Pressable";
import { Typography } from "../Typography";

export interface SelectButtonProps {
  /**
   * The text/content to display
   */
  label: string;
  /**
   * Optional icon/emoji to display before the label
   */
  icon?: ReactNode;
  /**
   * Whether this button is selected
   */
  selected?: boolean;
  /**
   * Callback when button is pressed
   */
  onPress: () => void;
  /**
   * Optional custom styling
   */
  className?: string;
}

/**
 * SelectButton component for triggering selection modals.
 *
 * @example
 * ```tsx
 * <SelectButton
 *   label="English"
 *   icon={<Text>🇺🇸</Text>}
 *   onPress={() => setModalVisible(true)}
 * />
 * ```
 */
export const SelectButton = ({
  label,
  icon,
  selected = false,
  onPress,
  className,
}: SelectButtonProps) => {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between px-5 py-4 rounded-xl active:opacity-70 ${className || ""}`}
      style={{
        backgroundColor: selected ? `${colors.primary}15` : colors.card,
        borderColor: colors.border.light,
        borderWidth: 1,
      }}
    >
      <View className="flex-row items-center gap-3">
        {icon}
        <Typography
          variant="body"
          style={{
            color: selected ? colors.primary : colors.text.primary,
            fontSize: 16,
          }}
        >
          {label}
        </Typography>
      </View>
    </Pressable>
  );
};
