import { getAuthService } from '@/services/api/factory';
import { createLogger } from '@/utils/logger';
import { useQueryClient } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';

const AUTH_QUERY_KEY = ['auth', 'session'];
const AUTH_CALLBACK_SEGMENT = 'auth-callback';

const logger = createLogger('DeepLinking');

/**
 * Listens for incoming deep links and handles auth callback URLs.
 *
 * Covers two cases:
 * 1. App already open — `Linking.addEventListener` fires for new URLs.
 * 2. App launched from a link — `Linking.getInitialURL` returns the URL.
 *
 * When an `auth-callback` URL is detected (e.g. from email confirmation),
 * it calls `handleEmailConfirmation` and invalidates the auth session query
 * so the UI reflects the newly authenticated state.
 *
 * @example
 * ```tsx
 * function RootNavigator() {
 *   useDeepLinking();
 *   // ...
 * }
 * ```
 */
export const useDeepLinking = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const authService = getAuthService();

    const handleUrl = async (url: string) => {
      if (!url.includes(AUTH_CALLBACK_SEGMENT)) return;

      try {
        logger.info('Handling auth callback deep link');
        await authService.handleEmailConfirmation(url);
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      } catch (error) {
        logger.error('Failed to handle deep link:', error);
      }
    };

    // Case 1: app is already open when the link is tapped
    const subscription = Linking.addEventListener('url', ({ url }) => handleUrl(url));

    // Case 2: app was closed and launched directly from the link
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    return () => subscription.remove();
  }, [queryClient]);
};
