# Email Confirmation Deeplink Implementation

## Overview

This document describes the implementation of email confirmation via deeplinks for Supabase authentication in the Wattr app.

The implementation uses a dedicated `/auth-callback` page that provides a smooth user experience with a loading indicator while processing the email confirmation.

## Implementation Details

### 1. Environment Configuration

The auth callback URL is configurable via environment variables to support different environments (development, staging, production):

**`.env` file:**

```bash
EXPO_PUBLIC_AUTH_CALLBACK_URL=wattr-app://auth-callback
```

For different environments, you can use different URL schemes:

- Development: `wattr-app://auth-callback`
- Staging: `wattr-staging://auth-callback`
- Production: `wattr-app://auth-callback`

The configuration is loaded in `config/index.ts`:

```typescript
readonly supabase = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || "",
  publishableKey: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
  authCallbackUrl: process.env.EXPO_PUBLIC_AUTH_CALLBACK_URL || "wattr-app://auth-callback",
};
```

### 2. URL Scheme Configuration

The app uses the URL scheme `wattr-app://` configured in `app.config.js`:

```javascript
scheme: "wattr-app";
```

### 3. Email Redirect URL

When users register, Supabase sends a confirmation email with a link that redirects to:

```
wattr-app://auth-callback#access_token=...&refresh_token=...&expires_at=...&type=signup
```

Note: Supabase uses URL fragments (hash `#`) instead of query parameters (`?`) to pass the tokens.

This is configured in `services/supabase/auth.ts` in the `register` and `resendConfirmationEmail` functions:

```typescript
emailRedirectTo: config.supabase.authCallbackUrl;
```

### 4. Auth Callback Page (`app/auth-callback.tsx`)

A dedicated page that handles the email confirmation process with a better UX:

**Features:**

- Shows loading indicator while processing
- Extracts tokens from URL parameters
- Calls `handleEmailConfirmation` to set session
- Updates auth store with authenticated session
- Shows success/error alerts
- Redirects to home on success or login on error

**Why a dedicated page?**

- Better user experience with visual feedback
- Clean separation of concerns
- Easier to maintain and test
- Professional loading state instead of instant redirect

### 5. Deeplink Handler (`services/supabase/auth.ts`)

Added `handleEmailConfirmation` function that:

- Parses the deeplink URL to extract tokens from the hash fragment
- Extracts `access_token` and `refresh_token` from the URL
- Sets the session directly using `supabase.auth.setSession()`
- Returns the authenticated session

```typescript
export const handleEmailConfirmation = async (url: string)
```

**Important:** Supabase includes the actual session tokens in the URL fragment (after `#`), not as query parameters. The function parses the hash fragment to extract `access_token` and `refresh_token`, then uses `setSession()` to establish the authenticated session.

### 6. Navigation Configuration (`app/_layout.tsx`)

Added the `auth-callback` screen to the navigation stack:

```typescript
<Stack.Screen
  name="auth-callback"
  options={{
    title: t("auth.verifyingEmail"),
    headerShown: false,
    headerBackVisible: false,
    gestureEnabled: false,
  }}
/>
```

**Note:** The deeplink handling is now done by the `/auth-callback` page itself, rather than in the root layout. This provides better UX with a dedicated loading screen.

## User Flow

1. **User registers** → Account created, confirmation email sent
2. **User clicks link in email** → App opens via deeplink to `/auth-callback`
3. **Loading screen shown** → User sees "Verifying Email..." message
4. **App processes tokens** → Tokens extracted and session set
5. **Session stored** → User authenticated in app
6. **Success alert shown** → User sees confirmation message
7. **Redirect to home** → User navigated to main app screen

## Error Handling

The implementation handles several error scenarios:

- Invalid or missing token in URL
- Wrong confirmation type (non-signup)
- Supabase verification failures
- Network errors

All errors are logged and shown to the user via Alert dialogs.

## Translation Keys Added

Added to all locale files (`i18n/locales/*.ts`):

- `auth.emailConfirmed` - Title for successful confirmation
- `auth.emailConfirmedMessage` - Success message body
- `auth.emailConfirmationFailed` - Error message for failed confirmation
- `auth.verifyingEmail` - Loading screen title
- `auth.pleaseWait` - Loading screen message

## Platform-Specific Configuration

The app supports both custom URL schemes and universal links:

### Custom URL Scheme

- **iOS & Android**: `wattr-app://auth-callback`
- Works everywhere, no domain setup required
- Always prompts user to open app

### Universal Links (Recommended for Production)

- **iOS & Android**: `https://wattr.fit/auth-callback`
- Better user experience (no prompts on iOS)
- Requires domain verification
- Falls back to web if app not installed

### Configuration

**iOS:**

```javascript
associatedDomains: ["applinks:wattr.fit"];
```

**Android:**

```javascript
intentFilters: [
  {
    action: "VIEW",
    autoVerify: true,
    category: ["BROWSABLE", "DEFAULT"],
    data: [
      {
        scheme: "https",
        host: "wattr.fit",
        pathPrefix: "/auth-callback",
      },
    ],
  },
];
```

See [UNIVERSAL_LINKS_SETUP.md](./UNIVERSAL_LINKS_SETUP.md) for complete domain verification setup.

## Testing

To test the email confirmation flow:

1. **Register a new account** in the app
2. **Check your email** for the confirmation link
3. **Tap the link** on a device with the app installed
4. **App opens** to `/auth-callback` with loading indicator
5. **Verification completes** and success alert is shown
6. **Tap OK** to be redirected to the home screen
7. **User is logged in** and can use the app

### Testing Different Environments

To test with different environments:

1. Update your `.env` file with the appropriate callback URL:

   ```bash
   # For staging
   EXPO_PUBLIC_AUTH_CALLBACK_URL=wattr-staging://auth-callback
   ```

2. Update `app.config.js` with the corresponding scheme:

   ```javascript
   scheme: "wattr-staging";
   ```

3. Rebuild the app to apply the changes
4. Register and test the flow

## Dependencies

- `expo-linking` - For deeplink handling
- `@supabase/supabase-js` - For email verification

## Security Notes

- Token is only valid for a single use
- Token has expiration time set by Supabase
- Session is stored securely using expo-secure-store
- Auth state is managed through Zustand store with MMKV persistence

## Future Enhancements

- Add support for password reset deeplinks
- Add support for magic link authentication
- Implement universal links for better iOS experience
- Add deep linking for specific app sections
