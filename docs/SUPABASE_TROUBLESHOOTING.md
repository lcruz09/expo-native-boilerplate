# Supabase Troubleshooting Guide

This document provides solutions to common Supabase-related issues in the Wattr app.

## Issue 1: SecureStore Warning - Value Larger Than 2048 Bytes

### Symptoms

```
WARN Value being stored in SecureStore is larger than 2048 bytes and it may not be stored successfully.
```

### Cause

Supabase auth sessions contain JWT tokens and user metadata that can exceed the 2048-byte limit of iOS/Android secure storage.

### Solution ✅

**Implemented automatic chunking** in `services/supabase/client.ts`.

The `SecureStoreAdapter` now automatically:

- Detects values larger than 2000 bytes (leaving buffer for safety)
- Splits them into smaller chunks
- Stores each chunk separately
- Reconstructs the value when reading
- Cleans up all chunks when removing

**No action required** - this is handled automatically!

### How It Works

```typescript
// Large session (e.g., 4500 bytes) is stored as:
// - Key: "supabase.auth.token" → "__chunked__3"
// - Key: "supabase.auth.token_chunk_0" → [2000 bytes]
// - Key: "supabase.auth.token_chunk_1" → [2000 bytes]
// - Key: "supabase.auth.token_chunk_2" → [500 bytes]
```

---

## Issue 2: Schema Configuration Error (PGRST106)

### Symptoms

```
ERROR The schema must be one of the following: api
ERROR PGRST106: The schema must be one of the following: api
```

### Cause

Your Supabase project's PostgREST API is configured to expose specific schemas (e.g., `api`), but the client is trying to access the `public` schema.

### Solution 1: Update Supabase Project Settings (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Scroll down to **PostgREST Configuration**
4. Find **Exposed schemas** setting
5. Add `public` to the list of exposed schemas
6. Save changes
7. Restart your Supabase project (if needed)

### Solution 2: Update Client Configuration

If your project intentionally uses a custom schema (e.g., `api`), update the client:

**File: `services/supabase/client.ts`**

```typescript
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: SecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'api', // ← Change from "public" to match your schema
  },
});
```

### Verification

After making changes, test by:

1. Registering a new user
2. Checking if the profile is created in Supabase
3. Verifying no `PGRST106` errors in console

---

## Issue 3: Profile Service Logging Errors

### Symptoms

```
ERROR [ProfileService] Error fetching profile: ...
ERROR [ProfileService] Error creating profile: ...
```

### Cause

The profile service was logging errors before throwing them, causing duplicate logs and violating the service layer architecture pattern.

### Solution ✅

**Fixed** - All error logging removed from `services/supabase/profiles.ts`.

The service layer now:

- ✅ Logs **only** successful operations (`logger.info`)
- ✅ Throws errors without logging
- ✅ Returns `null` silently for "not found" cases
- ✅ Lets the caller (hooks) decide how to log

---

## Issue 4: Profile Created But Then Redirected Home

### Symptoms

- User logs in successfully
- Profile shows briefly
- App redirects to home screen

### Possible Causes & Solutions

#### A. Profile Not Persisting Due to Schema Error

- **Check**: Look for `PGRST106` errors in console
- **Fix**: See "Issue 2" above

#### B. Navigation State Issue

- **Check**: Look for navigation-related errors in console
- **Debug**: Check `app/_layout.tsx` for routing logic

#### C. Session Not Persisting

- **Check**: Look for SecureStore errors
- **Fix**: Ensure chunking is working (see "Issue 1")

### Debugging Steps

1. **Check Console Logs**:

   ```
   INFO  [AuthService] Login successful for: user@example.com
   INFO  [ProfileStore] Loading profile from Supabase
   INFO  [ProfileService] Fetching profile for user: <uuid>
   ```

2. **Verify Profile in Supabase**:
   - Go to Supabase dashboard
   - **Table Editor** → **profiles**
   - Check if the user's profile exists

3. **Check Auth State**:

   ```
   INFO  [AuthStore] Auth state changed: SIGNED_IN
   INFO  [AuthStore] Setting session: user@example.com
   ```

4. **Enable Detailed Logging**:
   Add to `app/_layout.tsx`:
   ```typescript
   useEffect(() => {
     console.log('Current segments:', segments);
     console.log('Is authenticated:', isAuthenticated);
     console.log('Has completed onboarding:', hasCompletedOnboarding);
   }, [segments, isAuthenticated, hasCompletedOnboarding]);
   ```

---

## General Debugging Tips

### 1. Clear App Data

```bash
# iOS
npx expo run:ios --clear

# Android
npx expo run:android --clear
```

### 2. Clear SecureStore

Add this to your app temporarily:

```typescript
import * as SecureStore from 'expo-secure-store';

// Clear all auth data
await SecureStore.deleteItemAsync('supabase.auth.token');
```

### 3. Check Supabase Project Health

1. Go to **Project Settings** → **General**
2. Check **Status** - should be green
3. Check **Database** - should be "Healthy"

### 4. Verify API Keys

```typescript
// Add to app startup
console.log('Supabase URL:', config.supabase.url);
console.log('Key configured:', Boolean(config.supabase.publishableKey));
```

### 5. Test with Supabase Dashboard

1. Go to **SQL Editor**
2. Run: `SELECT * FROM profiles WHERE id = 'your-user-uuid';`
3. Verify data exists and matches expectations

---

## Related Documentation

- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Authentication Implementation](./AUTH_IMPLEMENTATION.md)
- [Project Context](./PROJECT_CONTEXT.md)

---

## Need More Help?

If you're still experiencing issues:

1. **Check Supabase Status**: https://status.supabase.com
2. **Review Supabase Docs**: https://supabase.com/docs
3. **Check App Logs**: Enable verbose logging in `utils/logger.ts`
4. **Verify Network**: Ensure you can reach your Supabase URL
