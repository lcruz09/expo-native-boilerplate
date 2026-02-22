import * as Device from 'expo-device';

/**
 * System information structure
 */
export interface SystemInfo {
  /** Device manufacturer (e.g., "Apple", "Samsung") */
  deviceBrand: string | null;
  /** Device model name (e.g., "iPhone 14 Pro") */
  deviceModel: string | null;
  /** Operating system name (e.g., "iOS", "Android") */
  osName: string | null;
  /** Operating system version (e.g., "16.1") */
  osVersion: string | null;
  /** Device timezone (e.g., "America/Los_Angeles") */
  timezone: string;
  /** App version from app.config.js */
  appVersion: string;
  /** Timestamp when system info was collected */
  timestamp: string;
}

/**
 * Collect system and device information.
 *
 * Gathers device details, OS info, timezone, and app version
 * for logging and debugging purposes.
 *
 * @returns SystemInfo object with device and app details
 *
 * @example
 * ```tsx
 * const systemInfo = getSystemInfo();
 * logger.info("System Info:", systemInfo);
 * ```
 */
export const getSystemInfo = (): SystemInfo => {
  // Get timezone using Intl API
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // App version from app.config.js
  const appVersion = '1.0.0';

  return {
    deviceBrand: Device.brand,
    deviceModel: Device.modelName,
    osName: Device.osName,
    osVersion: Device.osVersion,
    timezone,
    appVersion,
    timestamp: new Date().toISOString(),
  };
};
