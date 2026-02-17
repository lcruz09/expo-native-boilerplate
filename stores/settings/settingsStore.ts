import {
  createZustandStorage,
  STORAGE_IDS,
} from "@/services/storage/kvStorage";
import { CalorieMethod } from "@/utils/calories";
import { isDevice } from "expo-device";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Settings Store State Interface
 */
interface SettingsStore {
  /**
   * Calorie calculation method
   */
  calorieCalculationMethod: CalorieMethod;

  /**
   * Whether mock BLE devices are enabled for testing
   */
  enableMockDevices: boolean;

  /**
   * Set the calorie calculation method
   */
  setCalorieMethod: (method: CalorieMethod) => void;

  /**
   * Enable or disable mock devices
   */
  setEnableMockDevices: (enabled: boolean) => void;
}

/**
 * Settings Store
 *
 * Manages app-wide settings with persistence.
 * Settings are automatically saved to MMKV storage.
 *
 * @example
 * ```tsx
 * const { enableMockDevices, setEnableMockDevices } = useSettingsStore();
 *
 * // Toggle mock devices
 * setEnableMockDevices(!enableMockDevices);
 * ```
 */
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      calorieCalculationMethod: "both",
      enableMockDevices: isDevice === false,

      setCalorieMethod: (method) => {
        set({ calorieCalculationMethod: method });
      },

      setEnableMockDevices: (enabled) => {
        set({ enableMockDevices: enabled });
      },
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() =>
        createZustandStorage(STORAGE_IDS.SETTINGS),
      ),
    },
  ),
);
