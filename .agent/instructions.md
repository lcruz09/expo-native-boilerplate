# Project Instructions

## Node.js Version Management

- This project requires Node.js version defined in `.nvmrc` (v22.13.0).
- **CRITICAL**: Always ensure you are using the correct Node version before running `yarn` commands.
- When running commands in the terminal, prefix them with nvm check if necessary: `source ~/.nvm/nvm.sh && nvm use && yarn <command>`.

## Technology Stack & Patterns

- **Package Manager**: Use `yarn` exclusively. Never use `npm` for project commands.
- **Styling**: NativeWind (Tailwind CSS) with `prettier-plugin-tailwindcss` for class ordering.
- **State Management**: Zustand with `persist` middleware for persisted stores.
- **Server State**: TanStack Query v5 for all remote/async data fetching and caching.
- **Local Database**: Drizzle ORM with `expo-sqlite`.
- **KV Storage**: `expo-sqlite/kv-store` via `getStorage` and `createZustandStorage` utilities in `services/storage/kvStorage.ts`.
- **Icons**: `@expo/vector-icons` (Ionicons) via the `Icon` atom.
- **Validation**: Zod (schemas in `schemas/`) with `react-hook-form` and `zodResolver`.
- **I18n**: `i18n-js` for all user-facing strings.
- **Secrets**: Doppler — all `yarn start/android/ios` commands are prefixed with `doppler run --`.
- **Build/Deploy**: EAS Build (`eas.json`) for development, preview, and production profiles.
- **CI/CD**: GitHub Actions (`.github/workflows/ci.yml`) — lint, type-check, and tests on every push/PR.
- **Pre-commit**: Husky runs `yarn pre-commit` (prettier → lint → tsc → test) before every commit.

## Coding Standards

- **Atomic Design**: Structure components into `atoms`, `molecules`, and `organisms`.
- **Theming**: Use the `useColors()` hook. NEVER hardcode hex colors.
- **Boilerplate Purity**: Keep the boilerplate generic. Avoid adding domain-specific logic unless explicitly asked.
- **Translations**: Always add new strings to `i18n/locales/en.ts` and ensure they are used via the `useTranslation` hook.
- **Memoization**: Wrap all pure/presentational components with `React.memo` and add a `.displayName` string to satisfy the `react/display-name` ESLint rule.
- **Accessibility**: All interactive components must include `accessibilityRole`, `accessibilityLabel`, and `accessibilityState` where applicable.
- **No `any` types**: Use typed interfaces for error shapes and external data. Never use `any` in production code paths.

## Deployment & Workflows

- Use the `/pr` slash command to create pull requests following the project's workflow.
- CI runs automatically on push/PR to `main`/`master` via `.github/workflows/ci.yml`.
- The pre-commit hook (`yarn pre-commit`) auto-formats, lints, type-checks, and tests before every commit.
