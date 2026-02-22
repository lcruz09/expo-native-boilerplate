# Development Guide

## Prerequisites

### Node.js Version

This project requires **Node.js v22.13.0** (defined in `.nvmrc`).

```bash
# Switch to the project's Node version
nvm use

# If you don't have it installed
nvm install
```

> Always run `nvm use` before installing packages or running the app.

### Doppler (Secrets Management)

All environment variables are managed via [Doppler](https://www.doppler.com/). The `yarn start`, `yarn android`, and `yarn ios` commands are all prefixed with `doppler run --` and will fail if Doppler is not configured.

```bash
# Install Doppler CLI (macOS)
brew install dopplerhq/cli/doppler

# Log in
doppler login

# Set up the project (uses doppler.yaml)
doppler setup
```

For local development without Doppler, copy `.env.example` to `.env` and fill in the values.

---

## Quick Start

```bash
# 1. Install dependencies
yarn install

# 2. Configure secrets (pick one)
doppler setup          # via Doppler (recommended)
cp .env.example .env   # manual fallback

# 3. Run the app
yarn ios               # iOS simulator
yarn android           # Android emulator/device
```

---

## Available Scripts

| Command | Description |
|---|---|
| `yarn start` | Start Metro bundler (Doppler-managed) |
| `yarn ios` | Run on iOS simulator/device |
| `yarn android` | Run on Android emulator/device |
| `yarn lint` | ESLint + Prettier check |
| `yarn tsc --noEmit` | TypeScript type-check |
| `yarn test` | Run all Jest unit tests |
| `yarn test:watch` | Jest in watch mode |
| `yarn test:coverage` | Jest with coverage report |
| `yarn test:e2e` | Run Maestro E2E flow |
| `yarn pre-commit` | Full pipeline: format → lint → tsc → test |

---

## Native Builds (Prebuild)

### When to run prebuild

Run `npx expo prebuild` when:

- First-time project setup
- After adding/updating native dependencies
- After changing native configurations in `app.config.js`
- After updating the Expo SDK version

```bash
# Update native code
npx expo prebuild

# Clean regenerate (slower but ensures a fresh start)
npx expo prebuild --clean
```

---

## Production Builds (EAS)

The project uses [EAS Build](https://docs.expo.dev/build/introduction/) with three profiles defined in `eas.json`:

| Profile | Distribution | Use case |
|---|---|---|
| `development` | Internal | Dev client builds with full debugging |
| `preview` | Internal | Staging/QA builds for internal testing |
| `production` | App stores | Release builds with auto-increment version |

```bash
# Install EAS CLI
npm install -g eas-cli
eas login

# Build
eas build --platform ios --profile development
eas build --platform android --profile production

# Submit to stores
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

---

## CI/CD

GitHub Actions runs automatically on every push and pull request to `main`/`master`.

**Pipeline** (`.github/workflows/ci.yml`):
1. Checkout + Node setup from `.nvmrc`
2. `yarn install --frozen-lockfile`
3. `yarn lint`
4. `yarn tsc --noEmit`
5. `yarn test`

---

## Pre-commit Hook

Husky runs `yarn pre-commit` before every commit:

1. `npx prettier --write .` — auto-format all files (including Tailwind class ordering)
2. `yarn lint` — ESLint check
3. `yarn tsc` — TypeScript type-check
4. `yarn test` — full test suite

If any step fails, the commit is blocked until you fix the issue.

---

## Formatting (Prettier)

Prettier is configured in `.prettierrc` with `prettier-plugin-tailwindcss` for automatic Tailwind class ordering.

```bash
# Format all files
npx prettier --write .

# Check without modifying
npx prettier --check .
```

Prettier also runs as part of the ESLint pipeline (`eslint-plugin-prettier`), so `yarn lint` will surface formatting issues.

---

## Testing

### Unit Tests

```bash
yarn test                    # all tests
yarn test -- registerSchema  # filter by name
yarn test:coverage           # with coverage report
```

Tests use **Jest + jest-expo + @testing-library/react-native**. Shared mocks live in `jest.setup.js` and `jest.mocks.js`.

### E2E Tests (Maestro)

```bash
# Run auth E2E flow
yarn test:e2e

# Interactive studio
yarn test:e2e:studio
```

E2E tests require `TEST_EMAIL` and `TEST_PASSWORD` to be set in the environment (never hardcoded).

---

## Project Structure

```
expo-native-boilerplate/
├── app/                    # Expo Router screens (file-based routing)
│   ├── (auth)/            # Auth-gated routes
│   └── _layout.tsx        # Root layout + providers
├── components/            # Atomic Design components
│   ├── atoms/             # Basic building blocks (Button, Icon, Pressable)
│   ├── molecules/         # Atom combinations (IconButton)
│   └── organisms/         # Feature sections (PageLayout, ErrorBoundary)
├── hooks/                 # Custom React hooks
│   ├── api/               # Server state (useAuth)
│   ├── linking/           # Deep link handling (useDeepLinking)
│   ├── theme/             # Theme/color hooks
│   └── localization/      # Translation hook
├── providers/             # React Context providers (Theme, Translation, Query)
├── stores/                # Zustand stores
│   ├── theme/             # Light/dark/system theme
│   └── user/              # User preferences (language, onboarding)
├── services/              # External communication
│   ├── api/               # Auth services (Supabase factory)
│   ├── database/          # Drizzle ORM + SQLite client
│   └── storage/           # KV storage + secure storage
├── schemas/               # Zod validation schemas
├── i18n/                  # Localization (en, es)
├── config/                # Env var validation (throws on missing vars)
├── utils/                 # Pure helper functions + logger
├── assets/                # Images, fonts
├── .env.example           # Required env vars reference
├── doppler.yaml           # Doppler project config
├── eas.json               # EAS Build profiles
└── .github/workflows/     # GitHub Actions CI
```

---

## Coding Standards

### Colors

**Never hardcode hex values.** Always use `useColors()`:

```tsx
import { useColors } from '@/hooks/theme/useColors';

const MyComponent = () => {
  const colors = useColors();
  return <View style={{ backgroundColor: colors.background }} />;
};
```

To add a new color, update both light and dark palettes in `stores/theme/themeStore.ts` first.

### Translations

**Never hardcode user-facing strings.** Always use `useTranslation()`:

```tsx
const { t } = useTranslation();
return <Text>{t("common.save")}</Text>;
```

Add keys to `i18n/locales/en.ts` and `i18n/locales/es.ts` using dotted namespaces.

### Component Pattern

All pure components must be memoized and named:

```tsx
import { memo } from "react";

export const MyAtom = memo(({ label }: Props) => {
  return <Typography variant="body">{label}</Typography>;
});
MyAtom.displayName = "MyAtom";
```

### Accessibility

Interactive components require accessibility props:

```tsx
<Pressable
  accessibilityRole="button"        // defaulted in Pressable atom
  accessibilityLabel={t("common.close")}
  accessibilityState={{ disabled: isLoading, busy: isLoading }}
/>
```

---

## Troubleshooting

### App won't start after adding a native dependency

```bash
npx expo prebuild --clean
yarn ios   # or yarn android
```

### Metro bundler cache issues

```bash
npx expo start --clear
```

### Doppler not configured

```bash
doppler login && doppler setup
# or: cp .env.example .env  (manual fallback)
```

### TypeScript errors after pulling changes

```bash
yarn install
yarn tsc --noEmit
```

---

## Helpful Links

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Doppler Documentation](https://docs.doppler.com/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
