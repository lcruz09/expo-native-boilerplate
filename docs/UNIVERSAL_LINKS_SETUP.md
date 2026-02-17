# Universal Links & App Links Setup

This guide explains how to configure both custom URL schemes and universal links for the Wattr app.

## Overview

The app supports **two types of deeplinks**:

1. **Custom URL Scheme**: `wattr-app://auth-callback`
   - Works on iOS and Android
   - Requires app to be installed
   - Always prompts to open the app

2. **Universal Links (iOS) / App Links (Android)**: `https://wattr.fit/auth-callback`
   - Better user experience (no "Open in app?" prompt on iOS)
   - Falls back to web if app not installed
   - More secure (domain verification required)

## Configuration

### App Configuration

Both schemes are configured in `app.config.js`:

```javascript
{
  scheme: "wattr-app",
  ios: {
    associatedDomains: ["applinks:wattr.fit"],
  },
  android: {
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
    ],
  },
}
```

### Environment Variables

Configure which URL to use in Supabase emails:

```bash
# For custom scheme (works everywhere)
EXPO_PUBLIC_AUTH_CALLBACK_URL=wattr-app://auth-callback

# For universal links (better UX, requires domain setup)
EXPO_PUBLIC_AUTH_CALLBACK_URL=https://wattr.fit/auth-callback
```

## Domain Verification Setup

To use universal links with `https://wattr.fit`, you must verify domain ownership.

### iOS - Apple App Site Association (AASA)

**1. Create AASA file:**

Create a file at `https://wattr.fit/.well-known/apple-app-site-association` (no file extension):

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.wattr.app",
        "paths": ["/auth-callback"]
      }
    ]
  }
}
```

**Replace `TEAM_ID` with your Apple Developer Team ID** (found in Apple Developer Portal).

**2. Server requirements:**

- **URL**: `https://wattr.fit/.well-known/apple-app-site-association`
- **Content-Type**: `application/json`
- **HTTPS**: Required (SSL certificate)
- **No redirects**: Must serve file directly
- **File size**: < 128KB

**3. Test the AASA file:**

```bash
# Verify it's accessible
curl https://wattr.fit/.well-known/apple-app-site-association

# Validate with Apple's tool
https://search.developer.apple.com/appsearch-validation-tool/
```

### Android - Digital Asset Links

**1. Create assetlinks.json:**

Create a file at `https://wattr.fit/.well-known/assetlinks.json`:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.wattr.app",
      "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT_HERE"]
    }
  }
]
```

**2. Get your SHA256 fingerprint:**

```bash
# For debug keystore
keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android

# For release keystore (from Google Play Console)
# Go to: Release > Setup > App signing
# Copy the "SHA-256 certificate fingerprint"
```

**3. Server requirements:**

- **URL**: `https://wattr.fit/.well-known/assetlinks.json`
- **Content-Type**: `application/json`
- **HTTPS**: Required (SSL certificate)
- **No redirects**: Must serve file directly

**4. Test the assetlinks.json:**

```bash
# Verify it's accessible
curl https://wattr.fit/.well-known/assetlinks.json

# Validate with Google's tool
https://developers.google.com/digital-asset-links/tools/generator
```

## Server Configuration Examples

### nginx

```nginx
server {
  listen 443 ssl;
  server_name wattr.fit;

  # iOS AASA
  location /.well-known/apple-app-site-association {
    default_type application/json;
    add_header Content-Type application/json;
    alias /var/www/wattr.fit/.well-known/apple-app-site-association;
  }

  # Android Asset Links
  location /.well-known/assetlinks.json {
    default_type application/json;
    add_header Content-Type application/json;
    alias /var/www/wattr.fit/.well-known/assetlinks.json;
  }

  # Auth callback fallback page
  location /auth-callback {
    # Show a web page if app is not installed
    root /var/www/wattr.fit/public;
    try_files /auth-callback.html =404;
  }
}
```

### Vercel/Next.js

Create `public/.well-known/` directory with both files, then add to `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/.well-known/apple-app-site-association',
      headers: [
        { key: 'Content-Type', value: 'application/json' },
      ],
    },
    {
      source: '/.well-known/assetlinks.json',
      headers: [
        { key: 'Content-Type', value: 'application/json' },
      ],
    },
  ];
}
```

