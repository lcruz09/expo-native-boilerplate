# Test Environment Setup

## Overview

Test environment variables are now configured through `jest.env.js` instead of hardcoded fallbacks in production code. This keeps test configuration clean and separate.

## How It Works

### 1. Jest Configuration (`package.json`)

```json
"jest": {
  "preset": "jest-expo",
  "setupFiles": [
    "<rootDir>/jest.env.js",    // ✅ Loads first - sets env vars
    "<rootDir>/jest.mocks.js"   // Then loads mocks
  ]
}
```

### 2. Environment Setup (`jest.env.js`)

This file runs **before** all tests and provides default values for:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

**Default values:**

```javascript
EXPO_PUBLIC_SUPABASE_URL = "https://test-placeholder.supabase.co";
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

These are placeholder values that allow tests to run without real Supabase credentials.

### 3. Production Code (`services/supabase/client.ts`)

The production code is now clean and uses `config` directly:

```typescript
const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.publishableKey;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  // ... config
});
```

No hardcoded fallbacks in production code! ✅

## Optional: Local Test Environment Overrides

If you want to test against a real Supabase test project, create a `.env.test` file:

```bash
# .env.test (git-ignored)
EXPO_PUBLIC_SUPABASE_URL=https://your-test-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Note:** `.env.test` is already covered by `.gitignore` so it won't be committed.

## CI/CD Integration

In CI/CD environments, you can override these values by setting environment variables:

```bash
export EXPO_PUBLIC_SUPABASE_URL="https://ci-test.supabase.co"
export EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY="eyJ..."
npm test
```

The `jest.env.js` uses `||` operator, so existing env vars take precedence.

## Benefits

✅ **Clean production code** - No test fallbacks in services  
✅ **Consistent tests** - All tests use same environment  
✅ **CI-friendly** - Easy to override in different environments  
✅ **Git-safe** - No credentials in version control  
✅ **Flexible** - Can use `.env.test` for local overrides  
✅ **Self-documenting** - Environment setup is explicit and documented

## Running Tests

```bash
# With default test environment
npm test

# With custom .env.test (if created)
npm test

# In CI/CD (with env vars set)
export EXPO_PUBLIC_SUPABASE_URL="..."
npm test
```

All scenarios work seamlessly! 🎉
