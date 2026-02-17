# Theming

- All colors come from `useColors()` palette; no hardcoded hex or color names.
- Update `stores/theme/themeStore.ts` to add new colors (light + dark) and types before use.
- Apply theme colors to backgrounds, text, borders, icons, navigation headers.

# i18n

- All user-visible strings via `useTranslation()`/`t()`; no hardcoded text.
- Add keys to every locale file (`i18n/locales/en.ts`, etc.) using dotted namespaces (e.g., `bluetooth.connecting`, `common.ok`, `errors.somethingWrong`).
- Keep strings outside components when reused; prefer descriptive keys over UI text.
