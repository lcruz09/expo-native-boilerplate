import * as Device from "expo-device";
import { getSystemInfo } from "../systemInfo";

// Mock expo-device
jest.mock("expo-device", () => ({
  brand: "Apple",
  modelName: "iPhone 14 Pro",
  osName: "iOS",
  osVersion: "17.0",
}));

describe("getSystemInfo", () => {
  beforeAll(() => {
    // Mock Intl.DateTimeFormat
    const mockResolvedOptions = jest.fn(() => ({
      timeZone: "America/Los_Angeles",
    }));

    global.Intl.DateTimeFormat = jest.fn(() => ({
      resolvedOptions: mockResolvedOptions,
    })) as any;
  });

  it("should return system information with device details", () => {
    const systemInfo = getSystemInfo();

    expect(systemInfo.deviceBrand).toBe("Apple");
    expect(systemInfo.deviceModel).toBe("iPhone 14 Pro");
    expect(systemInfo.osName).toBe("iOS");
    expect(systemInfo.osVersion).toBe("17.0");
  });

  it("should return timezone from Intl API", () => {
    const systemInfo = getSystemInfo();

    expect(systemInfo.timezone).toBe("America/Los_Angeles");
  });

  it("should return app version", () => {
    const systemInfo = getSystemInfo();

    expect(systemInfo.appVersion).toBe("1.0.0");
  });

  it("should include timestamp in ISO format", () => {
    const beforeTime = new Date().toISOString();
    const systemInfo = getSystemInfo();
    const afterTime = new Date().toISOString();

    expect(systemInfo.timestamp).toBeDefined();
    expect(systemInfo.timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    );
    expect(systemInfo.timestamp >= beforeTime).toBe(true);
    expect(systemInfo.timestamp <= afterTime).toBe(true);
  });

  it("should handle null device values", () => {
    // Mock Device with null values
    (Device.brand as any) = null;
    (Device.modelName as any) = null;
    (Device.osName as any) = null;
    (Device.osVersion as any) = null;

    const systemInfo = getSystemInfo();

    expect(systemInfo.deviceBrand).toBeNull();
    expect(systemInfo.deviceModel).toBeNull();
    expect(systemInfo.osName).toBeNull();
    expect(systemInfo.osVersion).toBeNull();
    expect(systemInfo.timezone).toBe("America/Los_Angeles");
    expect(systemInfo.appVersion).toBe("1.0.0");
  });
});
