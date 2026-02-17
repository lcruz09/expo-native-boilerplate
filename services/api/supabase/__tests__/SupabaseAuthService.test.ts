/**
 * Tests for SupabaseAuthService
 *
 * Tests the Supabase implementation of IAuthService including:
 * - Login with email/password
 * - Registration
 * - Logout
 * - Session management
 * - Email confirmation handling
 * - Auth state change listeners
 */

import { SupabaseAuthService } from "../SupabaseAuthService";
import { supabase } from "../client";
import { config } from "@/config";
import { AuthError } from "@/types/auth";

// Mock the Supabase client
jest.mock("../client", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      refreshSession: jest.fn(),
      getUser: jest.fn(),
      resend: jest.fn(),
      setSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}));

// Mock the config
jest.mock("@/config", () => ({
  config: {
    supabase: {
      authCallbackUrl: "wattr-app://auth-callback",
    },
  },
}));

describe("SupabaseAuthService", () => {
  let service: SupabaseAuthService;

  beforeEach(() => {
    service = new SupabaseAuthService();
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      const mockUser = { id: "user-123", email: "test@example.com" };
      const mockSession = { access_token: "token", refresh_token: "refresh" };

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const result = await service.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should throw AuthError when login fails", async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: {
          message: "Invalid credentials",
          code: "invalid_credentials",
          status: 400,
        },
      });

      await expect(
        service.login({ email: "test@example.com", password: "wrong" }),
      ).rejects.toMatchObject({
        message: "Invalid credentials",
        code: "invalid_credentials",
      });
    });

    it("should throw error when no session is returned", async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: { id: "user-123" }, session: null },
        error: null,
      });

      await expect(
        service.login({ email: "test@example.com", password: "password" }),
      ).rejects.toMatchObject({
        message: "Login failed - no session returned",
      });
    });
  });

  describe("register", () => {
    it("should register successfully with valid data", async () => {
      const mockUser = { id: "user-123", email: "new@example.com" };
      const mockSession = { access_token: "token", refresh_token: "refresh" };

      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const result = await service.register({
        email: "new@example.com",
        password: "password123",
        gender: "male",
        birthYear: 1990,
        height: 180,
        weight: 75,
        firstName: "John",
        lastName: "Doe",
        restingHeartRate: 60,
      });

      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "new@example.com",
        password: "password123",
        options: {
          data: {
            first_name: "John",
            last_name: "Doe",
            gender: "male",
            birth_year: 1990,
            height: 180,
            weight: 75,
            resting_heart_rate: 60,
          },
          emailRedirectTo: config.supabase.authCallbackUrl,
        },
      });
    });

    it("should throw AuthError when registration fails", async () => {
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: {
          message: "Email already exists",
          code: "email_exists",
          status: 400,
        },
      });

      await expect(
        service.register({
          email: "existing@example.com",
          password: "password",
          gender: "male",
          birthYear: 1990,
          height: 180,
          weight: 75,
        }),
      ).rejects.toMatchObject({
        message: "Email already exists",
        code: "email_exists",
      });
    });
  });

  describe("logout", () => {
    it("should logout successfully", async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      await service.logout();

      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it("should throw AuthError when logout fails", async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: { message: "Logout failed", code: "logout_error", status: 400 },
      });

      await expect(service.logout()).rejects.toMatchObject({
        message: "Logout failed",
        code: "logout_error",
      });
    });
  });

  describe("getCurrentSession", () => {
    it("should return current session", async () => {
      const mockSession = { access_token: "token", refresh_token: "refresh" };

      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const result = await service.getCurrentSession();

      expect(result).toEqual(mockSession);
    });

    it("should return null when session fetch fails", async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: { message: "No session" },
      });

      const result = await service.getCurrentSession();

      expect(result).toBeNull();
    });
  });

  describe("refreshSession", () => {
    it("should refresh session successfully", async () => {
      const mockSession = {
        access_token: "new_token",
        refresh_token: "new_refresh",
      };

      (supabase.auth.refreshSession as jest.Mock).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const result = await service.refreshSession();

      expect(result).toEqual(mockSession);
    });

    it("should return null when refresh fails", async () => {
      (supabase.auth.refreshSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: { message: "Refresh failed" },
      });

      const result = await service.refreshSession();

      expect(result).toBeNull();
    });
  });

  describe("getCurrentUser", () => {
    it("should return current user", async () => {
      const mockUser = { id: "user-123", email: "test@example.com" };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await service.getCurrentUser();

      expect(result).toEqual(mockUser);
    });

    it("should return null when user fetch fails", async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: "No user" },
      });

      const result = await service.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe("resendConfirmationEmail", () => {
    it("should resend confirmation email successfully", async () => {
      (supabase.auth.resend as jest.Mock).mockResolvedValue({
        error: null,
      });

      await service.resendConfirmationEmail("test@example.com");

      expect(supabase.auth.resend).toHaveBeenCalledWith({
        type: "signup",
        email: "test@example.com",
        options: {
          emailRedirectTo: config.supabase.authCallbackUrl,
        },
      });
    });

    it("should throw AuthError when resend fails", async () => {
      (supabase.auth.resend as jest.Mock).mockResolvedValue({
        error: { message: "Resend failed", code: "resend_error", status: 400 },
      });

      await expect(
        service.resendConfirmationEmail("test@example.com"),
      ).rejects.toMatchObject({
        message: "Resend failed",
        code: "resend_error",
      });
    });
  });

  describe("handleEmailConfirmation", () => {
    it("should handle email confirmation successfully", async () => {
      const mockUrl =
        "wattr-app://auth-callback#access_token=token123&refresh_token=refresh123";
      const mockUser = { id: "user-123", email: "test@example.com" };
      const mockSession = {
        access_token: "token123",
        refresh_token: "refresh123",
      };

      (supabase.auth.setSession as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const result = await service.handleEmailConfirmation(mockUrl);

      expect(result).toEqual({ user: mockUser, session: mockSession });
      expect(supabase.auth.setSession).toHaveBeenCalledWith({
        access_token: "token123",
        refresh_token: "refresh123",
      });
    });

    it("should return null when tokens are missing", async () => {
      const mockUrl = "wattr-app://auth-callback#type=signup";

      const result = await service.handleEmailConfirmation(mockUrl);

      expect(result).toBeNull();
      expect(supabase.auth.setSession).not.toHaveBeenCalled();
    });

    it("should return null when no session is returned", async () => {
      const mockUrl =
        "wattr-app://auth-callback#access_token=token123&refresh_token=refresh123";

      (supabase.auth.setSession as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      });

      const result = await service.handleEmailConfirmation(mockUrl);

      expect(result).toBeNull();
    });
  });

  describe("onAuthStateChange", () => {
    it("should register auth state change listener", () => {
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();

      (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
        data: {
          subscription: {
            unsubscribe: mockUnsubscribe,
          },
        },
      });

      const unsubscribe = service.onAuthStateChange(mockCallback);

      expect(supabase.auth.onAuthStateChange).toHaveBeenCalledWith(
        mockCallback,
      );
      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });
});
