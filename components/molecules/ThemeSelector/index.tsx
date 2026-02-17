import { Icon } from "@/components/atoms/Icon";
import { SelectButton } from "@/components/atoms/SelectButton";
import { ModalSelector } from "@/components/molecules/ModalSelector";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { useColors } from "@/hooks/theme/useColors";
import { useTheme } from "@/hooks/theme/useTheme";
import { ThemeMode } from "@/stores/theme/themeStore";
import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode, useState } from "react";
import { View } from "react-native";

type IconName = keyof typeof Ionicons.glyphMap;

export interface ThemeSelectorProps {
  /**
   * Optional custom styling.
   */
  className?: string;
}

/**
 * Theme selector component with modal selection.
 *
 * Displays current theme and opens a modal to select from all available themes.
 *
 * @example
 * ```tsx
 * <ThemeSelector />
 * ```
 */
export const ThemeSelector = ({ className }: ThemeSelectorProps) => {
  const { mode, setTheme } = useTheme();
  const colors = useColors();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleThemeChange = (newMode: ThemeMode) => {
    setTheme(newMode);
    setModalVisible(false);
  };

  // Map theme modes to translation keys
  const getThemeLabel = (themeMode: ThemeMode): string => {
    switch (themeMode) {
      case "light":
        return t("settings.themeLight");
      case "dark":
        return t("settings.themeDark");
      case "system":
        return t("settings.themeSystem");
      default:
        return themeMode;
    }
  };

  // Use theme-aware colors for better contrast
  const iconColors = {
    light: "#FF8F00",
    dark: colors.primary,
    system: "#8B5CF6", // Brighter purple for better contrast in dark mode
  };

  const themeIcons: Record<ThemeMode, IconName> = {
    light: "sunny",
    dark: "moon",
    system: "phone-portrait",
  };

  const themeOptions: {
    value: ThemeMode;
    label: string;
    icon: ReactNode;
  }[] = [
    {
      value: "light",
      label: getThemeLabel("light"),
      icon: (
        <View>
          <Icon name={themeIcons.light} size={24} color={iconColors.light} />
        </View>
      ),
    },
    {
      value: "dark",
      label: getThemeLabel("dark"),
      icon: (
        <View>
          <Icon name={themeIcons.dark} size={24} color={iconColors.dark} />
        </View>
      ),
    },
    {
      value: "system",
      label: getThemeLabel("system"),
      icon: (
        <View>
          <Icon name={themeIcons.system} size={24} color={iconColors.system} />
        </View>
      ),
    },
  ];

  return (
    <>
      <SelectButton
        label={getThemeLabel(mode)}
        icon={
          <View>
            <Icon
              name={themeIcons[mode]}
              size={20}
              color={colors.text.primary}
            />
          </View>
        }
        onPress={() => setModalVisible(true)}
        className={className}
      />

      <ModalSelector
        visible={modalVisible}
        title={t("settings.selectTheme")}
        options={themeOptions}
        selectedValue={mode}
        onSelect={handleThemeChange}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};
