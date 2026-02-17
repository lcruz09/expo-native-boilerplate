# Environment Variables Setup & Troubleshooting

## The Problem

You're seeing this error:

```
[Config] ⚠️ Missing environment variables:
[Config]   - EXPO_PUBLIC_SUPABASE_URL is not set
[Config] Please check your .env file for required configuration.
ERROR [Error: supabaseUrl is required.]
```

## Root Cause

The `.env` file exists but the environment variables aren't being loaded correctly. Common causes:

1. **The `.env` file is empty or incorrectly formatted**
2. **Metro bundler hasn't restarted** after `.env` changes
3. **Conflicting packages** - Previously used `react-native-dotenv` which conflicted with Expo's built-in `.env` support (now removed)

## Solution Steps

### Step 1: Verify Your `.env` File Format

Your `.env` file should look **exactly** like this (no extra spaces, no quotes unless the value contains spaces):

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_actual_key_here
```

**Important:**

- ✅ Use `=` with NO spaces around it
- ✅ Variables MUST start with `EXPO_PUBLIC_` for Expo to expose them
- ❌ Don't wrap values in quotes (unless they contain spaces)
- ❌ Don't add comments on the same line
- ❌ Don't leave blank lines between variables

### Step 2: Get Your Actual Supabase Credentials

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** (looks like `https://xxxxxxxxxxxxx.supabase.co`)
   - **Publishable key** (starts with `sb_publishable_...`)

**Note:** Use the **publishable key**, NOT the anon key or service_role key!

### Step 3: Clear Cache and Restart

After updating your `.env` file:

```bash
# Stop the current Expo server (Ctrl+C or Cmd+C)

# Clear all caches
npx expo start --clear

# Or if that doesn't work, do a full clean:
rm -rf node_modules/.cache
rm -rf .expo
npx expo start --clear
```

### Step 4: Verify Environment Variables Are Loading

Add this temporary check to your `app.config.js` (at the top):

```javascript
// Temporary debug logging
console.log("🔍 Environment Variables Check:");
console.log(
  "EXPO_PUBLIC_SUPABASE_URL:",
  process.env.EXPO_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"
);
console.log(
  "EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY:",
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing"
);

module.exports = {
  // ... rest of config
```

Then restart Expo with `npx expo start --clear`. You should see the check marks in the terminal.

## Alternative: Use `.env.local` (Recommended)

Instead of using `.env`, you can use `.env.local` which is automatically ignored by `.gitignore` and is the standard for local secrets:

1. **Create `.env.local`** in your project root (same level as `package.json`)
2. Add your actual credentials to `.env.local`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_actual_key_here
   ```
3. Keep `.env.example` with placeholder values for documentation
4. Restart Expo: `npx expo start --clear`

**Note:** Expo automatically loads `.env.local` if it exists, following [standard .env file resolution](https://docs.expo.dev/guides/environment-variables/).

## Common Mistakes to Avoid

### ❌ Wrong Format

```env
EXPO_PUBLIC_SUPABASE_URL = "https://..."  # NO spaces, NO quotes
SUPABASE_URL=https://...                  # Missing EXPO_PUBLIC_ prefix
```

### ✅ Correct Format

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
```

## Testing Without Real Credentials

If you just want to test the app without Supabase, the app will use placeholder values and show a warning. This is fine for development of non-auth features.

## Still Having Issues?

1. **Check file location**: The `.env` or `.env.local` file MUST be in the root directory (same level as `package.json`)
2. **Check file permissions**: Make sure the file is readable
3. **Check for BOM**: Some editors add a BOM (Byte Order Mark) to files. Save as UTF-8 without BOM
4. **Clear Metro cache**: Run `npx expo start --clear` to ensure old cached values aren't being used

## For Production Builds

For EAS Build, you need to set environment variables differently:

```bash
# Add to eas.json or pass as build secrets
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://..."
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY --value "sb_publishable_..."
```

See: [Expo Environment Variables Documentation](https://docs.expo.dev/guides/environment-variables/)
