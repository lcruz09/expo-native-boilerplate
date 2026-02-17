import * as Haptics from "expo-haptics";

/**
 * Haptic feedback utility for providing tactile feedback to users.
 * Uses Expo Haptics API for cross-platform support.
 */

/**
 * Provides a light haptic feedback.
 * Use for small UI interactions like button taps or slider movements.
 */
export const lightHaptic = () => {
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    // Silently fail on platforms that don't support haptics
  }
};

/**
 * Provides a medium haptic feedback.
 * Use for more significant interactions like preset selections.
 */
export const mediumHaptic = () => {
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    // Silently fail on platforms that don't support haptics
  }
};

/**
 * Provides a heavy haptic feedback.
 * Use for important actions or reaching limits.
 */
export const heavyHaptic = () => {
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch (error) {
    // Silently fail on platforms that don't support haptics
  }
};

/**
 * Provides a selection haptic feedback.
 * Use for continuous feedback during slider movements.
 */
export const selectionHaptic = () => {
  try {
    Haptics.selectionAsync();
  } catch (error) {
    // Silently fail on platforms that don't support haptics
  }
};

/**
 * Provides a success haptic feedback.
 * Use for successful operations.
 */
export const successHaptic = () => {
  try {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    // Silently fail on platforms that don't support haptics
  }
};

/**
 * Provides an error haptic feedback.
 * Use for errors or limit reached.
 */
export const errorHaptic = () => {
  try {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (error) {
    // Silently fail on platforms that don't support haptics
  }
};

/**
 * Provides a warning haptic feedback.
 * Use for warnings or cautions.
 */
export const warningHaptic = () => {
  try {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch (error) {
    // Silently fail on platforms that don't support haptics
  }
};
