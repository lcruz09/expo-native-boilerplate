import { generateUUID, isValidUUID } from "../uuid";

describe("uuid", () => {
  describe("generateUUID", () => {
    it("should generate a valid UUID v4", () => {
      const uuid = generateUUID();
      expect(isValidUUID(uuid)).toBe(true);
    });

    it("should generate unique UUIDs", () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });

    it("should generate UUIDs with correct format", () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it("should generate multiple unique UUIDs", () => {
      const uuids = new Set();
      for (let i = 0; i < 100; i++) {
        uuids.add(generateUUID());
      }
      expect(uuids.size).toBe(100);
    });
  });

  describe("isValidUUID", () => {
    it("should validate correct UUIDs", () => {
      expect(isValidUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
      expect(isValidUUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).toBe(true);
      expect(isValidUUID("6ba7b811-9dad-11d1-80b4-00c04fd430c8")).toBe(true);
    });

    it("should reject invalid UUIDs", () => {
      expect(isValidUUID("invalid")).toBe(false);
      expect(isValidUUID("workout-123456")).toBe(false);
      expect(isValidUUID("imported-123456-abc")).toBe(false);
      expect(isValidUUID("")).toBe(false);
      expect(isValidUUID("550e8400-e29b-41d4-a716")).toBe(false); // Too short
      expect(isValidUUID("550e8400e29b41d4a716446655440000")).toBe(false); // No dashes
    });

    it("should reject UUIDs with invalid variant", () => {
      // Invalid variant (should be 8, 9, a, or b)
      expect(isValidUUID("550e8400-e29b-41d4-c716-446655440000")).toBe(false);
    });

    it("should reject UUIDs with invalid version", () => {
      // Invalid version (should be 1-5)
      expect(isValidUUID("550e8400-e29b-61d4-a716-446655440000")).toBe(false);
    });
  });
});
