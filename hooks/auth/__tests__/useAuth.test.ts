/**
 * Tests for useAuth Hook
 *
 * Tests authentication functionality including:
 * - Login with email/password
 * - Registration with email confirmation
 * - Profile creation from metadata after email confirmation
 * - Logout
 * - Error handling
 */

import { renderHook, waitFor } from "@testing-library/react-native";
import { Gender } from "@/types/profile";
import { AUTH_ERROR_CODES } from "@/utils/errors";

// Mock service function variables - assigned in beforeEach from factory
var mockLogin: jest.Mock;
var mockRegister: jest.Mock;
var mockLogout: jest.Mock;
var mockGetCurrentSession: jest.Mock;
var mockRefreshSession: jest.Mock;
var mockGetCurrentUser: jest.Mock;
var mockResendConfirmationEmail: jest.Mock;
var mockHandleEmailConfirmation: jest.Mock;
var mockOnAuthStateChange: jest.Mock;
var mockCreateProfile: jest.Mock;
var mockGetProfile: jest.Mock;
var mockUpdateProfile: jest.Mock;
var mockDeleteProfile: jest.Mock;

// Mock the factory - must be before imports that use it
jest.mock("@/services/api/factory", () => {
  // Initialize mocks inside the factory
  mockLogin = jest.fn();
  mockRegister = jest.fn();
  mockLogout = jest.fn();
  mockGetCurrentSession = jest.fn();
  mockRefreshSession = jest.fn();
  mockGetCurrentUser = jest.fn();
  mockResendConfirmationEmail = jest.fn();
  mockHandleEmailConfirmation = jest.fn();
  mockOnAuthStateChange = jest.fn();

  mockCreateProfile = jest.fn();
  mockGetProfile = jest.fn();
  mockUpdateProfile = jest.fn();
  mockDeleteProfile = jest.fn();

  const authService = {
    login: mockLogin,
    register: mockRegister,
    logout: mockLogout,
    getCurrentSession: mockGetCurrentSession,
    refreshSession: mockRefreshSession,
    getCurrentUser: mockGetCurrentUser,
    resendConfirmationEmail: mockResendConfirmationEmail,
    handleEmailConfirmation: mockHandleEmailConfirmation,
    onAuthStateChange: mockOnAuthStateChange,
  };

  const profileService = {
    createProfile: mockCreateProfile,
    getProfile: mockGetProfile,
    updateProfile: mockUpdateProfile,
    deleteProfile: mockDeleteProfile,
  };

  return {
    getAuthService: jest.fn(() => authService),
    getProfileService: jest.fn(() => profileService),
  };
});

// Mock stores
jest.mock("@/stores/auth/authStore");
jest.mock("@/stores/profile/profileStore");

// Now import after mocks are set up
import { useAuth } from "../useAuth";
import { useAuthStore } from "@/stores/auth/authStore";
import { useProfileStore } from "@/stores/profile/profileStore";
const mockUseAuthStore = useAuthStore as unknown as jest.MockedFunction<
  typeof useAuthStore
>;
const mockUseProfileStore = useProfileStore as unknown as jest.MockedFunction<
  typeof useProfileStore
>;

