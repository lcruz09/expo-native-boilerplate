import { ReactNode } from 'react';

/**
 * Notification type for visual styling
 */
export type NotificationType = 'success' | 'warning' | 'error' | 'info';

/**
 * Action button configuration for notifications
 */
export interface NotificationAction {
  /**
   * Button label text
   */
  label: string;

  /**
   * Callback when button is pressed
   */
  onPress: () => void;

  /**
   * Button visual variant
   * @default "primary"
   */
  variant?: 'primary' | 'secondary';
}

/**
 * Notification data structure
 */
export interface Notification {
  /**
   * Unique identifier (UUID)
   */
  id: string;

  /**
   * Notification type for visual styling
   */
  type: NotificationType;

  /**
   * Main notification title
   */
  title: string;

  /**
   * Optional description text
   */
  description?: string;

  /**
   * Whether notification persists (doesn't auto-dismiss)
   * Use for notifications with CTAs
   * @default false
   */
  persistent?: boolean;

  /**
   * Optional action buttons
   */
  actions?: NotificationAction[];

  /**
   * Optional custom content render function
   * If provided, overrides default title/description layout
   */
  renderContent?: () => ReactNode;

  /**
   * Timestamp when notification was created
   */
  createdAt: number;
}

/**
 * Notification input without auto-generated fields
 */
export type NotificationInput = Omit<Notification, 'id' | 'createdAt'>;

/**
 * Type guard to check if value is a valid NotificationType
 */
export const isNotificationType = (value: unknown): value is NotificationType => {
  return typeof value === 'string' && ['success', 'warning', 'error', 'info'].includes(value);
};

/**
 * Helper to create a success notification
 */
export const createSuccessNotification = (
  title: string,
  description?: string
): NotificationInput => ({
  type: 'success',
  title,
  description,
});

/**
 * Helper to create an error notification
 */
export const createErrorNotification = (
  title: string,
  description?: string
): NotificationInput => ({
  type: 'error',
  title,
  description,
});

/**
 * Helper to create a warning notification
 */
export const createWarningNotification = (
  title: string,
  description?: string
): NotificationInput => ({
  type: 'warning',
  title,
  description,
});

/**
 * Helper to create an info notification
 */
export const createInfoNotification = (title: string, description?: string): NotificationInput => ({
  type: 'info',
  title,
  description,
});
