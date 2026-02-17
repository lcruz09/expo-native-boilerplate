/**
 * Tests for SupabaseProfileService
 *
 * Tests the Supabase implementation of IProfileService including:
 * - Create profile
 * - Get profile
 * - Update profile
 * - Delete profile
 * - Data transformation between app types and database types
 */

import { SupabaseProfileService } from "../SupabaseProfileService";
import { supabase } from "../client";
import { Gender } from "@/types/profile";

// Mock the Supabase client
jest.mock("../client", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe("SupabaseProfileService", () => {
  let service: SupabaseProfileService;

  // Mock Supabase query builder
  const mockSelect = jest.fn();
  const mockInsert = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  const mockEq = jest.fn();
  const mockSingle = jest.fn();

  beforeEach(() => {
    service = new SupabaseProfileService();
    jest.clearAllMocks();

    // Setup default mock chain
    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
    });

    mockSelect.mockReturnValue({ eq: mockEq, single: mockSingle });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ select: mockSelect, single: mockSingle });
    mockSingle.mockResolvedValue({ data: null, error: null });
  });

  describe("createProfile", () => {
    it("should create profile successfully", async () => {
      const mockProfileData = {
        gender: Gender.MALE,
        birthYear: 1990,
        height: 180,
        weight: 75,
        firstName: "John",
        lastName: "Doe",
        restingHeartRate: 60,
      };

      const mockDbRow = {
        id: "user-123",
        email: "test@example.com",
        first_name: "John",
        last_name: "Doe",
        gender: "male",
        birth_year: 1990,
        height: 180,
        weight: 75,
        resting_heart_rate: 60,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      mockSingle.mockResolvedValue({ data: mockDbRow, error: null });

      const result = await service.createProfile(
        "user-123",
        "test@example.com",
        mockProfileData,
      );

      expect(result).toEqual({
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 180,
        weight: 75,
        restingHeartRate: 60,
      });

      expect(supabase.from).toHaveBeenCalledWith("profiles");
      expect(mockInsert).toHaveBeenCalledWith({
        id: "user-123",
        email: "test@example.com",
        first_name: "John",
        last_name: "Doe",
        gender: "male",
        birth_year: 1990,
        height: 180,
        weight: 75,
        resting_heart_rate: 60,
      });
    });

    it("should handle optional fields correctly", async () => {
      const mockProfileData = {
        gender: Gender.FEMALE,
        birthYear: 1995,
        height: 165,
        weight: 60,
      };

      const mockDbRow = {
        id: "user-456",
        email: "test2@example.com",
        first_name: null,
        last_name: null,
        gender: "female",
        birth_year: 1995,
        height: 165,
        weight: 60,
        resting_heart_rate: null,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      mockSingle.mockResolvedValue({ data: mockDbRow, error: null });

      const result = await service.createProfile(
        "user-456",
        "test2@example.com",
        mockProfileData,
      );

      expect(result).toEqual({
        email: "test2@example.com",
        firstName: undefined,
        lastName: undefined,
        gender: Gender.FEMALE,
        birthYear: 1995,
        height: 165,
        weight: 60,
        restingHeartRate: undefined,
      });
    });

    it("should throw error when creation fails", async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: "Insert failed" },
      });

      await expect(
        service.createProfile("user-123", "test@example.com", {
          gender: Gender.MALE,
          birthYear: 1990,
          height: 180,
          weight: 75,
        }),
      ).rejects.toThrow("Failed to create profile: Insert failed");
    });
  });

  describe("getProfile", () => {
    it("should get profile successfully", async () => {
      const mockDbRow = {
        id: "user-123",
        email: "test@example.com",
        first_name: "John",
        last_name: "Doe",
        gender: "male",
        birth_year: 1990,
        height: 180,
        weight: 75,
        resting_heart_rate: 60,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      mockSingle.mockResolvedValue({ data: mockDbRow, error: null });

      const result = await service.getProfile("user-123");

      expect(result).toEqual({
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 180,
        weight: 75,
        restingHeartRate: 60,
      });

      expect(supabase.from).toHaveBeenCalledWith("profiles");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("id", "user-123");
    });

    it("should return null when profile not found", async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { code: "PGRST116" },
      });

      const result = await service.getProfile("user-999");

      expect(result).toBeNull();
    });

    it("should throw error on database error", async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: "Database error", code: "OTHER_ERROR" },
      });

      await expect(service.getProfile("user-123")).rejects.toThrow(
        "Failed to fetch profile: Database error",
      );
    });

    it("should convert gender types correctly", async () => {
      const testCases = [
        { dbGender: "male", expectedGender: Gender.MALE },
        { dbGender: "female", expectedGender: Gender.FEMALE },
        { dbGender: "other", expectedGender: Gender.OTHER },
        { dbGender: "invalid", expectedGender: Gender.OTHER },
      ];

      for (const testCase of testCases) {
        mockSingle.mockResolvedValue({
          data: {
            id: "user-123",
            email: "test@example.com",
            first_name: null,
            last_name: null,
            gender: testCase.dbGender,
            birth_year: 1990,
            height: 180,
            weight: 75,
            resting_heart_rate: null,
            created_at: "2024-01-01",
            updated_at: "2024-01-01",
          },
          error: null,
        });

        const result = await service.getProfile("user-123");

        expect(result?.gender).toBe(testCase.expectedGender);
      }
    });
  });

  describe("updateProfile", () => {
    it("should update profile successfully", async () => {
      // Mock getProfile call
      const mockExistingProfile = {
        id: "user-123",
        email: "test@example.com",
        first_name: "John",
        last_name: "Doe",
        gender: "male",
        birth_year: 1990,
        height: 180,
        weight: 75,
        resting_heart_rate: 60,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      const mockUpdatedProfile = {
        ...mockExistingProfile,
        weight: 80,
        resting_heart_rate: 55,
      };

      mockSingle
        .mockResolvedValueOnce({ data: mockExistingProfile, error: null })
        .mockResolvedValueOnce({ data: mockUpdatedProfile, error: null });

      const result = await service.updateProfile("user-123", {
        weight: 80,
        restingHeartRate: 55,
      });

      expect(result.weight).toBe(80);
      expect(result.restingHeartRate).toBe(55);

      expect(mockUpdate).toHaveBeenCalledWith({
        id: "user-123",
        email: "test@example.com",
        first_name: null,
        last_name: null,
        gender: undefined,
        birth_year: undefined,
        height: undefined,
        weight: 80,
        resting_heart_rate: 55,
      });
    });

    it("should throw error when profile not found", async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { code: "PGRST116" },
      });

      await expect(
        service.updateProfile("user-999", { weight: 80 }),
      ).rejects.toThrow("Profile not found");
    });

    it("should throw error when update fails", async () => {
      // Mock successful getProfile
      mockSingle.mockResolvedValueOnce({
        data: {
          id: "user-123",
          email: "test@example.com",
          first_name: null,
          last_name: null,
          gender: "male",
          birth_year: 1990,
          height: 180,
          weight: 75,
          resting_heart_rate: null,
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
        },
        error: null,
      });

      // Mock failed update
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { message: "Update failed" },
      });

      await expect(
        service.updateProfile("user-123", { weight: 80 }),
      ).rejects.toThrow("Failed to update profile: Update failed");
    });
  });

  describe("deleteProfile", () => {
    it("should delete profile successfully", async () => {
      mockEq.mockResolvedValue({ error: null });

      await service.deleteProfile("user-123");

      expect(supabase.from).toHaveBeenCalledWith("profiles");
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", "user-123");
    });

    it("should throw error when deletion fails", async () => {
      mockEq.mockResolvedValue({ error: { message: "Deletion failed" } });

      await expect(service.deleteProfile("user-123")).rejects.toThrow(
        "Failed to delete profile: Deletion failed",
      );
    });
  });
});
