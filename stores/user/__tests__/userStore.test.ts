import { act, renderHook } from '@testing-library/react-native';
import { useUserStore } from '../userStore';

jest.mock('@/services/storage/kvStorage', () => ({
  createZustandStorage: jest.fn(() => ({
    getItem: jest.fn().mockReturnValue(null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  })),
  STORAGE_IDS: {
    SETTINGS: 'app-settings',
  },
}));

describe('useUserStore', () => {
  beforeEach(() => {
    act(() => {
      useUserStore.setState({ language: 'en', hasSeenOnboarding: false });
    });
  });

  describe('initial state', () => {
    it('defaults language to English', () => {
      const { result } = renderHook(() => useUserStore());
      expect(result.current.language).toBe('en');
    });

    it('defaults hasSeenOnboarding to false', () => {
      const { result } = renderHook(() => useUserStore());
      expect(result.current.hasSeenOnboarding).toBe(false);
    });
  });

  describe('setLanguage', () => {
    it('updates the language', () => {
      const { result } = renderHook(() => useUserStore());

      act(() => result.current.setLanguage('es'));

      expect(result.current.language).toBe('es');
    });

    it('can switch back to English', () => {
      const { result } = renderHook(() => useUserStore());

      act(() => result.current.setLanguage('es'));
      act(() => result.current.setLanguage('en'));

      expect(result.current.language).toBe('en');
    });
  });

  describe('setHasSeenOnboarding', () => {
    it('marks onboarding as seen', () => {
      const { result } = renderHook(() => useUserStore());

      act(() => result.current.setHasSeenOnboarding(true));

      expect(result.current.hasSeenOnboarding).toBe(true);
    });

    it('can reset onboarding seen status', () => {
      const { result } = renderHook(() => useUserStore());

      act(() => result.current.setHasSeenOnboarding(true));
      act(() => result.current.setHasSeenOnboarding(false));

      expect(result.current.hasSeenOnboarding).toBe(false);
    });
  });
});
