import { NotificationBanner } from "@/components/atoms/NotificationBanner";
import { useNotificationStore } from "@/stores/notifications/notificationStore";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Auto-dismiss duration for non-persistent notifications (5 seconds)
 */
const AUTO_DISMISS_DURATION = 5000;

/**
 * Notification Container Component
 *
 * Global container that renders all active notifications.
 * Positioned absolutely at the top of the screen with safe area awareness.
 * Manages auto-dismiss timers and notification lifecycle.
 *
 * Features:
 * - Stacks notifications vertically
 * - Auto-dismisses non-persistent notifications after 5 seconds
 * - Respects safe area insets (notch/status bar)
 * - Persists across navigation
 *
 * @example
 * ```tsx
 * // In _layout.tsx
 * <View style={{ flex: 1 }}>
 *   <Stack />
 *   <NotificationContainer />
 * </View>
 * ```
 */
export const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotificationStore();
  const insets = useSafeAreaInsets();
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Set up auto-dismiss timers for non-persistent notifications
  useEffect(() => {
    const timersMap = timersRef.current;

    notifications.forEach((notification) => {
      // Skip persistent notifications
      if (notification.persistent) {
        return;
      }

      // Skip if timer already exists
      if (timersMap.has(notification.id)) {
        return;
      }

      // Create auto-dismiss timer
      const timer = setTimeout(() => {
        removeNotification(notification.id);
        timersMap.delete(notification.id);
      }, AUTO_DISMISS_DURATION);

      timersMap.set(notification.id, timer);
    });

    // Cleanup: remove timers for notifications that no longer exist
    const currentIds = new Set(notifications.map((n) => n.id));
    timersMap.forEach((timer, id) => {
      if (!currentIds.has(id)) {
        clearTimeout(timer);
        timersMap.delete(id);
      }
    });

    // Cleanup on unmount
    return () => {
      timersMap.forEach((timer) => clearTimeout(timer));
      timersMap.clear();
    };
  }, [notifications, removeNotification]);

  // Don't render if no notifications
  if (notifications.length === 0) {
    return null;
  }

  return (
    <View
      style={{
        position: "absolute",
        top: insets.top + 8,
        left: 0,
        right: 0,
        zIndex: 9999,
        pointerEvents: "box-none",
      }}
    >
      {notifications.map((notification, index) => (
        <View
          key={notification.id}
          style={{
            marginBottom: index < notifications.length - 1 ? 8 : 0,
            pointerEvents: "auto",
          }}
        >
          <NotificationBanner
            notification={notification}
            onDismiss={() => removeNotification(notification.id)}
          />
        </View>
      ))}
    </View>
  );
};
