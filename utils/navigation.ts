import { ROUTE_SEGMENTS, ROUTES } from "@/constants/routes";

/**
 * Public routes that don't require authentication.
 * Users can access these routes regardless of authentication status.
 */
const PUBLIC_ROUTES: string[] = [
  ROUTE_SEGMENTS.LOGIN,
  ROUTE_SEGMENTS.REGISTER,
  ROUTE_SEGMENTS.CONFIRM_EMAIL,
  ROUTE_SEGMENTS.AUTH_CALLBACK,
  ROUTE_SEGMENTS.SETTINGS,
  ROUTE_SEGMENTS.ABOUT,
  ROUTE_SEGMENTS.MANAGE_LOGS,
];

/**
 * Authentication flow routes.
 * Authenticated users should be redirected away from these.
 */
const AUTH_FLOW_ROUTES: string[] = [
  ROUTE_SEGMENTS.LOGIN,
  ROUTE_SEGMENTS.REGISTER,
  ROUTE_SEGMENTS.CONFIRM_EMAIL,
  ROUTE_SEGMENTS.AUTH_CALLBACK,
];

/**
 * Determines if a redirect is needed based on authentication state and current route.
 *
 * Navigation Guard Logic:
 * - Unauthenticated users trying to access protected routes → redirect to login
 * - Authenticated users in auth flow (login/register) → redirect to home
 * - Otherwise → no redirect needed (null)
 *
 * @param currentSegment - The current route segment (first segment of URL path)
 * @param isAuthenticated - Whether the user is authenticated
 * @returns The route to redirect to, or null if no redirect is needed
 *
 * @example
 * ```typescript
 * // Unauthenticated user trying to access profile
 * getAuthRedirect("profile", false); // Returns "/login"
 *
 * // Authenticated user on login page
 * getAuthRedirect("login", true); // Returns "/"
 *
 * // Authenticated user on home page
 * getAuthRedirect("index", true); // Returns null (no redirect)
 *
 * // Unauthenticated user on settings page
 * getAuthRedirect("settings", false); // Returns null (public route)
 * ```
 */
export const getAuthRedirect = (
  currentSegment: string | undefined,
  isAuthenticated: boolean,
): string | null => {
  // No segment or empty string means we're on protected content
  if (!currentSegment) {
    // Unauthenticated users on root should go to login
    if (!isAuthenticated) {
      return ROUTES.LOGIN;
    }
    // Authenticated users can stay on root
    return null;
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(currentSegment);
  const isAuthRoute = AUTH_FLOW_ROUTES.includes(currentSegment);

  // Unauthenticated user trying to access protected route
  if (!isAuthenticated && !isPublicRoute) {
    return ROUTES.LOGIN;
  }

  // Authenticated user in auth flow (login/register)
  if (isAuthenticated && isAuthRoute) {
    return ROUTES.HOME;
  }

  // No redirect needed
  return null;
};
