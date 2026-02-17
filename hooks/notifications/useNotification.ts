import { useNotificationStore } from "@/stores/notifications/notificationStore";
import { NotificationInput } from "@/types/notification";
import { useCallback } from "react";

/**
 * Notification Hook
 *
 * Provides a simple API for showing and dismissing notifications.
 *
 * @example
 * ```tsx
 * const { showNotification, dismissNotification } = useNotification();
 *
 * // Show a success notification
 * const id = showNotification({
 *   type: "success",
 *   title: "Workout saved!",
 *   description: "Your workout has been saved successfully",
 * });
 *
 * // Show an error with CTA
 * showNotification({
 *   type: "error",
 *   title: "Sync failed",
 *   description: "Unable to sync your workout",
 *   persistent: true,
 *   actions: [
 *     {
 *       label: "Retry",
 *       onPress: () => retrySync(),
 *       variant: "primary",
 *     },
 *     {
 *       label: "Dismiss",
 *       onPress: () => dismissNotification(id),
 *       variant: "secondary",
 *     },
 *   ],
 * });
 *
 * // Dismiss manually
 * dismissNotification(id);
 *
 * // Clear all notifications
 * clearAllNotifications();
 * ```
 */
export const useNotification = () => {
  const { addNotification, removeNotification, clearAll } =
    useNotificationStore();

  /**
   * Show a notification
   *
   * @param input - Notification configuration
   * @returns Notification ID for manual dismissal
   */
  const showNotification = useCallback(
    (input: NotificationInput): string => {
      return addNotification(input);
    },
    [addNotification],
  );

  /**
   * Dismiss a specific notification by ID
   *
   * @param id - Notification ID to dismiss
   */
  const dismissNotification = useCallback(
    (id: string): void => {
      removeNotification(id);
    },
    [removeNotification],
  );

  /**
   * Clear all active notifications
   */
  const clearAllNotifications = useCallback((): void => {
    clearAll();
  }, [clearAll]);

  return {
    showNotification,
    dismissNotification,
    clearAllNotifications,
  };
};
