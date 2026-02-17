import { Platform, PermissionsAndroid } from "react-native";
import * as Device from "expo-device";
import { requestBlePermissions } from "../requestBlePermissions";

// Mock dependencies
jest.mock("react-native", () => ({
  Platform: {
    OS: "android",
  },
  PermissionsAndroid: {
    request: jest.fn(),
    requestMultiple: jest.fn(),
    PERMISSIONS: {
      BLUETOOTH_SCAN: "android.permission.BLUETOOTH_SCAN",
      BLUETOOTH_CONNECT: "android.permission.BLUETOOTH_CONNECT",
      ACCESS_FINE_LOCATION: "android.permission.ACCESS_FINE_LOCATION",
    },
    RESULTS: {
      GRANTED: "granted",
      DENIED: "denied",
      NEVER_ASK_AGAIN: "never_ask_again",
    },
  },
}));

jest.mock("expo-device", () => ({
  platformApiLevel: 31,
}));

describe("requestBlePermissions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("iOS", () => {
    beforeEach(() => {
      Platform.OS = "ios";
    });

    it("returns true on iOS without requesting permissions", async () => {
      const result = await requestBlePermissions();
      expect(result).toBe(true);
      expect(PermissionsAndroid.requestMultiple).not.toHaveBeenCalled();
      expect(PermissionsAndroid.request).not.toHaveBeenCalled();
    });
  });

  describe("Android API 31+", () => {
    beforeEach(() => {
      Platform.OS = "android";
      (Device as any).platformApiLevel = 31;
    });

    it("requests BLUETOOTH_SCAN, BLUETOOTH_CONNECT, and ACCESS_FINE_LOCATION permissions", async () => {
      (PermissionsAndroid.requestMultiple as jest.Mock).mockResolvedValue({
        "android.permission.BLUETOOTH_SCAN": PermissionsAndroid.RESULTS.GRANTED,
        "android.permission.BLUETOOTH_CONNECT":
          PermissionsAndroid.RESULTS.GRANTED,
        "android.permission.ACCESS_FINE_LOCATION":
          PermissionsAndroid.RESULTS.GRANTED,
      });

      await requestBlePermissions();

      expect(PermissionsAndroid.requestMultiple).toHaveBeenCalledWith([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    });

    it("returns true when both BLUETOOTH permissions are granted", async () => {
      (PermissionsAndroid.requestMultiple as jest.Mock).mockResolvedValue({
        "android.permission.BLUETOOTH_SCAN": PermissionsAndroid.RESULTS.GRANTED,
        "android.permission.BLUETOOTH_CONNECT":
          PermissionsAndroid.RESULTS.GRANTED,
        "android.permission.ACCESS_FINE_LOCATION":
          PermissionsAndroid.RESULTS.DENIED,
      });

      const result = await requestBlePermissions();
      expect(result).toBe(true);
    });

    it("returns false when BLUETOOTH_SCAN is denied", async () => {
      (PermissionsAndroid.requestMultiple as jest.Mock).mockResolvedValue({
        "android.permission.BLUETOOTH_SCAN": PermissionsAndroid.RESULTS.DENIED,
        "android.permission.BLUETOOTH_CONNECT":
          PermissionsAndroid.RESULTS.GRANTED,
      });

      const result = await requestBlePermissions();
      expect(result).toBe(false);
    });

    it("returns false when BLUETOOTH_CONNECT is denied", async () => {
      (PermissionsAndroid.requestMultiple as jest.Mock).mockResolvedValue({
        "android.permission.BLUETOOTH_SCAN": PermissionsAndroid.RESULTS.GRANTED,
        "android.permission.BLUETOOTH_CONNECT":
          PermissionsAndroid.RESULTS.DENIED,
      });

      const result = await requestBlePermissions();
      expect(result).toBe(false);
    });

    it("returns false when both BLUETOOTH permissions are denied", async () => {
      (PermissionsAndroid.requestMultiple as jest.Mock).mockResolvedValue({
        "android.permission.BLUETOOTH_SCAN": PermissionsAndroid.RESULTS.DENIED,
        "android.permission.BLUETOOTH_CONNECT":
          PermissionsAndroid.RESULTS.DENIED,
      });

      const result = await requestBlePermissions();
      expect(result).toBe(false);
    });
  });

  describe("Android API < 31", () => {
    beforeEach(() => {
      Platform.OS = "android";
      (Device as any).platformApiLevel = 30;
    });

    it("requests only ACCESS_FINE_LOCATION permission", async () => {
      (PermissionsAndroid.request as jest.Mock).mockResolvedValue(
        PermissionsAndroid.RESULTS.GRANTED,
      );

      await requestBlePermissions();

      expect(PermissionsAndroid.request).toHaveBeenCalledWith(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "Location access is required to scan for Bluetooth sensors.",
          buttonPositive: "OK",
        },
      );
    });

    it("returns true when ACCESS_FINE_LOCATION is granted", async () => {
      (PermissionsAndroid.request as jest.Mock).mockResolvedValue(
        PermissionsAndroid.RESULTS.GRANTED,
      );

      const result = await requestBlePermissions();
      expect(result).toBe(true);
    });

    it("returns false when ACCESS_FINE_LOCATION is denied", async () => {
      (PermissionsAndroid.request as jest.Mock).mockResolvedValue(
        PermissionsAndroid.RESULTS.DENIED,
      );

      const result = await requestBlePermissions();
      expect(result).toBe(false);
    });

    it("returns false when ACCESS_FINE_LOCATION is never_ask_again", async () => {
      (PermissionsAndroid.request as jest.Mock).mockResolvedValue(
        PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN,
      );

      const result = await requestBlePermissions();
      expect(result).toBe(false);
    });
  });

  describe("Other platforms", () => {
    it("returns false for unsupported platforms", async () => {
      Platform.OS = "web" as any;

      const result = await requestBlePermissions();
      expect(result).toBe(false);
    });
  });

  describe("Edge cases", () => {
    beforeEach(() => {
      Platform.OS = "android";
    });

    it("handles missing platformApiLevel (defaults to 30)", async () => {
      (Device as any).platformApiLevel = null;
      (PermissionsAndroid.request as jest.Mock).mockResolvedValue(
        PermissionsAndroid.RESULTS.GRANTED,
      );

      const result = await requestBlePermissions();
      expect(result).toBe(true);
      expect(PermissionsAndroid.request).toHaveBeenCalled();
    });
  });
});
