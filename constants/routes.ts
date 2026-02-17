/**
 * Application route constants.
 *
 * Centralized route definitions to avoid hardcoding route strings throughout the codebase.
 * Use these constants for navigation, route matching, and href attributes.
 *
 * @example
 * ```typescript
 * import { ROUTES } from "@/constants/routes";
 *
 * router.push(ROUTES.LOGIN);
 * ```
 */
export const ROUTES = {
  // Root
  HOME: "/",

  // Authentication
  LOGIN: "/login",
  REGISTER: "/register",
  CONFIRM_EMAIL: "/confirm-email",
  AUTH_CALLBACK: "/auth-callback",

  // User
  PROFILE: "/profile",
  SETTINGS: "/settings",
  ABOUT: "/about",
} as const;

/**
 * Route segment names for path matching.
 *
 * Use these constants when checking route segments (e.g., `segments[0] === ROUTE_SEGMENTS.LOGIN`).
 */
export const ROUTE_SEGMENTS = {
  LOGIN: "login",
  REGISTER: "register",
  CONFIRM_EMAIL: "confirm-email",
  AUTH_CALLBACK: "auth-callback",
  PROFILE: "profile",
  SETTINGS: "settings",
  ABOUT: "about",
} as const;

/**
 * Type for route paths.
 */
export type Route = (typeof ROUTES)[keyof typeof ROUTES];

/**
 * Type for route segment names.
 */
export type RouteSegment = (typeof ROUTE_SEGMENTS)[keyof typeof ROUTE_SEGMENTS];

export const TAB_BAR_DISPLAY_ROUTE_SEGMENTS: (string | undefined)[] = [
  ROUTE_SEGMENTS.SETTINGS,
  ROUTE_SEGMENTS.PROFILE,
  // Index page
  undefined,
];