## Testing

### Test Custom Scheme

```bash
# iOS Simulator
xcrun simctl openurl booted "wattr-app://auth-callback#access_token=test&type=signup"

# Android Emulator
adb shell am start -a android.intent.action.VIEW -d "wattr-app://auth-callback#access_token=test&type=signup"
```

### Test Universal Links

```bash
# iOS Device (after installing app)
# Tap this link: https://wattr.fit/auth-callback

# Android Device (after installing app)
# Tap this link: https://wattr.fit/auth-callback
```

### Debugging

**iOS:**

- Check in Settings > [Your App] > "Associated Domains"
- View logs: Console app > Filter for "swcd"
- Verify AASA download: Settings > Developer > Universal Links Testing

**Android:**

- Check intent filters: `adb shell dumpsys package com.wattr.app`
- View logs: `adb logcat | grep -i "intent"`
- Test verification: Settings > Apps > [Your App] > Open by default

## Supabase Configuration

In your Supabase project dashboard:

1. Go to **Authentication** > **URL Configuration**
2. Add your redirect URLs:
   - `wattr-app://auth-callback` (custom scheme)
   - `https://wattr.fit/auth-callback` (universal link)
3. Update **Site URL** to `https://wattr.fit`

## Development vs Production

### Development

```bash
# Use custom scheme (easier, no domain setup)
EXPO_PUBLIC_AUTH_CALLBACK_URL=wattr-app://auth-callback
```

### Staging

```bash
# Use staging domain
EXPO_PUBLIC_AUTH_CALLBACK_URL=https://staging.wattr.fit/auth-callback
```

### Production

```bash
# Use production domain with universal links
EXPO_PUBLIC_AUTH_CALLBACK_URL=https://wattr.fit/auth-callback
```

## Troubleshooting

### iOS: Universal Links Not Working

1. **Clear AASA cache:**
   - Uninstall and reinstall the app
   - Or: Settings > [Your App] > Delete and reinstall

2. **Verify AASA is valid:**

   ```bash
   curl -v https://wattr.fit/.well-known/apple-app-site-association
   ```

3. **Check Team ID:**
   - Must match exactly with Apple Developer Portal
   - Format: `TEAM_ID.com.wattr.app`

4. **Enable Associated Domains:**
   - Must be enabled in Xcode project capabilities
   - EAS Build handles this automatically with `associatedDomains` in app.config.js

### Android: App Links Not Working

1. **Verify assetlinks.json:**

   ```bash
   curl -v https://wattr.fit/.well-known/assetlinks.json
   ```

2. **Check SHA256 fingerprint:**
   - Debug and release builds have different fingerprints
   - Add both to assetlinks.json for testing

3. **Verify auto-verify flag:**
   - Check that `autoVerify: true` in app.config.js
   - Verify in manifest: `android:autoVerify="true"`

4. **Clear verification:**
   ```bash
   adb shell pm clear-package-preferred com.wattr.app
   ```

### Both Platforms

**App doesn't open from link:**

- Make sure app is installed and has been opened at least once
- Try uninstalling and reinstalling
- Check that URL matches exactly (including path)
- Verify domain files are accessible via HTTPS

**Redirects to browser instead:**

- Domain verification may have failed
- Check server logs for 404s on `.well-known` files
- Ensure no redirects (301/302) on verification URLs

## Security Notes

- ✅ Universal links are more secure than custom schemes
- ✅ Domain verification prevents hijacking
- ✅ HTTPS required for production
- ⚠️ Custom schemes can be claimed by any app (less secure)
- 🔒 Always use HTTPS callback URLs in production

## References

- [iOS Universal Links](https://developer.apple.com/ios/universal-links/)
- [Android App Links](https://developer.android.com/training/app-links)
- [Expo Universal Links](https://docs.expo.dev/guides/linking/#universal-links-on-ios)
- [Supabase Auth with Deep Links](https://supabase.com/docs/guides/auth/auth-deep-linking/auth-deep-linking)
