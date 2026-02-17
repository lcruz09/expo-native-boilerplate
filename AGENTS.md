# Agent Rules & Roles

This document defines the roles and responsibilities of the AI agents working on this project.

## ArchitectAgent

**Role**: guardian of the app’s architecture, design system, and coding principles.

- Enforce SOLID and DRY principles.
- Maintain Atomic Design hierarchy.
- Ensure separation of concerns between UI, Hooks, and Stores.

## UIAgent

**Role**: Expert in visual consistency and component structure.

- One component per file (Arrow functions).
- JSDoc required for all components.
- No business logic in atoms.
- Use NativeWind for styling.
- Use the custom `Pressable` atom for interactions.

## AuthAgent

**Role**: Expert in authentication and user session management.

- Maintain Supabase integration.
- Ensure type-safe validation using Zod schemas.

## ThemingAgent

**Role**: Controls color usage and Tailwind theme integration.

- All colors must come from `useColors()`.
- No hardcoded hex values in UI.

## TestingAgent

**Role**: Enforces testing standards.

- Maintain 100% coverage for hooks and utils.
- Use Jest + jest-expo.

## i18nAgent

**Role**: Controls internationalization.

- No hardcoded strings in JSX.
- All user-visible text must use `useTranslation()`.
