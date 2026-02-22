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
  const messageStr = typeof message === 'string' ? message : String(message);

  // Suppress known warnings that are not actionable
  // Icon component async state updates (from @expo/vector-icons)
  if (messageStr.includes('An update to Icon inside a test was not wrapped in act')) {
    return;
  }
  if (messageStr.includes('Warning: An update to')) {
    return;
  }
  // Worker process warnings (benign test cleanup warnings)
  if (messageStr.includes('A worker process has failed to exit gracefully')) {
    return;
  }
  // Unimplemented browser APIs in JSDOM
  if (messageStr.includes('Not implemented: HTMLFormElement.prototype.submit')) {
    return;
  }
  // Punycode deprecation warning (from dependencies)
  if (messageStr.includes('punycode')) {
    return;
  }

  // For all other errors, show them
  originalError(...args);
};

// Mock React Native's Appearance API
jest.mock('react-native/Libraries/Utilities/Appearance', () => ({
  getColorScheme: jest.fn(() => 'light'),
  addChangeListener: jest.fn(),
  removeChangeListener: jest.fn(),
}));

// Mock NativeWind/CSS Interop to prevent initialization issues
jest.mock('react-native-css-interop', () => ({
  cssInterop: jest.fn((component) => component),
  remapProps: jest.fn(),
}));

// Mock secure storage service
jest.mock('@/services/storage/secureStorage', () => ({
  secureStorage: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock useColors hook globally
jest.mock('@/hooks/theme/useColors', () => ({
  useColors: () => ({
    background: '#FFFFFF',
    card: '#FFFFFF',
    border: {
      light: '#E0E0E0',
      medium: '#CCCCCC',
      dark: '#999999',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
      tertiary: '#999999',
    },
    primary: '#00E1A9',
    secondary: '#FF6B6B',
    status: {
      success: '#4CAF50',
      error: '#FF0000',
      warning: '#FFA500',
      info: '#2196F3',
    },
  }),
}));

// Mock useTranslation hook globally
jest.mock('@/hooks/localization/useTranslation', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock logger utility
jest.mock('@/utils/logger', () => ({
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
jest.mock('expo-haptics', () => ({
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  impactAsync: jest.fn(() => Promise.resolve()),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
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
