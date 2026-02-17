import { Button } from "@/components/atoms/Button";
import { Icon, IconName } from "@/components/atoms/Icon";
import { Typography } from "@/components/atoms/Typography";
import { useColors } from "@/hooks/theme/useColors";
import { Notification, NotificationAction } from "@/types/notification";
import { ImpactFeedbackStyle, impactAsync } from "expo-haptics";
import React, { useEffect } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

export interface NotificationBannerProps {
  /**
   * Notification data
   */
  notification: Notification;

  /**
   * Callback when notification is dismissed
   */
  onDismiss: () => void;
}

/**
 * Get icon name for notification type
 */
const getIconForType = (type: Notification["type"]): IconName => {
  const iconMap: Record<Notification["type"], IconName> = {
    success: "checkmark-circle",
    warning: "warning",
    error: "alert-circle",
    info: "information-circle",
  };
  return iconMap[type];
};

/**
 * Notification Banner Component
 *
 * Individual notification banner with slide-in animation and swipe-up gesture.
 * Theme-aware with type-based styling (success/warning/error/info).
 *
 * iOS-like behavior:
 * - Small, fast slide from just above the top
 * - withTiming + cubic easing (no bounce)
 * - Quick swipe-to-dismiss
 */
export const NotificationBanner = ({
  notification,
  onDismiss,
}: NotificationBannerProps) => {
  const colors = useColors();

  /**
   * Animation values
   *
   * Use a small offset like iOS banners (e.g. -40) instead of -200.
   * This makes the animation feel snappier and less dramatic.
   */
  const translateY = useSharedValue(-40);
  const opacity = useSharedValue(0);

  // Slide in animation on mount – fast, iOS-style
  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 160,
      easing: Easing.out(Easing.cubic),
    });

    opacity.value = withTiming(1, {
      duration: 160,
      easing: Easing.out(Easing.cubic),
    });
  }, [translateY, opacity]);

  /**
   * Helper to dismiss the banner from UI/gesture/animation worklets.
   *
   * We:
   * - Animate up slightly
   * - Fade out
   * - Then schedule RN callbacks (haptics + onDismiss) via scheduleOnRN
   */
  const dismissWithAnimation = () => {
    "worklet";

    translateY.value = withTiming(-40, {
      duration: 140,
      easing: Easing.in(Easing.cubic),
    });

    opacity.value = withTiming(
      0,
      {
        duration: 140,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (!finished) return;

        // Back on RN runtime: trigger haptic + onDismiss
        scheduleOnRN(impactAsync, ImpactFeedbackStyle.Light);
        scheduleOnRN(onDismiss);
      },
    );
  };

  // Swipe gesture (only for non-persistent notifications)
  const panGesture = Gesture.Pan()
    .enabled(!notification.persistent)
    .onUpdate((event) => {
      // Worklet context (autoworkletized by Reanimated/Worklets)
      if (event.translationY < 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      // Small threshold; we don't want a dramatic swipe distance
      const shouldDismiss = event.translationY < -30;

      if (shouldDismiss) {
        dismissWithAnimation();
      } else {
        // Snap back quickly
        translateY.value = withTiming(0, {
          duration: 160,
          easing: Easing.out(Easing.cubic),
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  // Get type-specific styling
  const getTypeStyles = () => {
    switch (notification.type) {
      case "success":
        return {
          backgroundColor: colors.status.success,
          iconColor: "#FFFFFF",
        };
      case "warning":
        return {
          backgroundColor: colors.status.warning,
          iconColor: "#000000",
        };
      case "error":
        return {
          backgroundColor: colors.status.error,
          iconColor: "#FFFFFF",
        };
      case "info":
        return {
          backgroundColor: colors.status.info,
          iconColor: "#FFFFFF",
        };
    }
  };

  const typeStyles = getTypeStyles();
  const iconName = getIconForType(notification.type);

  const renderActions = (actions: NotificationAction[]) => {
    return (
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginTop: 12,
        }}
      >
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant === "secondary" ? "secondary" : "primary"}
            size="small"
            onPress={action.onPress}
            style={{ flex: 1 }}
          >
            <Typography variant="body" style={{ color: "#FFFFFF" }}>
              {action.label}
            </Typography>
          </Button>
        ))}
      </View>
    );
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          {
            backgroundColor: typeStyles.backgroundColor,
            borderRadius: 12,
            padding: 16,
            marginHorizontal: 16,
            // Slight shadow for floating iOS feel
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          },
          animatedStyle,
        ]}
      >
        {notification.renderContent ? (
          notification.renderContent()
        ) : (
          <>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              {/* Icon */}
              <View style={{ marginRight: 12 }}>
                <Icon name={iconName} size={24} color={typeStyles.iconColor} />
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                <Typography
                  variant="subtitle"
                  style={{
                    color: typeStyles.iconColor,
                    marginBottom: notification.description ? 4 : 0,
                  }}
                >
                  {notification.title}
                </Typography>

                {notification.description && (
                  <Typography
                    variant="body"
                    style={{
                      color: typeStyles.iconColor,
                      opacity: 0.9,
                    }}
                  >
                    {notification.description}
                  </Typography>
                )}
              </View>
            </View>

            {/* Action buttons */}
            {notification.actions && notification.actions.length > 0 && (
              <>{renderActions(notification.actions)}</>
            )}
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
};
