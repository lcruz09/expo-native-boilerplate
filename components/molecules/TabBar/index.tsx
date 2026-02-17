import { Icon, IconName } from "@/components/atoms/Icon";
import { Pressable } from "@/components/atoms/Pressable";
import { Typography } from "@/components/atoms/Typography";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { useColors } from "@/hooks/theme/useColors";
import { useRouter } from "expo-router";
import { View } from "react-native";

export interface TabBarProps {
  /**
   * Current active route path
   */
  currentRoute: string;
  /**
   * Bottom safe area inset to add padding for devices with home indicators
   */
  bottomInset?: number;
}

interface TabItem {
  /**
   * Route path to navigate to
   */
  route: string;
  /**
   * Ionicon name for the tab icon
   */
  icon: IconName;
  /**
   * Translation key for the tab label
   */
  labelKey: "navigation.home" | "workouts.start" | "navigation.settings";
}

const TAB_ITEMS: TabItem[] = [
  {
    route: ROUTES.HOME,
    icon: "home",
    labelKey: "navigation.home",
  },
  {
    route: ROUTES.START_WORKOUT,
    icon: "play-circle-outline",
    labelKey: "workouts.start",
  },
  {
    route: ROUTES.SETTINGS,
    icon: "settings-outline",
    labelKey: "navigation.settings",
  },
] as const;

/**
 * Tab Bar Component
 *
 * A bottom navigation bar with 3 tabs: Home, Start Workout, and Settings.
 * Highlights the active tab with primary color and shows inactive tabs in secondary color.
 * Extends past the safe area to the bottom edge of the screen.
 *
 * Features:
 * - Theme-aware colors
 * - Haptic feedback on tab press
 * - Active/inactive states
 * - Internationalized labels
 * - Proper safe area handling for devices with home indicators
 *
 * @example
 * ```tsx
 * <TabBar currentRoute="/home" bottomInset={34} />
 * ```
 */
export const TabBar = ({ currentRoute, bottomInset = 0 }: TabBarProps) => {
  const { t } = useTranslation();
  const colors = useColors();
  const router = useRouter();

  const handleTabPress = (route: string) => {
    // Don't navigate if we're already on this route
    if (currentRoute === route) {
      return;
    }
    router.replace(route);
  };

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.card,
        paddingTop: 2,
        paddingBottom: bottomInset - 0, // Add safe area inset to bottom padding minus 6px to bring it lower
        shadowColor: "black",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {TAB_ITEMS.map((tab) => {
          const isActive = currentRoute === tab.route;
          const iconColor = isActive ? colors.primary : colors.text.secondary;
          const textColor = isActive ? colors.primary : colors.text.secondary;
          // Make the play-circle-outline icon slightly bigger as it appears smaller by default
          const iconSize = tab.icon === "play-circle-outline" ? 26 : 24;

          return (
            <Pressable
              key={tab.route}
              onPress={() => handleTabPress(tab.route)}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 4,
                opacity: 1,
              }}
            >
              <Icon name={tab.icon} size={iconSize} color={iconColor} />
              <Typography
                variant="caption"
                style={{
                  color: textColor,
                  marginTop: 2,
                  fontSize: 11,
                  fontWeight: isActive ? "600" : "400",
                }}
              >
                {t(tab.labelKey)}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
