# Boilerplate TODOs

Issues identified during repository review, ordered by severity.

---

## 🔴 Critical

- [x] **Add test coverage** — Added unit tests for `SupabaseAuthService`, `registerSchema`, `themeStore`, and `supabase/utils`. 67 tests passing.
- [x] **Add `.env.example`** — Created with all required and optional variables documented.
- [x] **Remove hardcoded credentials from E2E tests** — `.maestro/flows/auth_e2e.yaml` now uses `${TEST_EMAIL}` / `${TEST_PASSWORD}`.
- [x] **Add `eas.json`** — Created with `development`, `preview`, and `production` profiles.
- [x] **Fix hardcoded Doppler project name** — `doppler.yaml` now uses `your-doppler-project` as a placeholder.

---

## 🟠 Major

- [x] **Add Prettier config** — Created `.prettierrc` with Tailwind plugin and standard rules.
- [x] **Add CI/CD pipeline** — Created `.github/workflows/ci.yml` with lint, type-check, and test steps.
- [x] **Add Husky pre-commit hooks** — Installed Husky, created `.husky/pre-commit` wired to `yarn pre-commit`.
- [x] **Fix `any` types in critical paths** — `utils.ts` now uses `SupabaseAuthErrorShape`; `client.web.ts` now uses `ExpoSQLiteDatabase<typeof schema> | null`.
- [x] **Harden config validation** — `config/index.ts` now throws on missing required vars instead of warning.
- [x] **Complete Zustand store coverage** — Added `stores/user/userStore.ts` (language + onboarding preferences) with full tests. 73 tests passing.

---

## 🟡 Minor

- [x] **Add accessibility props** — `Pressable` defaults `accessibilityRole="button"`; `Icon` hides decorative icons and exposes `accessibilityLabel`; `Button` adds `accessibilityState`; `IconButton` sets `accessibilityLabel` from its `label` prop.
- [x] **Add memoization strategy** — Wrapped `Pressable`, `Icon`, `Button`, `IconButton`, and `PageLayout` with `React.memo`.
- [x] **Add log file rotation/cleanup** — `utils/logger.ts` now runs `cleanupOldLogs()` on session start: deletes files older than 7 days and caps storage at 10 files.
- [x] **Wire up splash screen** — `SplashScreen.preventAutoHideAsync()` called at module level in `app/_layout.tsx`; hidden once auth `isLoading` resolves.
- [x] **Add deep linking config** — `scheme` was already set in `app.config.js`. Created `hooks/linking/useDeepLinking.ts` to handle `auth-callback` URLs; wired into `RootNavigator`.
- [x] **`@react-navigation` dependencies** — Intentionally retained. `expo-router` declares these as direct dependencies and Metro requires them to be resolvable from the project root. Removing them would break tab/drawer navigation when added.
