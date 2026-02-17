# Expo Native Boilerplate

A professional, high-quality Expo React Native boilerplate designed for building scalable mobile applications with a robust architecture.

## 🚀 Features

- **Auth System**: Ready-to-use authentication with Supabase (Login, Register, Profile Management).
- **Theming Engine**: Dynamic light/dark mode support using Zustand and a specialized `useColors` hook.
- **i18n Localization**: Multi-language support out of the box.
- **Atomic Design**: Structured component hierarchy (Atoms, Molecules, Organisms).
- **Local Database**: Built-in SQLite + Drizzle ORM setup for local persistence.
- **Safe Area & Layouts**: Best-in-class handling of safe areas and reusable PageLayout components.
- **Rules & Automation**: Integrated Antigravity rules for maintaining code quality.

## 📁 Directory Structure

- `app/`: Expo Router file-based navigation screens.
- `components/`: Atomic UI components (atoms, molecules, organisms).
- `hooks/`: Custom React hooks for business logic.
- `providers/`: Context providers for global services.
- `stores/`: Zustand global state management.
- `services/`: API and third-party service integrations.
- `i18n/`: Translation files and localization config.
- `utils/`: Reusable helper functions.
- `schemas/`: Zod validation schemas.

## 🛠️ Tech Stack

- **Framework**: Expo / React Native
- **Navigation**: Expo Router (File-based)
- **State Management**: Zustand
- **Styling**: NativeWind (Tailwind CSS)
- **Validation**: Zod + React Hook Form
- **Auth/Backend**: Supabase
- **Local DB**: Expo SQLite + Drizzle
- **Monitoring**: Sentry

## 🚦 Getting Started

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file based on the required services (Supabase, Sentry).

3. **Run Locally**:
   ```bash
   npx expo start
   ```

## 📖 Best Practices

Follow the interaction patterns documented in `.agent/rules/app-interactions.md` to maintain architectural consistency.
