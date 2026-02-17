import { renderHook, act } from "@testing-library/react-native";
import { useSettingsStore } from "../settingsStore";

jest.mock("expo-device", () => ({
  isDevice: true,
}));

const mockedExpoDevice = jest.requireMock("expo-device") as unknown as {
  isDevice: boolean;
};

describe("settingsStore", () => {
  beforeEach(() => {
    mockedExpoDevice.isDevice = true;
    useSettingsStore.persist?.clearStorage?.();

    // Reset store to initial state before each test
    act(() => {
      useSettingsStore.setState({
        calorieCalculationMethod: "both",
        enableMockDevices: false,
      });
    });
  });

  describe("initialization", () => {
    it("should initialize with mock devices disabled on real devices", () => {
      mockedExpoDevice.isDevice = true;

      // Use isolateModules to reload the module with the new isDevice value
      jest.isolateModules(() => {
        const { useSettingsStore: isolatedStore } = require("../settingsStore");

        // Access store state directly without renderHook to avoid React instance conflicts
        const state = isolatedStore.getState();
        expect(state.enableMockDevices).toBe(false);
      });
    });

    it("should initialize with mock devices enabled on simulators", () => {
      mockedExpoDevice.isDevice = false;
      useSettingsStore.persist?.clearStorage?.();

      // Use isolateModules to reload the module with the new isDevice value
      jest.isolateModules(() => {
        const { useSettingsStore: isolatedStore } = require("../settingsStore");

        // Access store state directly without renderHook to avoid React instance conflicts
        const state = isolatedStore.getState();
        expect(state.enableMockDevices).toBe(true);
      });
    });
  });

  describe("setEnableMockDevices", () => {
    it("should enable mock devices", () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setEnableMockDevices(true);
      });

      expect(result.current.enableMockDevices).toBe(true);
    });

    it("should disable mock devices", () => {
      const { result } = renderHook(() => useSettingsStore());

      // First enable
      act(() => {
        result.current.setEnableMockDevices(true);
      });

      // Then disable
      act(() => {
        result.current.setEnableMockDevices(false);
      });

      expect(result.current.enableMockDevices).toBe(false);
    });

    it("should toggle mock devices multiple times", () => {
      const { result } = renderHook(() => useSettingsStore());

      // Enable
      act(() => {
        result.current.setEnableMockDevices(true);
      });
      expect(result.current.enableMockDevices).toBe(true);

      // Disable
      act(() => {
        result.current.setEnableMockDevices(false);
      });
      expect(result.current.enableMockDevices).toBe(false);

      // Enable again
      act(() => {
        result.current.setEnableMockDevices(true);
      });
      expect(result.current.enableMockDevices).toBe(true);
    });
  });

  describe("persistence", () => {
    it("should persist state changes", () => {
      const { result: result1 } = renderHook(() => useSettingsStore());

      // Change state
      act(() => {
        result1.current.setEnableMockDevices(true);
      });

      // Create a new hook instance (simulating app restart)
      const { result: result2 } = renderHook(() => useSettingsStore());

      // State should persist
      expect(result2.current.enableMockDevices).toBe(true);
    });

    it("should maintain state across multiple hook instances", () => {
      const { result: result1 } = renderHook(() => useSettingsStore());
      const { result: result2 } = renderHook(() => useSettingsStore());

      // Change state in first instance
      act(() => {
        result1.current.setEnableMockDevices(true);
      });

      // Both instances should reflect the change
      expect(result1.current.enableMockDevices).toBe(true);
      expect(result2.current.enableMockDevices).toBe(true);
    });
  });
});
