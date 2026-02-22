# Project Context

- Expo React Native boilerplate for rapid development. Generic — no domain-specific logic.
- TypeScript throughout; file-based routing via Expo Router (v6).
- State: Zustand (with `persist` middleware); KV storage: `expo-sqlite/kv-store`; styling: NativeWind/Tailwind.
- Server state: TanStack Query v5.
- Authentication: Supabase JS SDK v2 (factory pattern in `services/api/factory.ts`).
- Localization: `i18n-js` + `expo-localization`. Active locales: `en`, `es`.
- Persistence: Expo SQLite + Drizzle ORM.
- Secrets: Doppler (`doppler.yaml`). Local fallback via `.env` (see `.env.example`).
- CI/CD: GitHub Actions (`.github/workflows/ci.yml`). Pre-commit: Husky.
- Builds: EAS Build (`eas.json`). Deep linking scheme: `expo-native-boilerplate://`.
- Primary folders: `app/` (screens), `components/` (atoms/molecules/organisms), `hooks/`, `providers/`, `stores/`, `services/`, `schemas/`, `i18n/`, `assets/`.

# Key Files & Stores

- `stores/theme/themeStore.ts` — light/dark/system theme + resolved palette.
- `stores/user/userStore.ts` — persisted user preferences (language, onboarding).
- `hooks/linking/useDeepLinking.ts` — handles `auth-callback` deep links.
- `hooks/api/useAuth.ts` — auth session via TanStack Query.
- `services/api/factory.ts` — service instantiation (swap auth/db providers here).
- `config/index.ts` — validates env vars at startup; throws on missing required vars.

# Architecture

Follows atomic design (atoms → molecules → organisms → pages) combined with specialized hooks for business logic and Zustand for global state. Documentation and rules are located in `.agent/rules/`.
