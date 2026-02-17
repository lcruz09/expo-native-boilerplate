# Development Guide

## Prerequisites

### Node.js Version

This project requires **Node.js 20.19.4 or higher** (recommended: v22.12.0).

**Check and use the correct version:**

```bash
# Check current Node version
node --version

# Use the project's Node version (from .nvmrc)
nvm use

# If you don't have the version installed
nvm install
```

⚠️ **Important**: Always run `nvm use` before installing packages or running the app!

## Quick Start

### Interactive Run Script

The easiest way to run the app is using the interactive script:

```bash
npm run run
```

This will guide you through:

1. **Platform selection** (iOS or Android)
2. **Prebuild options** (skip, run, or clean)
3. **Device selection** (automatic or manual)

### Common Commands

#### Development (Metro bundler)

```bash
# Interactive script (recommended)
npm run run

# Direct commands
npm run android          # Run on Android
npm run ios             # Run on iOS
npm start               # Start Metro bundler only
```

#### Prebuild (Native Code)

```bash
# Run prebuild (update native dependencies)
npm run prebuild

# Clean prebuild (remove and regenerate using --clean flag)
npm run prebuild:clean

# Manual prebuild for specific platform (use npx outside npm scripts)
npx expo prebuild --platform android
npx expo prebuild --platform ios

# Manual clean prebuild
npx expo prebuild --platform android --clean
```

#### Testing

```bash
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
```

#### Linting

```bash
npm run lint            # Check for linting errors
npm run lint -- --fix   # Fix linting errors automatically
```

## Development Builds

The app uses Expo's development builds, which give you:

- ✅ **Hot reload** and **Fast refresh**
- ✅ **Native module support** (BLE, MMKV, etc.)
- ✅ **Debug mode** with full logging
- ✅ **Connected to Metro bundler** for live updates

### Running Development Builds

```bash
# Interactive (recommended)
npm run run

# Direct commands
npm run android
npm run ios
```

## Prebuild Explained

### When to run prebuild?

Run `npm run prebuild` when:

- ✅ First time setting up the project
- ✅ After adding/updating native dependencies (e.g., react-native-mmkv)
- ✅ After changing `app.json` native configurations
- ✅ After updating Expo SDK version
- ✅ When you see "MMKV not available" warnings

### When to clean prebuild?

Run `npm run prebuild:clean` when:

- ✅ Native builds are acting strange
- ✅ You want to ensure a fresh native setup
- ✅ You're troubleshooting native module issues

⚠️ **Note**: Clean prebuild takes longer but ensures a fresh start.

## Device Selection

### Automatic (Recommended)

Expo will:

- Show a list of connected/available devices
- Let you select interactively
- Remember your choice for next time

### Manual

- For iOS: Lists all connected devices and simulators
- For Android: Lists all connected devices and emulators

## Production Builds (Future)

For creating standalone production builds to distribute via app stores, you can use EAS Build in the future:

```bash
# Install EAS CLI (when needed)
npm install -g eas-cli
eas login

# Create production build
eas build --platform android --profile production
eas build --platform ios --profile production
```

For now, the project uses development builds for all testing and development work.

## Persistence (MMKV)

The app uses [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) for fast, synchronous storage of theme and locale preferences.

### Requirements

MMKV V4 requires **both** packages:

- `react-native-mmkv` ✅ (already installed)
- `react-native-nitro-modules` ✅ (already installed)

### Enabling MMKV

To enable theme and locale persistence:

1. **Run prebuild** (links native modules):

   ```bash
   npm run prebuild:clean
   ```

2. **Rebuild the app**:

   ```bash
   npm run android  # or npm run ios
   ```

3. **Verify**:
   - You should NO longer see: "MMKV not available" warnings
   - Theme and language will persist across app restarts

### Troubleshooting MMKV

If you still see "MMKV not available" warnings after prebuild:

1. Make sure both `react-native-mmkv` and `react-native-nitro-modules` are installed
2. Run `npm run prebuild:clean` to regenerate native code
3. Rebuild the app completely

## General Troubleshooting

### App won't start after adding native dependency

**Solution**: Clean prebuild and rebuild

```bash
npm run prebuild:clean
npm run android  # or npm run ios
```

### "Command failed" errors

**Solution**: Check you have required tools installed:

- **Android**: Android Studio, Android SDK, JDK 17+
- **iOS**: Xcode (Mac only), CocoaPods

### Metro bundler connection issues

**Solution**: Clear Metro cache

```bash
npx expo start --clear
```

## Quick Reference

| Command                  | Purpose                              |
| ------------------------ | ------------------------------------ |
| `npm run run`            | Interactive app runner (recommended) |
| `npm run android`        | Run on Android device                |
| `npm run ios`            | Run on iOS device                    |
| `npm start`              | Start Metro bundler                  |
| `npm run prebuild`       | Update native code                   |
| `npm run prebuild:clean` | Clean and regenerate native code     |
| `npm test`               | Run tests                            |
| `npm run lint`           | Check code style                     |

## Project Structure

```
wattr-app/
├── app/                    # Expo Router pages
├── components/            # React components (Atomic Design)
│   ├── atoms/            # Basic building blocks
│   ├── molecules/        # Simple combinations
│   └── organisms/        # Complex components
├── hooks/                # Custom React hooks
├── services/             # Business logic (BLE, etc.)
├── stores/               # Zustand stores
├── providers/            # React Context providers
├── i18n/                 # Internationalization
├── scripts/              # Build and utility scripts
└── assets/               # Images, fonts, etc.
```

## Coding Standards

### Color Usage

**Rule: Never hardcode color values in components.**

✅ **DO**:

```tsx
// Use colors from the theme palette
import { useColors } from "@/hooks/theme/useColors";

const MyComponent = () => {
  const colors = useColors();
  return (
    <View style={{ backgroundColor: colors.primary }}>
      <Text style={{ color: colors.text.primary }}>Hello</Text>
    </View>
  );
};
```

❌ **DON'T**:

```tsx
// Never hardcode hex colors
<View style={{ backgroundColor: "#FF6B9D" }}>
  <Text style={{ color: "#000000" }}>Hello</Text>
</View>
```

**Available color palette**:

- `colors.primary` - Primary brand color
- `colors.secondary` - Secondary brand color
- `colors.background` - Screen background
- `colors.card` - Card/container background
- `colors.border.light` / `colors.border.dark` - Border colors
- `colors.text.primary` / `colors.text.secondary` / `colors.text.tertiary` - Text colors
- `colors.status.success` / `colors.status.error` / `colors.status.warning` / `colors.status.info` - Status colors

**If you need a new color that's not in the palette:**

1. Add it to the theme definitions in `stores/theme/themeStore.ts`
2. Add it to both light and dark theme variants
3. Use the new color via `useColors()` hook

### Component Organization

Follow the Atomic Design methodology:

- **Atoms**: Basic UI elements (Button, Typography, Icon)
- **Molecules**: Simple combinations (MetricCard, ConnectionStatus)
- **Organisms**: Complex features (WorkoutDataView, DeviceLinkingCard)

### Translation Keys

- Always use translation keys from `i18n/locales`
- Never hardcode user-facing text
- Add translations to all supported languages (en, es, de, ja, pt-BR)

## Helpful Links

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://expo.github.io/router/)
