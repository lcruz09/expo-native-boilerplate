import { act, renderHook } from '@testing-library/react-native';
import { useThemeStore } from '../themeStore';

// Mock SQLite KV storage so the Zustand persist middleware doesn't need a real DB
jest.mock('@/services/storage/kvStorage', () => ({
  createZustandStorage: jest.fn(() => ({
    getItem: jest.fn().mockReturnValue(null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  })),
  STORAGE_IDS: {
    THEME: 'app-theme-storage',
  },
}));

// Appearance is mocked globally (returns "light") in jest.mocks.js

describe('useThemeStore', () => {
  beforeEach(() => {
    // Reset to default state before each test
    act(() => {
      useThemeStore.setState({
        mode: 'system',
        resolvedTheme: 'light',
        systemColorScheme: 'light',
      });
    });
  });

  describe('setMode', () => {
    it('sets mode to light and resolves to light', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => result.current.setMode('light'));

      expect(result.current.mode).toBe('light');
      expect(result.current.resolvedTheme).toBe('light');
    });

    it('sets mode to dark and resolves to dark', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => result.current.setMode('dark'));

      expect(result.current.mode).toBe('dark');
      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('resolves to the system color scheme when mode is system', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        useThemeStore.setState({ systemColorScheme: 'dark' });
        result.current.setMode('system');
      });

      expect(result.current.mode).toBe('system');
      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('resolves to light when system scheme is light and mode is system', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        useThemeStore.setState({ systemColorScheme: 'light' });
        result.current.setMode('system');
      });

      expect(result.current.resolvedTheme).toBe('light');
    });
  });

  describe('setSystemColorScheme', () => {
    it('updates resolvedTheme when mode is system and scheme changes to dark', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => result.current.setMode('system'));
      act(() => result.current.setSystemColorScheme('dark'));

      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('does not change resolvedTheme when mode is fixed to light', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => result.current.setMode('light'));
      act(() => result.current.setSystemColorScheme('dark'));

      expect(result.current.resolvedTheme).toBe('light');
    });

    it('does not change resolvedTheme when mode is fixed to dark', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => result.current.setMode('dark'));
      act(() => result.current.setSystemColorScheme('light'));

      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('falls back to light when null is passed and no prior scheme is stored', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        useThemeStore.setState({ mode: 'system', systemColorScheme: null });
        result.current.setSystemColorScheme(null);
      });

      expect(result.current.resolvedTheme).toBe('light');
    });
  });

  describe('getResolvedTheme', () => {
    it('returns the current resolved theme', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => result.current.setMode('dark'));

      expect(result.current.getResolvedTheme()).toBe('dark');
    });

    it('reflects updates after mode change', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => result.current.setMode('dark'));
      expect(result.current.getResolvedTheme()).toBe('dark');

      act(() => result.current.setMode('light'));
      expect(result.current.getResolvedTheme()).toBe('light');
    });
  });
});
