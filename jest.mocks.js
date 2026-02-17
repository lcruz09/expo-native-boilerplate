/**
 * Jest module mocks that need to be hoisted before test execution.
 * This file is loaded before setupFilesAfterEnv.
 * Note: Dimensions uses a manual mock in __mocks__ directory.
 */

// Suppress console output during tests to keep test output clean
const originalError = console.error;
const originalWarn = console.warn;

// Override console methods to suppress noisy warnings
// Using regular functions instead of jest.fn() to prevent Jest from tracking these calls
console.log = () => {};
console.info = () => {};
console.debug = () => {};
console.warn = () => {};

console.error = (...args) => {
  const message = args[0];

  // Convert message to string for checking, handling both string and Error objects
  const messageStr = typeof message === "string" ? message : String(message);

  // Suppress known warnings that are not actionable
  // Icon component async state updates (from @expo/vector-icons)
  if (
    messageStr.includes(
      "An update to Icon inside a test was not wrapped in act",
    )
  ) {
    return;
  }
  if (messageStr.includes("Warning: An update to")) {
    return;
  }
  // Worker process warnings (benign test cleanup warnings)
  if (messageStr.includes("A worker process has failed to exit gracefully")) {
    return;
  }
  // Unimplemented browser APIs in JSDOM
  if (
    messageStr.includes("Not implemented: HTMLFormElement.prototype.submit")
  ) {
    return;
  }
  // Punycode deprecation warning (from dependencies)
  if (messageStr.includes("punycode")) {
    return;
  }

  // For all other errors, show them
  originalError(...args);
};

// Mock React Native's Appearance API
jest.mock("react-native/Libraries/Utilities/Appearance", () => ({
  getColorScheme: jest.fn(() => "light"),
  addChangeListener: jest.fn(),
  removeChangeListener: jest.fn(),
}));

// Mock NativeWind/CSS Interop to prevent initialization issues
jest.mock("react-native-css-interop", () => ({
  cssInterop: jest.fn((component) => component),
  remapProps: jest.fn(),
}));

// Mock react-native-mmkv
jest.mock("react-native-mmkv", () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    getNumber: jest.fn(),
    getBoolean: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    clearAll: jest.fn(),
    getAllKeys: jest.fn(() => []),
  })),
  createMMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    getNumber: jest.fn(),
    getBoolean: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    clearAll: jest.fn(),
    getAllKeys: jest.fn(() => []),
  })),
}));

// Mock expo-secure-store
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock secure storage service
jest.mock("@/services/storage/secureStorage", () => ({
  secureStorage: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock useColors hook globally to avoid repetition in tests
jest.mock("@/hooks/theme/useColors", () => ({
  useColors: () => ({
    background: "#FFFFFF",
    card: "#FFFFFF",
    border: {
      light: "#E0E0E0",
      medium: "#CCCCCC",
      dark: "#999999",
    },
    text: {
      primary: "#000000",
      secondary: "#666666",
      tertiary: "#999999",
    },
    primary: "#00E1A9",
    secondary: "#FF6B6B",
    status: {
      success: "#4CAF50",
      error: "#FF0000",
      warning: "#FFA500",
      info: "#2196F3",
    },
    heartRateZones: {
      resting: "#6B7280",
      easy: "#3B82F6",
      moderate: "#10B981",
      hard: "#F59E0B",
      maximum: "#EF4444",
    },
  }),
}));

// Mock useTranslation hook globally to avoid repetition in tests
jest.mock("@/hooks/localization/useTranslation", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock logger utility globally
jest.mock("@/utils/logger", () => ({
  createLogger: jest.fn(() => ({
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    startTimer: jest.fn(() => jest.fn()),
  })),
}));

// Mock expo-haptics
jest.mock("expo-haptics", () => ({
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
  NotificationFeedbackType: {
    Success: "success",
    Warning: "warning",
    Error: "error",
  },
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
}));

// Mock @garmin/fitsdk library
jest.mock("@garmin/fitsdk", () => {
  return {
    Encoder: jest.fn().mockImplementation(() => ({
      writeMesg: jest.fn(),
      onMesg: jest.fn(),
      addDeveloperField: jest.fn(),
      close: jest.fn(() => new Uint8Array([0x0e, 0x10, 0x00, 0x00])), // Mock FIT header
    })),
    Decoder: jest.fn().mockImplementation(() => ({
      isFIT: jest.fn(() => true),
      checkIntegrity: jest.fn(() => true),
      read: jest.fn(() => ({
        messages: {
          sessionMesgs: [
            {
              sport: 2, // Cycling
              subSport: 6, // Indoor Cycling (for Zwift, virtual rides, etc.)
              sessionName: "Morning Ride", // Title
              notes: "Easy recovery ride", // Description
              startTime: new Date("2023-01-01T10:00:00Z"),
              timestamp: new Date("2023-01-01T11:00:00Z"),
              totalElapsedTime: 3600,
              totalTimerTime: 3600,
              totalCalories: 500,
              totalDistance: 20000,
              avgHeartRate: 140,
              maxHeartRate: 170,
              avgSpeed: 5.56, // m/s (20 km/h)
              maxSpeed: 8.33, // m/s (30 km/h)
              avgCadence: 80,
              maxCadence: 100,
              avgPower: 200,
              maxPower: 400,
            },
          ],
          recordMesgs: [
            {
              timestamp: new Date("2023-01-01T10:00:00Z"),
              heartRate: 140,
              cadence: 80,
              power: 200,
              speed: 5.56,
              distance: 0,
            },
          ],
        },
        errors: [],
      })),
    })),
    Stream: {
      fromByteArray: jest.fn(() => ({})),
    },
    Profile: {
      MesgNum: {
        FILE_ID: 0,
        EVENT: 21,
        RECORD: 20,
        LAP: 19,
        SESSION: 18,
        ACTIVITY: 34,
      },
    },
  };
});

// Mock expo-file-system/legacy
jest.mock("expo-file-system/legacy", () => {
  return {
    cacheDirectory: "file:///mock/cache/",
    documentDirectory: "file:///mock/documents/",
    EncodingType: {
      UTF8: "utf8",
      Base64: "base64",
    },
    writeAsStringAsync: jest.fn(() => Promise.resolve()),
    readAsStringAsync: jest.fn(() =>
      // Return mock base64 data (minimal FIT file header)
      Promise.resolve("DhAAAAAAAAAA"),
    ),
  };
});

// Mock expo-sharing
jest.mock("expo-sharing", () => ({
  shareAsync: jest.fn(() => Promise.resolve()),
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
}));

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: {
      View,
    },
    View,
    useSharedValue: (value) => ({ value }),
    useAnimatedStyle: (callback) => callback(),
    withTiming: (value) => value,
    withSpring: (value) => value,
  };
});
