# Supabase Setup Guide

This guide explains how to set up Supabase for authentication and profile storage in the Wattr fitness app.

## Prerequisites

- A Supabase account (sign up at [https://supabase.com](https://supabase.com))
- A Supabase project created

## 1. Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **Publishable key** (starts with `sb_publishable_...`)

**Note:** This app uses modern **publishable keys** instead of the deprecated JWT-based `anon` keys. Publishable keys provide better security, easier rotation, and avoid coupling issues. [Learn more about API keys](https://supabase.com/docs/guides/api/api-keys).

## 2. Configure Environment Variables

Create a `.env` file in the root of your project (if it doesn't exist) and add:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key-here
```

**Important:** Make sure `.env` is in your `.gitignore` to keep credentials secure.

## 2.1. Expo SecureStore Configuration

The app uses `expo-secure-store` to securely store authentication tokens. This is already configured in `app.config.js` with the necessary plugin setup:

- ✅ **iOS**: Face ID permission for biometric authentication
- ✅ **Android**: Auto Backup exclusion to prevent data loss on restore

If you're building for the first time or made changes to the config, run:

```bash
npx expo prebuild --clean
```

This generates the native iOS and Android projects with the correct SecureStore configuration.

## 3. Database Setup

### Create the Profiles Table

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  birth_year INTEGER NOT NULL CHECK (birth_year >= 1924 AND birth_year <= EXTRACT(YEAR FROM CURRENT_DATE) - 10),
  height INTEGER NOT NULL CHECK (height >= 100 AND height <= 250),
  weight NUMERIC(5,2) NOT NULL CHECK (weight >= 20 AND weight <= 300),
  resting_heart_rate INTEGER CHECK (resting_heart_rate >= 30 AND resting_heart_rate <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX profiles_email_idx ON profiles(email);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON profiles
  FOR DELETE
  USING (auth.uid() = id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Troubleshooting: Schema Configuration Error (PGRST106)

If you see an error like `PGRST106: The schema must be one of the following: api`, this means your Supabase project's PostgREST API is configured to expose specific schemas, but the client is trying to access a different one.

**To fix this:**

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Scroll down to **PostgREST Configuration**
4. Ensure **Exposed schemas** includes `public` (or adjust the client configuration to match)
5. If you changed the setting, restart your Supabase project

**Client-side configuration:**

The app is configured to use the `public` schema by default (see `services/supabase/client.ts`):

```typescript
export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: "public", // Change this if your project uses a different schema
  },
});
```

If your Supabase project uses a custom schema (e.g., `api`), update this configuration to match.

## 4. Authentication Settings

### Configure Email Settings (Optional)

If you want to customize email templates for authentication:

1. Go to **Authentication** → **Email Templates**
2. Customize the templates as needed

### Configure URL Configuration

1. Go to **Authentication** → **URL Configuration**
2. Add your app's deep link URL (if using deep linking for email verification)

## 5. Testing the Setup

1. Start your app: `npm start`
2. Try registering a new user
3. Check the Supabase dashboard:
   - **Authentication** → **Users** should show the new user
   - **Table Editor** → **profiles** should show the user's profile

## Database Schema

### profiles Table

| Column             | Type        | Required | Description                                |
| ------------------ | ----------- | -------- | ------------------------------------------ |
| id                 | UUID        | Yes      | Primary key, references auth.users(id)     |
| email              | TEXT        | Yes      | User's email address                       |
| first_name         | TEXT        | No       | User's first name                          |
| last_name          | TEXT        | No       | User's last name                           |
| gender             | TEXT        | Yes      | User's gender (male, female, other)        |
| birth_year         | INTEGER     | Yes      | User's birth year (1924-current year - 10) |
| height             | INTEGER     | Yes      | User's height in centimeters (100-250)     |
| weight             | NUMERIC     | Yes      | User's weight in kilograms (20-300)        |
| resting_heart_rate | INTEGER     | No       | Resting heart rate in BPM (30-100)         |
| created_at         | TIMESTAMPTZ | Yes      | When the profile was created               |
| updated_at         | TIMESTAMPTZ | Yes      | When the profile was last updated          |

## Row Level Security (RLS)

The profiles table has RLS enabled with the following policies:

- **Read**: Users can only read their own profile
- **Insert**: Users can only insert their own profile
- **Update**: Users can only update their own profile
- **Delete**: Users can only delete their own profile

This ensures that users can only access and modify their own data.

## Authentication Flow

### Registration Flow

1. User fills out registration form
2. App calls `supabase.auth.signUp()` with email/password
3. Supabase creates auth user
4. App creates profile entry in `profiles` table
5. Profile data is also cached locally using MMKV

### Login Flow

1. User enters email/password
2. App calls `supabase.auth.signInWithPassword()`
3. Supabase returns session with JWT token
4. App fetches profile from `profiles` table
5. Profile data is cached locally
6. User is redirected to home screen

### Logout Flow

1. User clicks logout in settings
2. App calls `supabase.auth.signOut()`
3. Session is cleared from secure storage
4. Local profile cache is cleared
5. User is redirected to login screen

## Troubleshooting

### "Invalid JWT" or Session Errors

- Make sure your `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is correct
- Verify you're using a publishable key (`sb_publishable_...`) and not the deprecated anon key
- Check that the token hasn't expired
- Try logging out and logging back in

### Profile Not Saving

- Check Supabase dashboard for errors in the Table Editor
- Verify RLS policies are set up correctly
- Check the app logs for detailed error messages

### Email Confirmation Required

By default, Supabase requires email confirmation. To disable for development:

1. Go to **Authentication** → **Settings**
2. Disable "Enable email confirmations"

**Note:** Re-enable this for production!

## Security Best Practices

1. **Never commit** `.env` file to version control
2. **Use modern publishable keys** (`sb_publishable_...`) instead of deprecated JWT-based anon keys
3. **Use Row Level Security** (already configured above)
4. **Enable email confirmation** in production
5. **Use HTTPS** for all API requests (handled by Supabase)
6. **Rotate keys** if they are ever exposed - publishable keys can be rotated independently without downtime
7. **Set up monitoring** in the Supabase dashboard

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
