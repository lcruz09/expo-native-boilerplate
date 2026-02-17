# Project Context

- Expo React Native app designed as a generic boilerplate for rapid development.
- TypeScript throughout; file-based routing via Expo Router.
- State: Zustand; storage: MMKV; styling: NativeWind/Tailwind.
- Authentication: Supabase integration.
- Localization: i18n-js + expo-localization.
- Persistence: Expo SQLite + Drizzle ORM.
- Primary folders: `app/` (screens), `components/` (atoms/molecules/organisms), `hooks/`, `providers/`, `stores/`, `services/`, `i18n/`, `assets/`.

# Architecture

Follows a highly modular atomic design pattern combined with specialized hooks for business logic and Zustand for global state. Documentation and rules are located in `.agent/rules/`.
