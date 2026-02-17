import { ROUTE_SEGMENTS, ROUTES } from "@/constants/routes";
import { getAuthRedirect } from "../navigation";

describe("getAuthRedirect", () => {
  describe("unauthenticated users", () => {
    const isAuthenticated = false;

    it("should redirect to login when accessing protected routes", () => {
      expect(getAuthRedirect("index", isAuthenticated)).toBe(ROUTES.LOGIN);
      expect(getAuthRedirect("profile", isAuthenticated)).toBe(ROUTES.LOGIN);
      expect(getAuthRedirect("start-workout", isAuthenticated)).toBe(
        ROUTES.LOGIN,
      );
      expect(getAuthRedirect("workout-in-progress", isAuthenticated)).toBe(
        ROUTES.LOGIN,
      );
      expect(getAuthRedirect("workout-details", isAuthenticated)).toBe(
        ROUTES.LOGIN,
      );
      expect(getAuthRedirect("fitness-machine-details", isAuthenticated)).toBe(
        ROUTES.LOGIN,
      );
    });

    it("should allow access to public routes without redirect", () => {
      expect(getAuthRedirect(ROUTE_SEGMENTS.SETTINGS, isAuthenticated)).toBe(
        null,
      );
      expect(getAuthRedirect(ROUTE_SEGMENTS.ABOUT, isAuthenticated)).toBe(null);
      expect(getAuthRedirect(ROUTE_SEGMENTS.MANAGE_LOGS, isAuthenticated)).toBe(
        null,
      );
    });

    it("should allow access to auth flow routes without redirect", () => {
      expect(getAuthRedirect(ROUTE_SEGMENTS.LOGIN, isAuthenticated)).toBe(null);
      expect(getAuthRedirect(ROUTE_SEGMENTS.REGISTER, isAuthenticated)).toBe(
        null,
      );
      expect(
        getAuthRedirect(ROUTE_SEGMENTS.CONFIRM_EMAIL, isAuthenticated),
      ).toBe(null);
      expect(
        getAuthRedirect(ROUTE_SEGMENTS.AUTH_CALLBACK, isAuthenticated),
      ).toBe(null);
    });

    it("should redirect unauthenticated users on root to login", () => {
      expect(getAuthRedirect(undefined, isAuthenticated)).toBe(ROUTES.LOGIN);
      expect(getAuthRedirect("", isAuthenticated)).toBe(ROUTES.LOGIN);
    });
  });

  describe("authenticated users", () => {
    const isAuthenticated = true;

    it("should redirect to home when accessing auth flow routes", () => {
      expect(getAuthRedirect(ROUTE_SEGMENTS.LOGIN, isAuthenticated)).toBe(
        ROUTES.HOME,
      );
      expect(getAuthRedirect(ROUTE_SEGMENTS.REGISTER, isAuthenticated)).toBe(
        ROUTES.HOME,
      );
      expect(
        getAuthRedirect(ROUTE_SEGMENTS.CONFIRM_EMAIL, isAuthenticated),
      ).toBe(ROUTES.HOME);
      expect(
        getAuthRedirect(ROUTE_SEGMENTS.AUTH_CALLBACK, isAuthenticated),
      ).toBe(ROUTES.HOME);
    });

    it("should allow access to protected routes without redirect", () => {
      expect(getAuthRedirect("index", isAuthenticated)).toBe(null);
      expect(getAuthRedirect("profile", isAuthenticated)).toBe(null);
      expect(getAuthRedirect("start-workout", isAuthenticated)).toBe(null);
      expect(getAuthRedirect("workout-in-progress", isAuthenticated)).toBe(
        null,
      );
      expect(getAuthRedirect("workout-details", isAuthenticated)).toBe(null);
      expect(getAuthRedirect("fitness-machine-details", isAuthenticated)).toBe(
        null,
      );
    });

    it("should allow access to public routes without redirect", () => {
      expect(getAuthRedirect(ROUTE_SEGMENTS.SETTINGS, isAuthenticated)).toBe(
        null,
      );
      expect(getAuthRedirect(ROUTE_SEGMENTS.ABOUT, isAuthenticated)).toBe(null);
      expect(getAuthRedirect(ROUTE_SEGMENTS.MANAGE_LOGS, isAuthenticated)).toBe(
        null,
      );
    });

    it("should allow authenticated users on root", () => {
      expect(getAuthRedirect(undefined, isAuthenticated)).toBe(null);
      expect(getAuthRedirect("", isAuthenticated)).toBe(null);
    });
  });

  describe("edge cases", () => {
    it("should handle unknown route segments", () => {
      // Unknown routes are treated as protected
      expect(getAuthRedirect("unknown-route", false)).toBe(ROUTES.LOGIN);
      expect(getAuthRedirect("unknown-route", true)).toBe(null);
    });

    it("should handle case-sensitive route segments", () => {
      // Segments are case-sensitive, so uppercase versions are different routes
      expect(getAuthRedirect("LOGIN", false)).toBe(ROUTES.LOGIN);
      expect(getAuthRedirect("SETTINGS", false)).toBe(ROUTES.LOGIN);
    });
  });
});