describe("useAuth", () => {
  // Helper to get mock services
  const getMocks = () => {
    const {
      getAuthService,
      getProfileService,
    } = require("@/services/api/factory");
    return {
      authService: getAuthService(),
      profileService: getProfileService(),
    };
  };

  // Mock store methods
  const mockSetSession = jest.fn();
  const mockClearSession = jest.fn();
  const mockSetProfile = jest.fn();
  const mockClearProfile = jest.fn();
  const mockLoadFromSupabase = jest.fn();

  // Mock user data
  const mockUser = {
    id: "user-123",
    email: "test@example.com",
    user_metadata: {
      gender: "male",
      birth_year: 1990,
      height: 180,
      weight: 75,
      first_name: "John",
      last_name: "Doe",
      resting_heart_rate: 60,
    },
  };

  const mockSession = {
    access_token: "mock-token",
    refresh_token: "mock-refresh-token",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Get the actual mock services from the factory and assign to module variables
    const { authService, profileService } = getMocks();

    // Re-assign module-level variables so tests can use them
    mockLogin = authService.login as jest.Mock;
    mockRegister = authService.register as jest.Mock;
    mockLogout = authService.logout as jest.Mock;
    mockGetCurrentSession = authService.getCurrentSession as jest.Mock;
    mockRefreshSession = authService.refreshSession as jest.Mock;
    mockGetCurrentUser = authService.getCurrentUser as jest.Mock;
    mockResendConfirmationEmail =
      authService.resendConfirmationEmail as jest.Mock;
    mockHandleEmailConfirmation =
      authService.handleEmailConfirmation as jest.Mock;
    mockOnAuthStateChange = authService.onAuthStateChange as jest.Mock;

    mockCreateProfile = profileService.createProfile as jest.Mock;
    mockGetProfile = profileService.getProfile as jest.Mock;
    mockUpdateProfile = profileService.updateProfile as jest.Mock;
    mockDeleteProfile = profileService.deleteProfile as jest.Mock;

    // Setup auth service mock default implementations
    mockLogin.mockResolvedValue({
      user: mockUser,
      session: mockSession,
    });

    mockRegister.mockResolvedValue({
      user: mockUser,
      session: mockSession,
    });

    mockLogout.mockResolvedValue(undefined);

    // Setup store mocks
    mockUseAuthStore.mockReturnValue({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      setSession: mockSetSession,
      clearSession: mockClearSession,
      initialize: jest.fn(),
    } as any);

    mockUseProfileStore.mockReturnValue({
      profile: null,
      setProfile: mockSetProfile,
      clearProfile: mockClearProfile,
      loadFromSupabase: mockLoadFromSupabase,
      updateProfile: jest.fn(),
      syncWithSupabase: jest.fn(),
    } as any);

    // Setup getState for direct store access
    (mockUseProfileStore as any).getState = jest.fn().mockReturnValue({
      profile: null,
      setProfile: mockSetProfile,
      clearProfile: mockClearProfile,
      loadFromSupabase: mockLoadFromSupabase,
      updateProfile: jest.fn(),
      syncWithSupabase: jest.fn(),
    });
  });

  describe("login", () => {
    it("should login successfully with existing profile", async () => {
      mockLogin.mockResolvedValue({
        user: mockUser,
        session: mockSession,
      } as any);

      // Simulate profile exists in database
      (mockUseProfileStore as any).getState.mockReturnValue({
        profile: {
          email: "test@example.com",
          gender: Gender.MALE,
          birthYear: 1990,
          height: 180,
          weight: 75,
        },
        setProfile: mockSetProfile,
        clearProfile: mockClearProfile,
        loadFromSupabase: mockLoadFromSupabase,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(async () => {
        await result.current.login({
          email: "test@example.com",
          password: "password123",
        });
      });

      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(mockSetSession).toHaveBeenCalledWith(mockUser, mockSession);
      expect(mockLoadFromSupabase).toHaveBeenCalledWith(mockUser.id);
      expect(result.current.error).toBeNull();
    });

    it("should create profile from metadata when not found in database", async () => {
      mockLogin.mockResolvedValue({
        user: mockUser,
        session: mockSession,
      } as any);

      // Simulate profile doesn't exist
      (mockUseProfileStore as any).getState.mockReturnValue({
        profile: null,
        setProfile: mockSetProfile,
        clearProfile: mockClearProfile,
        loadFromSupabase: mockLoadFromSupabase,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(async () => {
        await result.current.login({
          email: "test@example.com",
          password: "password123",
        });
      });

      expect(mockSetProfile).toHaveBeenCalledWith(
        {
          email: "test@example.com",
          firstName: "John",
          lastName: "Doe",
          gender: Gender.MALE,
          birthYear: 1990,
          height: 180,
          weight: 75,
          restingHeartRate: 60,
        },
        true,
      );
    });

    it("should handle login error", async () => {
      const loginError = new Error("Invalid credentials");
      (loginError as any).code = AUTH_ERROR_CODES.INVALID_CREDENTIALS;
      mockLogin.mockRejectedValue(loginError);

      const { result } = renderHook(() => useAuth());

      await expect(
        result.current.login({
          email: "wrong@example.com",
          password: "wrongpassword",
        }),
      ).rejects.toThrow("Invalid credentials");

      await waitFor(() => {
        expect(result.current.error).toBe("Invalid credentials");
      });
      expect(mockSetSession).not.toHaveBeenCalled();
    });

    it("should handle email not confirmed error", async () => {
      const emailError = new Error("Email not confirmed");
      (emailError as any).code = AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED;
      mockLogin.mockRejectedValue(emailError);

      const { result } = renderHook(() => useAuth());

      await expect(
        result.current.login({
          email: "unconfirmed@example.com",
          password: "password123",
        }),
      ).rejects.toThrow("Email not confirmed");

      await waitFor(() => {
        expect(result.current.error).toBe("Email not confirmed");
      });
    });

    it("should handle missing user or session", async () => {
      mockLogin.mockResolvedValue({
        user: null,
        session: null,
      } as any);

      const { result } = renderHook(() => useAuth());

      await expect(
        result.current.login({
          email: "test@example.com",
          password: "password123",
        }),
      ).rejects.toThrow("Login failed - no user or session returned");
    });

    it("should handle profile load error and still create from metadata", async () => {
      mockLogin.mockResolvedValue({
        user: mockUser,
        session: mockSession,
      } as any);

      // Simulate database error during profile load
      mockLoadFromSupabase.mockRejectedValue(new Error("Database error"));

      // But profile state is still null
      (mockUseProfileStore as any).getState.mockReturnValue({
        profile: null,
        setProfile: mockSetProfile,
        clearProfile: mockClearProfile,
        loadFromSupabase: mockLoadFromSupabase,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(async () => {
        await result.current.login({
          email: "test@example.com",
          password: "password123",
        });
      });

      // Should still create profile from metadata
      expect(mockSetProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test@example.com",
          gender: Gender.MALE,
          birthYear: 1990,
        }),
        true,
      );
    });
  });

  describe("register", () => {
    const registerData = {
      email: "newuser@example.com",
      password: "password123",
      confirmPassword: "password123",
      gender: Gender.MALE,
      birthYear: 1995,
      height: 175,
      weight: 70,
      firstName: "New",
      lastName: "User",
      restingHeartRate: 65,
    };

    it("should register successfully when no email confirmation required", async () => {
      mockRegister.mockResolvedValue({
        user: { ...mockUser, email: "newuser@example.com" },
        session: mockSession,
      } as any);

      const { result } = renderHook(() => useAuth());

      await waitFor(async () => {
        await result.current.register(registerData);
      });

      expect(mockRegister).toHaveBeenCalledWith(registerData);
      expect(mockSetSession).toHaveBeenCalled();
      expect(mockSetProfile).toHaveBeenCalled();
    });

    it("should throw confirmation required error when session is null", async () => {
      mockRegister.mockResolvedValue({
        user: mockUser,
        session: null,
      } as any);

      const { result } = renderHook(() => useAuth());

      await expect(result.current.register(registerData)).rejects.toThrow(
        "Please check your email",
      );

      // Should not create profile or set session
      expect(mockSetSession).not.toHaveBeenCalled();
      expect(mockSetProfile).not.toHaveBeenCalled();
    });

    it("should handle registration error", async () => {
      const regError = new Error("Email already registered");
      (regError as any).code = AUTH_ERROR_CODES.USER_ALREADY_REGISTERED;
      mockRegister.mockRejectedValue(regError);

      const { result } = renderHook(() => useAuth());

      await expect(result.current.register(registerData)).rejects.toThrow(
        "Email already registered",
      );

      await waitFor(() => {
        expect(result.current.error).toBe("Email already registered");
      });
    });

    it("should handle weak password error", async () => {
      const weakPasswordError = new Error("Password is too weak");
      (weakPasswordError as any).code = AUTH_ERROR_CODES.WEAK_PASSWORD;
      mockRegister.mockRejectedValue(weakPasswordError);

      const { result } = renderHook(() => useAuth());

      await expect(result.current.register(registerData)).rejects.toThrow(
        "Password is too weak",
      );
    });

    it("should handle missing user in registration response", async () => {
      mockRegister.mockResolvedValue({
        user: null,
        session: null,
      } as any);

      const { result } = renderHook(() => useAuth());

      await expect(result.current.register(registerData)).rejects.toThrow(
        "Registration failed - no user returned",
      );
    });
  });

  describe("logout", () => {
    it("should logout successfully", async () => {
      mockLogout.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth());

      await waitFor(async () => {
        await result.current.logout();
      });

      expect(mockLogout).toHaveBeenCalled();
      expect(mockClearSession).toHaveBeenCalled();
      expect(mockClearProfile).toHaveBeenCalled();
    });

    it("should handle logout error", async () => {
      const logoutError = new Error("Logout failed");
      mockLogout.mockRejectedValue(logoutError);

      const { result } = renderHook(() => useAuth());

      await expect(result.current.logout()).rejects.toThrow("Logout failed");

      await waitFor(() => {
        expect(result.current.error).toBe("Logout failed");
      });
    });

    it("should attempt to clear local state after successful logout", async () => {
      mockLogout.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth());

      await result.current.logout();

      // Should clear local state after successful logout
      expect(mockClearSession).toHaveBeenCalled();
      expect(mockClearProfile).toHaveBeenCalled();
    });
  });

  describe("initialize", () => {
    it("should initialize with existing session", async () => {
      const mockInitialize = jest.fn().mockResolvedValue(undefined);

      mockUseAuthStore.mockReturnValue({
        user: mockUser,
        session: mockSession,
        isAuthenticated: true,
        isLoading: false,
        setSession: mockSetSession,
        clearSession: mockClearSession,
        initialize: mockInitialize,
      } as any);

      // Simulate existing profile
      (mockUseProfileStore as any).getState.mockReturnValue({
        profile: {
          email: "test@example.com",
          gender: Gender.MALE,
          birthYear: 1990,
          height: 180,
          weight: 75,
        },
        setProfile: mockSetProfile,
        clearProfile: mockClearProfile,
        loadFromSupabase: mockLoadFromSupabase,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(async () => {
        await result.current.initialize();
      });

      expect(mockInitialize).toHaveBeenCalled();
      expect(mockLoadFromSupabase).toHaveBeenCalledWith(mockUser.id);
    });

    it("should initialize without session", async () => {
      const mockInitialize = jest.fn().mockResolvedValue(undefined);

      mockUseAuthStore.mockReturnValue({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        setSession: mockSetSession,
        clearSession: mockClearSession,
        initialize: mockInitialize,
      } as any);

      const { result } = renderHook(() => useAuth());

      await waitFor(async () => {
        await result.current.initialize();
      });

      expect(mockInitialize).toHaveBeenCalled();
      expect(mockLoadFromSupabase).not.toHaveBeenCalled();
    });

    it("should handle initialization error", async () => {
      // Mock authStore.initialize to throw
      const mockInitialize = jest
        .fn()
        .mockRejectedValue(new Error("Failed to get session"));

      mockUseAuthStore.mockReturnValue({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        setSession: mockSetSession,
        clearSession: mockClearSession,
        initialize: mockInitialize,
      } as any);

      const { result } = renderHook(() => useAuth());

      await result.current.initialize();

      await waitFor(() => {
        expect(result.current.error).toBe("Failed to get session");
      });
    });
  });

  describe("isLoading state", () => {
    it("should set loading to true during login", async () => {
      mockLogin.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ user: mockUser, session: mockSession } as any),
              100,
            ),
          ),
      );

      const { result } = renderHook(() => useAuth());

      const loginPromise = result.current.login({
        email: "test@example.com",
        password: "password123",
      });

      // Should be loading
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      await loginPromise;

      // Should be done loading
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("should set loading to false after error", async () => {
      mockLogin.mockRejectedValue(new Error("Login failed"));

      const { result } = renderHook(() => useAuth());

      try {
        await result.current.login({
          email: "test@example.com",
          password: "wrongpassword",
        });
      } catch (error) {
        // Expected to throw
      }

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe("error handling", () => {
    it("should clear error when starting new login", async () => {
      // First login fails
      mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));

      const { result } = renderHook(() => useAuth());

      try {
        await result.current.login({
          email: "test@example.com",
          password: "wrongpassword",
        });
      } catch (error) {
        // Expected
      }

      await waitFor(() => {
        expect(result.current.error).toBe("Invalid credentials");
      });

      // Second login succeeds
      mockLogin.mockResolvedValueOnce({
        user: mockUser,
        session: mockSession,
      } as any);

      (mockUseProfileStore as any).getState.mockReturnValue({
        profile: { email: "test@example.com" },
        setProfile: mockSetProfile,
        clearProfile: mockClearProfile,
        loadFromSupabase: mockLoadFromSupabase,
      });

      await waitFor(async () => {
        await result.current.login({
          email: "test@example.com",
          password: "correctpassword",
        });
      });

      // Error should be cleared
      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe("profile creation from metadata", () => {
    it("should map all metadata fields correctly", async () => {
      const userWithMetadata = {
        id: "user-456",
        email: "complete@example.com",
        user_metadata: {
          gender: "female",
          birth_year: 1985,
          height: 165,
          weight: 60,
          first_name: "Jane",
          last_name: "Smith",
          resting_heart_rate: 55,
        },
      };

      mockLogin.mockResolvedValue({
        user: userWithMetadata,
        session: mockSession,
      } as any);

      (mockUseProfileStore as any).getState.mockReturnValue({
        profile: null,
        setProfile: mockSetProfile,
        clearProfile: mockClearProfile,
        loadFromSupabase: mockLoadFromSupabase,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(async () => {
        await result.current.login({
          email: "complete@example.com",
          password: "password123",
        });
      });

      expect(mockSetProfile).toHaveBeenCalledWith(
        {
          email: "complete@example.com",
          firstName: "Jane",
          lastName: "Smith",
          gender: Gender.FEMALE,
          birthYear: 1985,
          height: 165,
          weight: 60,
          restingHeartRate: 55,
        },
        true,
      );
    });

    it("should handle missing optional metadata fields", async () => {
      const userWithMinimalMetadata = {
        id: "user-789",
        email: "minimal@example.com",
        user_metadata: {
          gender: "other",
          birth_year: 2000,
          height: 170,
          weight: 65,
          // No first_name, last_name, or resting_heart_rate
        },
      };

      mockLogin.mockResolvedValue({
        user: userWithMinimalMetadata,
        session: mockSession,
      } as any);

      (mockUseProfileStore as any).getState.mockReturnValue({
        profile: null,
        setProfile: mockSetProfile,
        clearProfile: mockClearProfile,
        loadFromSupabase: mockLoadFromSupabase,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(async () => {
        await result.current.login({
          email: "minimal@example.com",
          password: "password123",
        });
      });

      expect(mockSetProfile).toHaveBeenCalledWith(
        {
          email: "minimal@example.com",
          firstName: undefined,
          lastName: undefined,
          gender: Gender.OTHER,
          birthYear: 2000,
          height: 170,
          weight: 65,
          restingHeartRate: undefined,
        },
        true,
      );
    });

    it("should not create profile if metadata is incomplete", async () => {
      const userWithIncompleteMetadata = {
        id: "user-incomplete",
        email: "incomplete@example.com",
        user_metadata: {
          first_name: "John",
          // Missing required fields: gender, birth_year, height, weight
        },
      };

      mockLogin.mockResolvedValue({
        user: userWithIncompleteMetadata,
        session: mockSession,
      } as any);

      (mockUseProfileStore as any).getState.mockReturnValue({
        profile: null,
        setProfile: mockSetProfile,
        clearProfile: mockClearProfile,
        loadFromSupabase: mockLoadFromSupabase,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(async () => {
        await result.current.login({
          email: "incomplete@example.com",
          password: "password123",
        });
      });

      // Should not call setProfile because metadata is incomplete
      expect(mockSetProfile).not.toHaveBeenCalled();
    });
  });
});
