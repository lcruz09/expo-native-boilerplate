# Wattr App - Project Context Documentation

## Project Overview

**Wattr** is a comprehensive React Native mobile application built with Expo that provides Bluetooth Low Energy (BLE) connectivity for heart rate monitoring and fitness machine tracking, GPS route-based virtual rides, and complete workout management with data visualization.

- **App Name**: Wattr
- **Bundle ID**: com.wattr.app
- **Version**: 1.0.0
- **Platforms**: iOS, Android, Web
- **Main Entry Point**: `expo-router/entry`
- **Deep Linking Scheme**: `wattr-app://`

---

## Technologies & Stack

### Core Framework

- **React Native**: 0.81.5
- **React**: 19.1.0
- **React DOM**: 19.1.0 (for web support)
- **Expo SDK**: ~54.0.20
- **TypeScript**: ~5.9.2
- **Node**: LTS (via package manager)

### Navigation & Routing

- **Expo Router**: ~6.0.13 (File-based routing with typed routes)
- **React Navigation**:
  - `@react-navigation/native`: ^7.1.8
  - `@react-navigation/bottom-tabs`: ^7.4.0
  - `@react-navigation/elements`: ^2.6.3
- **React Native Screens**: ~4.16.0
- **React Native Safe Area Context**: ~5.6.0

### Bluetooth & Device Communication

- **react-native-ble-plx**: ^3.5.0 (BLE/Bluetooth Low Energy)
- **buffer**: ^6.0.3 (For BLE data parsing)
- **Mock Devices**: Built-in mock HR and Fitness Machine devices for simulator testing

### State Management & Storage

- **zustand**: ^5.0.8 (State management for theme, auth, profile, workouts, settings, debug, routes, sync queue)
- **react-native-mmkv**: ^4.0.0 (Fast, synchronous key-value storage with ~30x faster than AsyncStorage)
- **Sync Queue**: Offline-first workout sync with exponential backoff retry logic

### Authentication & Backend

- **@supabase/supabase-js**: ^2.81.0 (Authentication and database)
- **expo-secure-store**: ~15.0.7 (Secure token storage with encryption and automatic chunking)
- **Database Schema**: PostgreSQL with Row Level Security (RLS)
  - `workouts` table: Workout metadata with app-generated UUIDs
  - `workout_samples` table: JSONB arrays for HR and cycling samples
  - `routes` table: GPS routes with JSONB waypoints, DB-generated UUIDs
  - Foreign keys with cascading deletes for data integrity

### Maps & GPS

- **@maplibre/maplibre-react-native**: ^10.4.0 (MapLibre Native for route visualization)
- **MapTiler**: Cloud-based map tiles with outdoor, street, satellite, hybrid, topo, and winter styles
- **GPX Parser**: Custom GPX file parser for route import
- **Virtual Ride Engine**: Real-time GPS position tracking and route simulation

### Data Visualization

- **react-native-chart-kit**: ^6.12.0 (Line charts for HR and elevation)
- **react-native-svg**: ^15.14.0 (SVG graphics for custom visualizations)

### File Management & Import

- **expo-document-picker**: ^14.0.7 (Document selection for GPX/FIT files)
- **expo-file-system**: ^19.0.17 (File system access and log management)
- **expo-sharing**: ^14.0.7 (File sharing functionality)
- **@garmin/fitsdk**: ^21.178.0 (FIT file parsing for Garmin imports)
- **fast-xml-parser**: ^5.3.1 (GPX file parsing)

### Form Validation

- **zod**: ^3.25.76 (Schema validation)
- **react-hook-form**: ^7.66.0 (Form state management)
- **@hookform/resolvers**: ^5.2.2 (Zod + React Hook Form integration)

### Styling

- **NativeWind**: v4.2.1 (TailwindCSS for React Native with dark mode support)
- **Tailwind CSS**: v3.4.18 configuration with custom theme colors

### UI & Animations

- **@expo/vector-icons**: ^15.0.3
- **@react-native-community/slider**: 5.0.1 (Custom sliders for resistance/sensitivity)
- **React Native Gesture Handler**: ~2.28.0
- **React Native Reanimated**: ~4.1.1
- **React Native Worklets**: 0.5.1
- **expo-haptics**: ~15.0.7 (Haptic feedback)

### Internationalization (i18n)

- **expo-localization**: Access device locale and language settings
- **i18n-js**: Translation management library
- **Supported Languages**: English (en), Spanish (es), German (de), Japanese (ja), Portuguese-BR (pt-BR)

### Logging & Debugging

- **react-native-logs**: ^5.5.0 (Advanced logging with file export)
- **expo-file-system/legacy**: Log file management
- **Debug Mode**: Toggle-able debug overlay with system info

### Other Expo Modules

- **Expo Constants**: ~18.0.10
- **Expo Dev Client**: ~6.0.16
- **Expo Device**: ~8.0.9 (Device info)
- **Expo Font**: ~14.0.9
- **Expo Linking**: ~8.0.8 (Deep linking and universal links)
- **Expo Splash Screen**: ~31.0.10
- **Expo Status Bar**: ~3.0.8
- **Expo System UI**: ~6.0.8

### Development Tools

- **ESLint**: ^9.25.0
- **eslint-config-expo**: ~10.0.0
- **eslint-config-prettier**: ^10.1.8
- **eslint-plugin-prettier**: ^5.5.4
- **Prettier**: ^3.6.2
- **prettier-plugin-tailwindcss**: ^0.5.14

### Testing

- **Jest**: ~29.7.0
- **jest-expo**: ~54.0.13
- **@testing-library/react-native**: ^13.3.3
- **@testing-library/jest-native**: ^5.4.3
- **@types/jest**: 29.5.14
- **Test Coverage**: 1,000+ unit tests across components, hooks, services, and utils

### Build & Configuration

- **EAS Build**: Configured (Project ID: 1137bc74-aad1-47c7-a987-8886ef0d9a68)
- **New Architecture**: Enabled (Fabric/TurboModules)
- **React Compiler**: Enabled (experimental)
- **Typed Routes**: Enabled (experimental)
- **react-native-nitro-modules**: ^0.31.4

---

## Folder Structure

```
wattr-app/
├── android/                       # Android native code
│   ├── app/
│   │   ├── build/                # Build artifacts
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── AndroidManifest.xml
│   │   │       ├── java/         # Java/Kotlin source
│   │   │       └── res/          # Android resources
│   │   └── build.gradle
│   ├── gradle/
│   └── settings.gradle
│
├── ios/                          # iOS native code
│   ├── Wattr/
│   │   ├── AppDelegate.swift
│   │   ├── Images.xcassets/
│   │   ├── Info.plist
│   │   ├── PrivacyInfo.xcprivacy
│   │   ├── SplashScreen.storyboard
│   │   ├── Wattr-Bridging-Header.h
│   │   └── Wattr.entitlements
│   ├── Wattr.xcodeproj/
│   ├── Wattr.xcworkspace/
│   ├── Podfile
│   └── Pods/
│
├── app/                          # Application screens (Expo Router)
│   ├── _layout.tsx              # Root layout with Stack navigator & auth routing
│   ├── +not-found.tsx           # 404 screen
│   ├── index.tsx                # Home screen (workout history with tab bar)
│   ├── login.tsx                # Login screen with form validation
│   ├── register.tsx             # Registration screen (10+ fields, native header)
│   ├── confirm-email.tsx        # Email confirmation with resend
│   ├── auth-callback.tsx        # Deep link handler for email confirmation
│   ├── profile.tsx              # User profile view/edit screen
│   ├── settings.tsx             # Settings (theme, language, logout, import, debug)
│   ├── about.tsx                # About screen with app info
│   ├── start-workout.tsx        # Workout setup (type, devices, route selection)
│   ├── workout-in-progress.tsx  # Active workout tracking with real-time data
│   ├── device-scan.tsx          # BLE device scanning screen
│   ├── hr-device-details.tsx    # HR device connection details
│   ├── fitness-machine-details.tsx # Fitness machine connection details
│   ├── manage-logs.tsx          # Log file management and export
│   └── workout-details/
│       └── [id].tsx             # Workout details (dynamic route)
│
├── components/                   # Reusable UI components (Atomic Design)
│   ├── atoms/                   # Basic building blocks
│   │   ├── Button/              # Reusable button (primary, secondary, danger)
│   │   ├── FormInput/           # Form input with icons and units
│   │   ├── FormSelect/          # Form select dropdown
│   │   ├── FormSelector/        # Form selector with modal
│   │   ├── Icon/                # Reusable icon wrapper
│   │   ├── InlineEdit/          # Inline editable text
│   │   ├── MetricCard/          # Metric display card
│   │   ├── PageIndicator/       # Page dots indicator
│   │   ├── Pressable/           # Custom pressable wrapper
│   │   ├── SelectButton/        # Button for triggering selections
│   │   ├── Spinner/             # Loading indicator
│   │   └── Typography/          # Text component with variants
│   │
│   ├── molecules/               # Simple component combinations
│   │   ├── BluetoothOffWarning/ # Bluetooth off state warning
│   │   ├── CalorieMethodSelector/ # Calorie calculation method selector
│   │   ├── ConnectionStatus/    # Connection/reconnection status
│   │   ├── DeviceCapabilities/  # Device capabilities display
│   │   ├── DeviceLinkingCard/   # Device link card with power/BPM display
│   │   ├── DeviceListItem/      # BLE device card
│   │   ├── ElevationChart/      # Elevation profile chart with progress
│   │   ├── ElevationControls/   # Elevation adjustment controls
│   │   ├── EmptyState/          # Empty state placeholder
│   │   ├── HeartRateChart/      # HR chart visualization
│   │   ├── HeartRateDisplay/    # Large BPM display with loading
│   │   ├── IconButton/          # Icon-only button
│   │   ├── LanguageSwitcher/    # Language selection component
│   │   ├── LogFileItem/         # Log file list item
│   │   ├── ModalSelector/       # Generic modal selector
│   │   ├── ResistanceControls/  # Resistance adjustment controls
│   │   ├── RouteCompletionCelebration/ # Route completion celebration
│   │   ├── RouteMap/            # Interactive route map with MapTiler
│   │   ├── ScanningIndicator/   # Scanning status indicator
│   │   ├── Selector/            # Generic selector component
│   │   ├── SensitivitySlider/   # Sensitivity adjustment slider
│   │   ├── StatCard/            # Statistic display card
│   │   ├── TabBar/              # Custom bottom tab bar
│   │   ├── ThemeSelector/       # Theme selection component
│   │   ├── WorkoutHistoryItem/  # Workout history card with swipe actions
│   │   └── WorkoutStats/        # Workout statistics display
│   │
│   ├── organisms/               # Feature-rich, complete sections
│   │   ├── DebugOverlay/        # Debug mode overlay with system info
│   │   ├── DeviceScanner/       # Complete scanning UI
│   │   ├── HeartRateMonitor/    # Complete monitoring UI
│   │   ├── PageLayout/          # Page layout with tab bar spacing
│   │   ├── ProfileForm/         # Complete profile form
│   │   ├── RouteSelector/       # Route selection interface
│   │   ├── WorkoutDataView/     # Workout in progress data views
│   │   │   ├── CyclingDataView.tsx     # Cycling metrics view
│   │   │   ├── HRDataView.tsx          # Heart rate view
│   │   │   └── RouteProgressView.tsx   # Route progress view
│   │   └── WorkoutDetails/      # Workout details components
│   │       ├── WorkoutHeader.tsx       # Workout header
│   │       ├── WorkoutStatsGrid.tsx    # Stats grid
│   │       ├── WorkoutCyclingData.tsx  # Cycling data
│   │       ├── WorkoutRouteSection.tsx # Route section
│   │       └── WorkoutHeartRateSection.tsx # HR section
│
├── hooks/                        # Custom React hooks
│   ├── auth/
│   │   ├── useAuth.ts                   # Authentication hook
│   │   ├── useAuthGuard.ts              # Route protection hook
│   │   └── __tests__/
│   ├── bluetooth/
│   │   ├── useBluetoothPermissions.ts   # Permission management
│   │   ├── useHeartRateMonitor.ts       # HR BLE connection logic
│   │   └── useFitnessMachine.ts         # Fitness machine BLE logic
│   ├── calories/
│   │   └── useCalorieCalculation.ts     # Calorie calculation hook
│   ├── debug/
│   │   ├── useDebugMode.ts              # Debug mode hook
│   │   └── __tests__/
│   ├── device/
│   │   ├── useOrientation.ts            # Device orientation hook
│   │   └── __tests__/
│   ├── heartRate/
│   │   └── useHeartRateZoneColor.ts     # Theme-aware HR zone colors
│   ├── localization/
│   │   └── useTranslation.ts            # i18n translation hook
│   ├── theme/
│   │   ├── useColors.ts                 # Theme-aware color palette hook
│   │   └── useTheme.ts                  # Theme management hook
│   ├── virtualRide/
│   │   ├── useVirtualRideEngine.ts      # Virtual ride engine hook
│   │   └── __tests__/
│   └── workouts/
│       ├── useActiveWorkout.ts          # Active workout management
│       ├── useWorkoutTimer.ts           # Workout timer hook
│       ├── useWorkoutList.ts            # Workout history from Supabase
│       ├── useWorkoutSync.ts            # Automatic workout sync to Supabase
│       └── __tests__/
│
├── providers/                    # React context providers
│   ├── DebugProvider.tsx         # Debug mode provider
│   ├── FitnessMachineProvider.tsx # Fitness machine BLE provider
│   ├── HeartRateProvider.tsx     # Heart rate BLE provider
│   ├── ThemeProvider.tsx         # Theme provider
│   └── TranslationProvider.tsx   # Localization provider
│
├── stores/                       # Zustand state stores
│   ├── auth/
│   │   └── authStore.ts         # Auth state management
│   ├── debug/
│   │   ├── debugStore.ts         # Debug mode store
│   │   └── __tests__/
│   ├── profile/
│   │   └── profileStore.ts      # Profile state with Supabase sync
│   ├── routes/
│   │   └── routesStore.ts       # Routes/GPX store
│   ├── settings/
│   │   ├── settingsStore.ts      # Settings store (mock devices, calorie method)
│   │   └── __tests__/
│   ├── theme/
│   │   └── themeStore.ts        # Theme state management
│   └── workouts/
│       ├── workoutsStore.ts      # Workouts store with MMKV persistence
│       └── __tests__/
│
├── services/                     # Business logic & services
│   ├── ble/
│   │   ├── HeartRateService/    # BLE heart rate monitor service
│   │   │   ├── index.ts         # Main service class
│   │   │   ├── typedefs.ts      # Type definitions
│   │   │   ├── constants.ts     # Constants & UUIDs
│   │   │   ├── utils.ts         # Utility functions
│   │   │   └── __tests__/       # Unit tests
│   │   ├── FitnessMachineService/ # Fitness machine BLE service
│   │   │   ├── index.ts
│   │   │   ├── typedefs.ts
│   │   │   ├── constants.ts
│   │   │   ├── utils.ts
│   │   │   └── __tests__/
│   │   ├── MockHeartRateDevice/ # Mock HR device for testing
│   │   │   ├── index.ts
│   │   │   └── __tests__/
│   │   └── MockFitnessMachineDevice/ # Mock fitness machine for testing
│   │       ├── index.ts
│   │       └── __tests__/
│   ├── api/                     # Vendor-agnostic API service layer
│   │   ├── interfaces/          # Service interfaces
│   │   │   ├── IAuthService.ts  # Auth service interface
│   │   │   ├── IProfileService.ts # Profile service interface
│   │   │   ├── IWorkoutService.ts # Workout service interface
│   │   │   ├── IRouteService.ts # Route service interface
│   │   │   └── types.ts         # Shared API types
│   │   ├── factory.ts           # Service factory (provider selection)
│   │   └── supabase/            # Supabase implementation
│   │       ├── SupabaseAuthService.ts # Auth implementation
│   │       ├── SupabaseProfileService.ts # Profile implementation
│   │       ├── SupabaseWorkoutService.ts # Workout implementation
│   │       ├── SupabaseRouteService.ts # Route implementation
│   │       ├── client.ts        # Supabase client configuration
│   │       ├── utils.ts         # Supabase utilities
│   │       └── __tests__/       # Implementation tests
│   ├── storage/
│   │   ├── mmkvStorage.ts       # MMKV storage utilities & Zustand adapters
│   │   ├── secureStorage.ts     # Secure storage with chunking
│   │   ├── syncQueue.ts         # Offline-first sync queue with retry logic
│   │   ├── logFileManager.ts    # Log file management
│   │   └── __tests__/
│
├── schemas/                      # Zod validation schemas
│   ├── loginSchema.ts           # Login form validation
│   ├── registerSchema.ts        # Registration form validation
│   ├── profileSchema.ts         # Profile form validation
│   └── __tests__/
│
├── utils/                        # Utility functions
│   ├── calories.ts              # Calorie calculation logic
│   ├── errors.ts                # Error codes and utilities
│   ├── fitFile.ts               # FIT file parsing (with Route creation)
│   ├── formatNumber.ts          # Number formatting utilities
│   ├── gpxParser.ts             # GPX file parsing
│   ├── haptics.ts               # Haptic feedback utilities
│   ├── heartRate.ts             # Heart rate zones and calculations
│   ├── logger.ts                # Logging utility
│   ├── navigation.ts            # Navigation utilities
│   ├── requestBlePermissions.ts # BLE permission utilities
│   ├── systemInfo.ts            # System information
│   ├── uuid.ts                  # RFC 4122 compliant UUID v4 generation
│   ├── wait.ts                  # Async wait utility
│   ├── workout.ts               # Workout utilities
│   ├── workoutHistory.ts        # Workout history utilities
│   ├── workoutMigration.ts      # One-time MMKV → Supabase migration
│   └── __tests__/               # Utility tests
│
├── i18n/                         # Internationalization
│   ├── config.ts                 # i18n configuration & setup
│   ├── storage.ts                # MMKV locale persistence
│   └── locales/                  # Translation files (200+ keys)
│       ├── en.ts                 # English (default)
│       ├── es.ts                 # Spanish
│       ├── de.ts                 # German
│       ├── ja.ts                 # Japanese
│       └── pt-BR.ts              # Portuguese (Brazil)
│
├── types/                        # TypeScript type definitions
│   ├── auth.ts                  # Authentication types
│   ├── env.d.ts                 # Environment variable types
│   ├── garmin-fitsdk.d.ts       # FIT SDK type declarations
│   ├── profile.ts               # Profile types
│   ├── route.ts                 # Route and virtual ride types
│   └── workout.ts               # Workout session types
│
├── config/                       # Configuration files
│   └── index.ts                 # App configuration (MapTiler, etc.)
│
├── constants/                    # Application constants
│   └── routes.ts                 # Route path constants
│
├── scripts/                      # Development scripts
│   ├── run-app.js                # Interactive app runner script
│   └── check-env.js              # Environment variable diagnostics
│
├── docs/                         # Documentation
│   ├── PROJECT_CONTEXT.md        # This file - comprehensive project guide
│   ├── DEVELOPMENT.md            # Development workflow
│   ├── SUPABASE_SETUP.md         # Supabase configuration guide
│   ├── SUPABASE_TROUBLESHOOTING.md # Common Supabase issues
│   ├── TEST_ENV_SETUP.md         # Test environment configuration
│   ├── ENV_SETUP_TROUBLESHOOTING.md # Environment variable debugging
│   ├── EMAIL_CONFIRMATION_DEEPLINK.md # Email confirmation setup
│   ├── UNIVERSAL_LINKS_SETUP.md  # Universal links configuration
│   ├── MAPLIBRE_SETUP.md         # MapLibre setup guide
│   ├── FITNESS_MACHINE_IMPLEMENTATION.md # Fitness machine details
│   └── FEATURE_IDEAS.md          # Future feature ideas
│
├── assets/                       # Static assets
│   └── images/
│       ├── adaptive-icon.png
│       ├── favicon.png
│       ├── icon.png
│       ├── splash-icon.png
│       └── maptiler-logo.png
│
├── __mocks__/                    # Jest mocks
│   └── react-native/
│
├── __tests__/                    # Global test files
│   └── utils/
│
├── .cursor/                      # Cursor AI configuration
│   └── rules                     # Project coding rules & conventions
├── app.config.js                 # Expo configuration (dynamic)
├── app.json.bak                  # Expo configuration backup
├── babel.config.js               # Babel configuration
├── eslint.config.js             # ESLint configuration
├── global.css                    # Global CSS styles
├── jest.config.js                # Jest configuration (inline in package.json)
├── jest.env.js                   # Jest environment setup
├── jest.mocks.js                 # Jest global mocks
├── jest.setup.js                 # Jest setup file
├── metro.config.js               # Metro bundler configuration
├── nativewind-env.d.ts           # NativeWind type declarations
├── package.json                  # NPM dependencies
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── DEVELOPMENT.md                # Development workflow documentation
└── README.md                     # Project documentation
```

---

## Database Schema & Architecture

### Supabase PostgreSQL Schema

Wattr uses a PostgreSQL database with three main tables:

**1. Workouts Table (`workouts`)**

- **UUID Strategy**: App-generated UUIDs (via `utils/uuid.ts`)
  - Enables offline-first workflow
  - Workouts created locally with immediate IDs
  - Synced to Supabase when online
- **Columns**: `id` (UUID), `user_id`, `type`, `title`, `description`, `status`, `start_time`, `end_time`, `duration`, `avg_hr`, `max_hr`, `min_hr`, `calories`, `device_name`, `avg_speed`, `max_speed`, `avg_cadence`, `max_cadence`, `avg_power`, `max_power`, `total_distance`, `elevation`, `fitness_device_name`, `route_id` (nullable FK), `route_name`, `route_distance_completed`, `virtual_ride_sensitivity`
- **Foreign Keys**: `user_id` references `auth.users`, `route_id` references `routes` (SET NULL on delete)
- **Indexes**: `user_id`, `start_time DESC`

**2. Workout Samples Table (`workout_samples`)**

- **Purpose**: Store HR and cycling samples as compact JSONB arrays
- **Performance**: Reduces row count by 2,160x (2 rows per workout instead of 4,320)
- **Columns**: `id` (UUID, DB-generated), `workout_id` (FK), `sample_type` ('heart_rate' | 'cycling'), `data` (JSONB), `sample_count`, `created_at`
- **Sample Formats**:
  - HR: `[[timestamp_ms, bpm], [timestamp_ms, bpm], ...]`
  - Cycling: `[[timestamp_ms, speed, cadence, power, distance], ...]`
- **Constraints**: `UNIQUE(workout_id, sample_type)` (one record per type per workout)
- **Foreign Keys**: `workout_id` references `workouts` (CASCADE on delete)
- **Indexes**: `workout_id`, `(workout_id, sample_type)`

**3. Routes Table (`routes`)**

- **UUID Strategy**: Database-generated UUIDs (via `DEFAULT gen_random_uuid()`)
  - Routes always created online (never offline)
  - Created when workout completes or FIT file imports
- **Columns**: `id` (UUID), `user_id`, `name`, `source` ('file' | 'url'), `source_identifier`, `total_distance`, `elevation_gain`, `elevation_loss`, `min_elevation`, `max_elevation`, `waypoints` (JSONB), `created_at`
- **Waypoint Format**: `[{lat, lon, elevation, distanceFromStart}, ...]`
- **Foreign Keys**: `user_id` references `auth.users`
- **Indexes**: `user_id`

**Row Level Security (RLS)**

All tables have RLS policies ensuring users can only access their own data:

- SELECT, INSERT, UPDATE, DELETE policies check `user_id = auth.uid()`
- Samples policies check via JOIN to `workouts` table

### UUID Generation Strategy

**Workouts**: App-generated (offline-first)

```typescript
import { generateUUID } from "@/utils/uuid";
const workoutId = generateUUID(); // RFC 4122 v4
```

**Routes**: Database-generated (online-only)

```sql
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ...
);
```

**Rationale:**

- Workouts need immediate IDs for offline sync queue
- Routes are created online (during workout save or FIT import)
- Consistent with offline-first architecture

---

## Navigation & Routing

### Routing System

Wattr uses **Expo Router** (v6), which provides file-based routing similar to Next.js. Routes are automatically generated based on the file structure in the `app/` directory. The app features a **custom bottom tab bar** for primary navigation.

### Navigation Architecture

**Bottom Tab Bar** (`components/molecules/TabBar/`)

- Custom-designed tab bar with 5 primary routes
- Routes: Home, Workouts (hidden), Start Workout, Settings, About
- Theme-aware styling with active route highlighting
- Safe area insets support for notched devices
- Smooth animations and haptic feedback

**Route Structure**

#### Root Layout (`app/_layout.tsx`)

- Uses `<Stack>` navigator from `expo-router`
- Wraps app with multiple providers:
  - `TranslationProvider` (i18n)
  - `ThemeProvider` (dark/light mode)
  - `DebugProvider` (debug mode)
  - `HeartRateProvider` (BLE HR state)
  - `FitnessMachineProvider` (BLE fitness machine state)
- Manages authentication flow and redirects
- Configures theme-aware StatusBar
- Native headers with "Back" button text

**Key Screens:**

1. **Authentication Flow**
   - `app/login.tsx` - User login with email/password (native header)
   - `app/register.tsx` - Registration with profile data (native header, icons, units)
   - `app/confirm-email.tsx` - Email verification with resend
   - `app/auth-callback.tsx` - Deep link handler for email confirmation

2. **Home** (`app/index.tsx`)
   - Route: `/`
   - Purpose: Workout history with bottom tab bar
   - Features: Swipeable workout cards, delete actions, empty state
   - Tab bar integration with 5 routes

3. **Profile** (`app/profile.tsx`)
   - Route: `/profile`
   - Purpose: View and edit user profile
   - Features: Inline editing, gender selector, measurement units

4. **Workout Screens**
   - `app/start-workout.tsx` - Workout setup (type, HR monitor, fitness machine, route)
   - `app/workout-in-progress.tsx` - Active workout with real-time data and maps
   - `app/workout-details/[id].tsx` - View completed workout details with charts

5. **Device Connection Flow**
   - `app/device-scan.tsx` - BLE device scanning screen
   - `app/hr-device-details.tsx` - HR device confirmation
   - `app/fitness-machine-details.tsx` - Fitness machine confirmation
   - Native headers with proper back navigation

6. **Settings** (`app/settings.tsx`)
   - Route: `/settings`
   - Purpose: Theme, language, calorie method, FIT import, logout, debug mode
   - Features: Mock device toggle (developer section)

7. **About** (`app/about.tsx`)
   - Route: `/about`
   - Purpose: App information and version

8. **Logs** (`app/manage-logs.tsx`)
   - Route: `/manage-logs`
   - Purpose: View, export, and clear log files

### Navigation Flow

```
Root Layout (Stack + Tab Bar)
  ├── Authentication Flow (No Tab Bar)
  │   ├── /login - Login screen
  │   ├── /register - Registration form
  │   ├── /confirm-email - Email confirmation
  │   └── /auth-callback - Deep link handler
  └── Authenticated App (Tab Bar Visible)
      ├── Tab Bar Navigation
      │   ├── / (Home) - Workout history
      │   ├── /start-workout - Start new workout
      │   ├── /settings - Settings
      │   └── /about - About
      ├── Device Flow (Stacked)
      │   ├── /device-scan - Scan for devices
      │   ├── /hr-device-details - HR device details
      │   └── /fitness-machine-details - Fitness machine details
      └── Workout Flow (Stacked)
          ├── /workout-in-progress - Active workout
          └── /workout-details/[id] - Workout details
```

**Authentication Routing Logic:**

- If not authenticated → Redirect to `/login`
- If authenticated but on auth screens → Redirect to `/`
- If email not confirmed → Redirect to `/confirm-email`
- Auto-login on app start if valid session exists
- Deep link handling for email confirmation (`/auth-callback`)

### Path Aliases

- `@/*` maps to project root (configured in `tsconfig.json`)
- Example: `import { HeartRateService } from "@/services/ble/HeartRateService"`

### Route Constants

All routes are centralized in `constants/routes.ts`:

```typescript
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  CONFIRM_EMAIL: "/confirm-email",
  AUTH_CALLBACK: "/auth-callback",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  ABOUT: "/about",
  START_WORKOUT: "/start-workout",
  WORKOUT_IN_PROGRESS: "/workout-in-progress",
  WORKOUT_DETAILS: (id: string) => `/workout-details/${id}`,
  DEVICE_SCAN: (deviceType) => `/device-scan?type=${deviceType}`,
  HR_DEVICE_DETAILS: "/hr-device-details",
  FITNESS_MACHINE_DETAILS: "/fitness-machine-details",
  MANAGE_LOGS: "/manage-logs",
} as const;
```

---

## Key Features

### 1. Authentication & User Management

**Location**: `app/login.tsx` + `app/register.tsx` + `app/confirm-email.tsx` + `app/auth-callback.tsx` + `hooks/auth/` + `services/supabase/auth.ts` + `stores/auth/`

**Functionality:**

- **Login**: Email/password authentication with Supabase Auth (native header)
- **Registration**: Account creation with profile data (gender, birth year, height, weight, etc.)
  - Native header with back button
  - Form inputs with icons (mail, lock, person, calendar, resize, scale, heart)
  - Measurement units displayed (cm, kg, bpm)
  - Gender selector with icons
  - `*` indicator for required fields
- **Email Confirmation**: Dedicated page with resend functionality
- **Deep Link Handler**: `/auth-callback` processes email confirmation links
- **Auto-login**: Automatic authentication on app start
- **Logout**: Secure session cleanup
- **Profile Management**: Create, read, update profile data
- **Route Protection**: Auth guards redirect unauthenticated users
- **Token Storage**: Secure token storage with automatic chunking for large tokens

**Architecture:**

- **Screens**: `login.tsx`, `register.tsx`, `confirm-email.tsx`, `auth-callback.tsx`, `profile.tsx`
- **Hooks**: `useAuth`, `useAuthGuard`
- **Services**: `services/supabase/auth.ts`, `services/supabase/profiles.ts`
- **Stores**: `authStore`, `profileStore`

**User Flow:**

1. **Registration** → Create account → Email confirmation page
2. **Email Link** → Click link → Deep link to `/auth-callback` → Redirect to login
3. **Login** → Authenticate → Load/create profile → Redirect to home
4. **Logout** → Clear tokens → Clear state → Redirect to login

**Security:**

- Supabase Row Level Security (RLS)
- Publishable keys (not deprecated anon keys)
- Secure token storage with encryption
- Automatic chunking for large tokens
- Email confirmation required

### 2. Bluetooth Device Management

**Location**: `app/device-scan.tsx` + `app/hr-device-details.tsx` + `app/fitness-machine-details.tsx` + `hooks/bluetooth/` + `services/ble/` + `providers/`

**Functionality:**

**Heart Rate Monitoring:**

- Scans for BLE devices advertising Heart Rate Service (UUID: `0000180d-0000-1000-8000-00805f9b34fb`)
- Connects to selected device with automatic reconnection
- Streams real-time heart rate data (BPM)
- Parses Heart Rate Measurement characteristic
- Detects sensor contact status
- Auto-stops scan after 8 seconds
- Persists connection across screens via HeartRateProvider

**Fitness Machine Tracking:**

- Scans for BLE devices advertising Fitness Machine Service (UUID: `00001826-0000-1000-8000-00805f9b34fb`)
- Parses Indoor Bike Data characteristic (UUID: `00002ad2-0000-1000-8000-00805f9b34fb`)
- Streams real-time metrics:
  - Speed (km/h)
  - Cadence (RPM)
  - Power (Watts)
  - Distance (meters)
- Automatic reconnection on disconnect
- Global state via FitnessMachineProvider

**Mock Devices for Testing:**

- **Mock HR Device**: Simulates 130 BPM consistently
- **Mock Fitness Machine**: Simulates 30km/h, 80RPM, 180W, distance tracking
- Toggle-able in Settings → Developer section
- Perfect for simulator testing without physical BLE devices
- 199 tests for MockHeartRateDevice
- 256 tests for MockFitnessMachineDevice

**Architecture:**

- **Screens**: `device-scan.tsx`, `hr-device-details.tsx`, `fitness-machine-details.tsx`
- **Providers**: `HeartRateProvider`, `FitnessMachineProvider`
- **Hooks**: `useBluetoothPermissions`, `useHeartRateMonitor`, `useFitnessMachine`
- **Services**: `HeartRateService/`, `FitnessMachineService/`, `MockHeartRateDevice/`, `MockFitnessMachineDevice/`

### 3. GPS Routes & Virtual Rides

**Location**: `hooks/virtualRide/useVirtualRideEngine.ts` + `utils/gpxParser.ts` + `stores/routes/routesStore.ts` + `types/route.ts`

**Functionality:**

**GPX Route Import:**

- Parse GPX files with waypoints, elevation, and distance data
- Calculate total distance, elevation gain/loss, min/max elevation
- Store routes in Zustand with MMKV persistence
- Route selection UI with preview

**Virtual Ride Engine:**

- Real-time position tracking based on power/speed data from fitness machine
- Accurate elevation gain calculation from route waypoints
- Distance progression along route path
- Current waypoint index tracking
- Elevation grade calculation (slope percentage)
- Remaining distance tracking
- Route completion detection

**Route Visualization:**

- Interactive map with MapLibre/MapTiler
- Outdoor, street, satellite, hybrid, topo, winter map styles
- Route line rendering (completed vs. remaining)
- Current position marker (arrow with bearing)
- Start/finish markers
- Elevation profile chart with progress
- Current grade display (red=uphill, green=downhill, gray=flat)
- Current elevation gain display
- Total route elevation display
- Fullscreen map mode with safe area support
- MapTiler attribution logo (required by ToS)

**Map Features:**

- **Auto-follow mode**: Camera tracks current position
- **Manual interaction**: Tap to disable auto-follow
- **Android fix**: Resolved camera reset issue with conditional bounds
- **Route progress**: Completed portion shown bolder
- **Distance banner**: Progress percentage overlay
- **Theme-aware colors**: Markers adapt to light/dark mode

**Architecture:**

- **Hooks**: `useVirtualRideEngine`
- **Utils**: `gpxParser.ts`
- **Stores**: `routesStore`
- **Components**: `RouteMap`, `ElevationChart`, `RouteSelector`
- **Types**: `Route`, `Waypoint`, `VirtualRideState`

### 4. Workout Tracking & Management

**Location**: `app/workout-in-progress.tsx` + `app/workout-details/[id].tsx` + `stores/workouts/workoutsStore.ts` + `hooks/workouts/` + `services/api/` + `types/workout.ts`

**Functionality:**

**Active Workout Tracking:**

- Real-time duration timer with pause/resume
- Heart rate monitoring with zones and colors
- Cycling metrics (speed, cadence, power, distance)
- Virtual ride progress (if route selected)
- Route map with current position
- Elevation chart with progress
- HR chart visualization
- Calorie calculation (MET-based, HR-based, or power-based)
- Auto-save on completion

**Workout Persistence:**

- **Offline-First**: Completed workouts queued locally with sync queue
- **Background Sync**: Automatic upload to Supabase when online
- **Retry Logic**: Exponential backoff for failed syncs
- **Supabase Storage**: Cloud-based workout history with RLS
- **Route Association**: Routes saved with workouts (not immediately on import)
- **UUID Generation**: App-generated UUIDs for offline support
- **Sample Storage**: JSONB format for efficient HR and cycling data storage
- **Legacy Migration**: One-time migration from MMKV to Supabase

**Workout History:**

- Fetched from Supabase with pagination
- Auto-refresh on screen focus (after completion/import)
- Swipeable workout cards with delete action
- Workout type icons and colors
- Duration, calories, average/max HR display
- Route information (name, distance, elevation) displayed
- Tap to view details

**Workout Details:**

- Editable title and description (inline editing)
- Complete statistics grid
- Heart rate chart with zones
- Cycling data (if applicable)
- Route map and elevation chart (waypoints fetched from database)
- Local-first display (shows sync queue data immediately)
- Silent refresh after sync completes
- Syncing banner during upload
- Export functionality (coming soon)
- Refactored into 6 organism components:
  - `WorkoutHeader`: Title, description, type, date
  - `WorkoutStatsGrid`: Duration, calories, HR stats
  - `WorkoutCyclingData`: Distance, elevation, speed, power, cadence
  - `WorkoutRouteSection`: Map and elevation chart
  - `WorkoutHeartRateSection`: HR chart
  - `index.tsx`: Orchestrator component

**Workout Types:**

- Strength
- HIIT
- Indoor Cycling (with virtual rides)
- Indoor Running
- Walk/Hike
- Fitness Activity (imported workouts)

**Architecture:**

- **Screens**: `start-workout.tsx`, `workout-in-progress.tsx`, `workout-details/[id].tsx`
- **Hooks**: `useActiveWorkout`, `useWorkoutTimer`, `useCalorieCalculation`, `useWorkoutList`, `useWorkoutSync`
- **Services**: `IWorkoutService`, `IRouteService`, `SupabaseWorkoutService`, `SupabaseRouteService`
- **Stores**: `workoutsStore`, `syncQueue`, `routesStore`
- **Components**: `WorkoutDataView/*`, `WorkoutDetails/*`, `WorkoutHistoryItem`
- **Types**: `WorkoutSession`, `WorkoutType`, `WorkoutStatus`, `HRSample`, `CyclingSample`

### 5. File Import & Export

**Location**: `utils/fitFile.ts` + `utils/gpxParser.ts` + `hooks/import/` + `app/settings.tsx`

**Functionality:**

**FIT File Import:**

- Import workouts from Garmin and other fitness devices
- Parse FIT files using `@garmin/fitsdk`
- Extract workout data, HR samples, cycling metrics, GPS tracks
- **Route Creation**: Automatically creates full `Route` objects from GPS/elevation data
- **Elevation Calculations**: Min/max elevation, gain/loss computed from waypoints
- **Auto-naming**: Routes named from workout title or auto-generated
- Convert to Wattr's workout format
- Sync directly to Supabase (with route association)
- Auto-redirect to workout details page after import

**GPX File Import:**

- Import GPS routes from GPX files
- Parse track segments and waypoints
- Calculate elevation gain/loss
- Calculate total distance
- Store routes locally (saved to database with completed workout)
- Displayed on start workout screen

**Export:**

- Log file export via sharing
- Workout export (planned)

**Architecture:**

- **Utils**: `fitFile.ts`, `gpxParser.ts`
- **Libraries**: `@garmin/fitsdk`, `fast-xml-parser`
- **Expo**: `expo-document-picker`, `expo-file-system`, `expo-sharing`

### 6. Settings & Configuration

**Location**: `app/settings.tsx` + `stores/settings/settingsStore.ts` + `stores/theme/themeStore.ts`

**Functionality:**

- **Account Management**: User info display and logout
- **Theme Selection**: Light, Dark, System (persisted with MMKV)
- **Language Selection**: 5 languages (persisted with MMKV)
- **Calorie Method**: MET-based, HR-based, Power-based
- **FIT File Import**: Import workouts from fitness devices
- **Developer Section**: (visible when logs exist)
  - Enable Mock Devices toggle
  - Manage Logs button
  - Debug Mode toggle
- **App Information**: Version, description

**Mock Devices:**

- Toggle-able mock HR and fitness machine devices
- Perfect for simulator testing
- Persistent setting via `settingsStore`

**Architecture:**

- **Screen**: `settings.tsx`
- **Stores**: `settingsStore`, `themeStore`
- **Components**: `ThemeSelector`, `LanguageSwitcher`, `CalorieMethodSelector`

### 7. Logging & Debugging

**Location**: `utils/logger.ts` + `services/storage/logFileManager.ts` + `app/manage-logs.tsx` + `providers/DebugProvider.tsx` + `components/organisms/DebugOverlay/`

**Functionality:**

**Logging System:**

- Advanced logging with `react-native-logs`
- Multiple log levels: error, warn, info, debug
- File-based logging with rotation
- Log file management (view, export, clear)
- Export logs via share sheet

**Debug Mode:**

- Toggle-able debug overlay
- System information display
- Device info (model, OS, version)
- App info (version, build)
- Network info
- BLE status
- Persistent debug mode setting

**Log Management:**

- View all log files
- Export individual logs
- Clear all logs button
- Haptic feedback on actions

**Architecture:**

- **Utils**: `logger.ts`, `systemInfo.ts`
- **Services**: `logFileManager.ts`
- **Screens**: `manage-logs.tsx`
- **Providers**: `DebugProvider`
- **Components**: `DebugOverlay`, `LogFileItem`
- **Stores**: `debugStore`

### 8. Number Formatting Standardization

**Location**: `utils/formatNumber.ts` + applied throughout app

**Functionality:**

- **formatNumber(value, decimalPlaces)**: Fixed decimal formatting
- **formatNumberAuto(value)**: Automatic decimal places based on magnitude
  - Integers: 0 decimals
  - < 10: 2 decimals
  - 10-100: 1 decimal
  - > = 100: 0 decimals
- Null/undefined/NaN handling
- 208 comprehensive unit tests

**Usage:**

- All workout detail displays
- Map distance banners
- Cycling metrics
- Elevation values
- Heart rate zones
- Consistent 2 decimal place rounding

**Coding Rule:**

- Mandatory usage per `.cursor/rules`
- Replaces all `.toFixed()` and `.toString()` calls
- Ensures consistent number display across app

---

## Service Layer

### BLE Services

**HeartRateService** (`services/ble/HeartRateService/`)

Modular BLE service for heart rate monitoring.

**Module Structure:**

- `index.ts` - Main service class
- `typedefs.ts` - Type definitions
- `constants.ts` - BLE UUIDs and configuration
- `utils.ts` - Parsing utilities
- `__tests__/` - Comprehensive unit tests

**Public API:**

```typescript
class HeartRateService {
  async startScan(onDeviceFound: (device: Device) => void): Promise<void>;
  stopScan(): void;
  isScanning(): boolean;
  async connectToDevice(
    deviceId: string,
    callbacks?: HeartRateServiceCallbacks,
  ): Promise<Device>;
  async disconnect(): Promise<void>;
  isConnected(): boolean;
  getConnectedDevice(): Device | null;
  async startStreaming(
    onData?: (data: HeartRateMeasurement) => void,
  ): Promise<void>;
}
```

**FitnessMachineService** (`services/ble/FitnessMachineService/`)

Modular BLE service for fitness machine tracking.

**Module Structure:**

- `index.ts` - Main service class
- `typedefs.ts` - Type definitions (`CyclingMetrics`, callbacks)
- `constants.ts` - Fitness Machine Service UUIDs
- `utils.ts` - Data parsing for Indoor Bike Data characteristic
- `__tests__/` - Comprehensive unit tests

**Public API:**

```typescript
class FitnessMachineService {
  async startScan(onDeviceFound: (device: Device) => void): Promise<void>;
  stopScan(): void;
  isScanning(): boolean;
  async connectToDevice(
    deviceId: string,
    callbacks?: FitnessMachineServiceCallbacks,
  ): Promise<Device>;
  async disconnect(): Promise<void>;
  isConnected(): boolean;
  getConnectedDevice(): Device | null;
  async startStreaming(onData?: (data: CyclingMetrics) => void): Promise<void>;
}
```

**Mock Device Services**

**MockHeartRateDevice** (`services/ble/MockHeartRateDevice/`)

- Simulates BLE HR device at 130 BPM
- Appears in device scan list
- Full lifecycle management
- 199 comprehensive unit tests

**MockFitnessMachineDevice** (`services/ble/MockFitnessMachineDevice/`)

- Simulates fitness machine with realistic metrics
- Speed: 30 km/h, Cadence: 80 RPM, Power: 180W
- Distance calculation during active workouts
- 256 comprehensive unit tests

### API Service Layer (Vendor-Agnostic)

**Architecture** (`services/api/`)

Wattr implements a vendor-agnostic service layer that allows easy switching between different backend providers (Supabase, Firebase, custom API) without changing consumer code.

**Key Components:**

1. **Service Interfaces** (`services/api/interfaces/`)
   - `IAuthService` - Authentication interface
   - `IProfileService` - Profile management interface
   - `IWorkoutService` - Workout persistence interface
   - `IRouteService` - Route persistence interface
   - `types.ts` - Shared types across all providers

2. **Factory Pattern** (`services/api/factory.ts`)
   - `getAuthService()` - Returns auth service instance
   - `getProfileService()` - Returns profile service instance
   - `getWorkoutService()` - Returns workout service instance
   - `getRouteService()` - Returns route service instance
   - Provider selection based on `config.api.provider`

3. **Supabase Implementation** (`services/api/supabase/`)
   - `SupabaseAuthService` - Implements `IAuthService`
   - `SupabaseProfileService` - Implements `IProfileService`
   - `SupabaseWorkoutService` - Implements `IWorkoutService`
   - `SupabaseRouteService` - Implements `IRouteService`
   - `client.ts` - Supabase client configuration
   - `utils.ts` - Supabase-specific utilities

**Usage Example:**

```typescript
import {
  getAuthService,
  getProfileService,
  getWorkoutService,
  getRouteService,
} from "@/services/api/factory";

const authService = getAuthService();
const profileService = getProfileService();
const workoutService = getWorkoutService();
const routeService = getRouteService();

// Use service methods
const { user, session } = await authService.login({ email, password });
const profile = await profileService.getProfile(userId);
const workouts = await workoutService.getWorkouts(userId, 50, 0);
const routes = await routeService.getRoutes(userId);
```

**Configuration:**

Set `EXPO_PUBLIC_API_PROVIDER` in `.env` file:

- `supabase` (default) - Use Supabase backend
- `firebase` (future) - Use Firebase backend
- `wattr-api` (future) - Use custom Wattr API backend

### Authentication Service Interface (`IAuthService`)

**Public API:**

```typescript
interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentSession(): Promise<AuthSession | null>;
  refreshSession(): Promise<AuthSession | null>;
  getCurrentUser(): Promise<AuthUser | null>;
  resendConfirmationEmail(email: string): Promise<void>;
  handleEmailConfirmation(url: string): Promise<AuthResponse | null>;
  onAuthStateChange(callback: AuthStateChangeCallback): UnsubscribeFn;
}
```

### Profile Service Interface (`IProfileService`)

**Public API:**

```typescript
interface IProfileService {
  createProfile(
    userId: string,
    email: string,
    profileData: Partial<UserProfile>,
  ): Promise<UserProfile>;
  getProfile(userId: string): Promise<UserProfile | null>;
  updateProfile(
    userId: string,
    updates: Partial<UserProfile>,
  ): Promise<UserProfile>;
  deleteProfile(userId: string): Promise<void>;
}
```

### Workout Service Interface (`IWorkoutService`)

**Public API:**

```typescript
interface IWorkoutService {
  createWorkout(
    userId: string,
    data: CreateWorkoutData,
  ): Promise<WorkoutSession>;
  getWorkout(workoutId: string): Promise<WorkoutWithSamples | null>;
  getWorkouts(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<{
    workouts: WorkoutSession[];
    total: number;
  }>;
  updateWorkout(
    workoutId: string,
    updates: Partial<WorkoutSession>,
  ): Promise<WorkoutSession>;
  deleteWorkout(workoutId: string): Promise<void>;
  getHRSamples(workoutId: string): Promise<HRSample[]>;
  getCyclingSamples(workoutId: string): Promise<CyclingSample[]>;
}
```

**Key Features:**

- **JSONB Sample Storage**: HR and cycling samples stored as compressed arrays in `workout_samples` table
- **Route Waypoint Fetching**: Automatically joins with `routes` table to populate `routeElevationProfile` and `routeCoordinates`
- **Pagination Support**: Limit/offset for workout history
- **Sample Conversion**: Converts between JSONB arrays and typed `HRSample`/`CyclingSample` objects

### Route Service Interface (`IRouteService`)

**Public API:**

```typescript
interface IRouteService {
  createRoute(userId: string, route: Route): Promise<Route>;
  getRoute(routeId: string): Promise<Route | null>;
  getRoutes(userId: string): Promise<Route[]>;
  deleteRoute(routeId: string): Promise<void>;
}
```

**Key Features:**

- **Waypoint Storage**: Full waypoint arrays stored as JSONB in database
- **Database-Generated UUIDs**: Supabase generates route IDs via `DEFAULT gen_random_uuid()`
- **On-Demand Fetch**: Routes loaded when needed on start workout screen

### Storage Services

**Secure Storage** (`services/storage/secureStorage.ts`)

- Platform-agnostic secure storage
- Automatic chunking for values >2048 bytes
- Transparent chunk reconstruction
- Web fallback to sessionStorage
- Used by Supabase client for token storage

**MMKV Storage** (`services/storage/mmkvStorage.ts`)

- Centralized MMKV storage management
- Zustand storage adapters
- Instance caching (singleton pattern)
- Pre-configured instances:
  - `theme`, `locale`, `userProfile`, `workouts`, `settings`, `userPreferences`, `appData`, `auth`

**Sync Queue** (`services/storage/syncQueue.ts`)

- **Offline-First Storage**: Queue completed workouts locally before sync
- **Status Tracking**: `PENDING`, `SYNCING`, `SYNCED`, `FAILED`
- **Exponential Backoff**: Retry failed syncs with increasing delays (5s, 10s, 20s, ...)
- **Max Retries**: Configurable retry limit (default: 5 attempts)
- **Automatic Cleanup**: Remove synced workouts after 5 seconds
- **MMKV Persistence**: Queue persists across app restarts
- **Stats API**: Get counts by status for UI indicators
- Zustand store with `addToQueue`, `updateStatus`, `removeFromQueue`, `getReadyForSync`, `clearSynced`, `clearAll`, `getStats`, `getWorkoutFromQueue`
- Used by `useWorkoutSync` hook for background sync

**Log File Manager** (`services/storage/logFileManager.ts`)

- Create, read, delete log files
- List all log files with metadata
- Clear all logs functionality
- 75 comprehensive unit tests

---

## UI Components (Atomic Design)

Wattr follows **Atomic Design** principles for component organization.

### Atoms (`components/atoms/`)

Basic building blocks - smallest, reusable UI elements.

**Key Atoms:**

- **Button**: Variants (primary, secondary, danger), sizes, fullWidth, disabled
- **FormInput**: Input with icons and measurement units (e.g., cm, kg, bpm)
- **FormSelect**: Dropdown select
- **FormSelector**: Modal-based selector
- **Icon**: Icon wrapper with size/color props
- **InlineEdit**: Inline editable text
- **MetricCard**: Metric display card
- **PageIndicator**: Page dots indicator
- **Pressable**: Custom pressable wrapper
- **SelectButton**: Selection trigger button
- **Spinner**: Loading indicator
- **Typography**: Text variants (display, title, subtitle, body, label, caption)

### Molecules (`components/molecules/`)

Simple combinations of atoms.

**Key Molecules:**

- **BluetoothOffWarning**: Bluetooth disabled warning
- **CalorieMethodSelector**: Calorie method selection modal
- **ConnectionStatus**: Connection state indicator (connecting, reconnecting)
- **DeviceCapabilities**: Device capabilities display
- **DeviceLinkingCard**: Device connection card with power/BPM display
- **DeviceListItem**: BLE device card for scanning list
- **ElevationChart**: Elevation profile with progress visualization
  - Two-layer chart (completed bolder, remaining thinner)
  - Current grade display (red/green/gray)
  - Current elevation gain
  - Total route elevation
- **ElevationControls**: Elevation adjustment controls
- **EmptyState**: Empty state placeholder
- **HeartRateChart**: HR chart with zone colors
- **HeartRateDisplay**: Large BPM display
- **IconButton**: Icon-only button
- **LanguageSwitcher**: Language selection modal
- **LogFileItem**: Log file list item
- **ModalSelector**: Generic modal selector
- **ResistanceControls**: Resistance adjustment
- **RouteCompletionCelebration**: Route completion UI
- **RouteMap**: Interactive map with MapLibre/MapTiler
  - MapTiler cloud integration (outdoor, street, satellite, hybrid, topo, winter)
  - Auto-follow mode with user interaction detection
  - Android camera reset fix (conditional bounds)
  - Route progress visualization
  - Arrow marker with bearing
  - Fullscreen mode with safe area support
  - MapTiler logo attribution
  - Theme-aware colors
- **ScanningIndicator**: Scanning status
- **Selector**: Generic selector component
- **SensitivitySlider**: Sensitivity adjustment slider
- **StatCard**: Statistic card
- **TabBar**: Custom bottom tab bar
  - 5 routes (Home, Workouts-hidden, Start, Settings, About)
  - Theme-aware styling
  - Active route highlighting
  - Safe area insets
  - 232 comprehensive unit tests
- **ThemeSelector**: Theme selection modal
- **WorkoutHistoryItem**: Workout card with swipe delete
- **WorkoutStats**: Workout statistics display

### Organisms (`components/organisms/`)

Feature-rich, complete UI sections.

**Key Organisms:**

- **DebugOverlay**: Debug mode overlay with system info
- **DeviceScanner**: Complete BLE scanning UI
- **HeartRateMonitor**: Complete HR monitoring UI
- **PageLayout**: Page layout with tab bar spacing and safe area insets
- **ProfileForm**: Complete profile editing form
- **RouteSelector**: Route selection interface
- **WorkoutDataView**: Workout in progress views
  - `CyclingDataView`: Cycling metrics view
  - `HRDataView`: Heart rate view
  - `RouteProgressView`: Route progress view with map and elevation
- **WorkoutDetails**: Workout details components
  - `WorkoutHeader`: Title, description, type, date
  - `WorkoutStatsGrid`: Duration, calories, HR stats
  - `WorkoutCyclingData`: Cycling data display
  - `WorkoutRouteSection`: Map and elevation chart
  - `WorkoutHeartRateSection`: HR chart visualization

### Design System & Theming

**Wattr implements a complete dark/light theme system with NativeWind + Zustand + MMKV.**

**Theme Architecture:**

```
ThemeProvider (providers/ThemeProvider.tsx)
  ↓
Theme Store (stores/theme/themeStore.ts) - Zustand + MMKV persistence
  ↓
useTheme Hook (hooks/theme/useTheme.ts) - Easy access in components
  ↓
NativeWind Dark Mode - Automatic class switching (dark:*)
```

**Color Palette:**

| Element        | Light Mode | Dark Mode        |
| -------------- | ---------- | ---------------- |
| Background     | `#FFFFFF`  | `#0C0D10`        |
| Secondary Bg   | `#F5F5F5`  | `#121318`        |
| Primary Accent | `#00E1A9`  | `#00E1A9` (same) |
| Highlights     | `#FF8F00`  | `#FFA800`        |
| Text Primary   | `#1A1A1A`  | `#FFFFFF`        |
| Text Secondary | `#555555`  | `#A0A0A0`        |

**Usage in Components:**

**Option 1: useColors Hook (Recommended)**

```tsx
import { useColors } from "@/hooks/theme/useColors";

const colors = useColors();

<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.text.primary }}>Themed text</Text>
</View>;
```

**Available colors:**

- `colors.background`, `colors.secondary`, `colors.card`
- `colors.primary`, `colors.accent`
- `colors.text.primary/secondary/tertiary`
- `colors.border.light/medium`
- `colors.status.success/warning/error/info`

**Option 2: Tailwind Classes**

```tsx
<View className="bg-background dark:bg-background-dark">
  <Typography variant="title" color="primary">
    Title
  </Typography>
</View>
```

**Option 3: Theme Control**

```tsx
const { isDark, theme, mode, toggleTheme, setTheme } = useTheme();

<Button onPress={toggleTheme}>Toggle Theme</Button>
<Button onPress={() => setTheme("dark")}>Dark Mode</Button>
```

**Theme Modes:**

- **Light**: Fixed light theme
- **Dark**: Fixed dark theme
- **System** (default): Follows device settings

---

## Internationalization (i18n)

### Overview

Wattr supports 5 languages using `expo-localization` and `i18n-js`. The app automatically detects the user's device language.

**Supported Languages:**

- 🇺🇸 English (en) - Default
- 🇪🇸 Spanish (es)
- 🇩🇪 German (de)
- 🇯🇵 Japanese (ja)
- 🇧🇷 Portuguese (pt-BR)

### Architecture

```
i18n/
├── config.ts              # i18n setup & initialization
├── storage.ts             # MMKV locale persistence
└── locales/
    ├── en.ts              # English translations (base, 200+ keys)
    ├── es.ts              # Spanish translations
    ├── de.ts              # German translations
    ├── ja.ts              # Japanese translations
    └── pt-BR.ts           # Portuguese (Brazil) translations
```

### Translation Keys Organization

Keys are organized by feature/namespace (200+ keys total):

```
common.*           # Shared UI labels (cancel, confirm, save, back, etc.)
navigation.*       # Navigation labels (deviceSelection, hrDeviceDetails, etc.)
auth.*             # Authentication (60+ keys)
validation.*       # Form validation (45+ keys)
profile.*          # Profile management
bluetooth.*        # Bluetooth strings
heartRate.*        # Heart rate monitoring
workouts.*         # Workout tracking and history
routes.*           # Route and virtual ride strings
settings.*         # Settings (enableMockDevices, calorieMethod, etc.)
permissions.*      # Permission messages
errors.*           # Error messages
logs.*             # Log management (clearAll, clearAllConfirm, etc.)
```

### Using Translations

```typescript
import { useTranslation } from "@/hooks/localization/useTranslation";

export function MyComponent() {
  const { t, locale, changeLocale } = useTranslation();

  return (
    <View>
      <Typography>{t("bluetooth.connecting")}</Typography>
      <Typography>{t("common.back")}</Typography>
      <Button onPress={() => changeLocale("es")}>Español</Button>
    </View>
  );
}
```

**Available Hook Methods:**

- `t(key)` - Translate a key (type-safe with autocomplete)
- `locale` - Current locale code
- `changeLocale(locale)` - Switch language
- `isLocale(locale)` - Check if locale is active

---

## Code Organization Conventions

### Service/Module Organization

For complex services, follow this modular structure:

```
services/[category]/[ServiceName]/
  ├── index.ts           # Main class/service implementation
  ├── typedefs.ts        # All TypeScript types and interfaces
  ├── constants.ts       # Constants, configs, magic numbers
  ├── utils.ts           # Pure utility functions (testable independently)
  └── __tests__/         # Unit tests
      ├── index.test.ts  # Tests for main service
      └── utils.test.ts  # Tests for utility functions
```

### Component Organization (Atomic Design)

```
components/
  ├── atoms/              # Basic building blocks
  ├── molecules/          # Simple combinations
  ├── organisms/          # Complex feature sections
  └── templates/          # Page layouts (optional)
```

### Custom Hooks Organization

```
hooks/
  └── [feature]/
      ├── use[HookName].ts
      └── use[HookName].test.ts
```

**Hook Guidelines:**

- Prefix with `use` (React convention)
- One hook per file
- Return an object with state and actions
- Include comprehensive JSDoc
- Add unit tests for complex hooks

---

## Platform-Specific Configurations

### Android (`app.json`)

```json
"android": {
  "adaptiveIcon": {
    "backgroundColor": "#E6F4FE"
  },
  "edgeToEdgeEnabled": true,
  "package": "com.wattr.app",
  "permissions": [
    "android.permission.BLUETOOTH",
    "android.permission.BLUETOOTH_ADMIN",
    "android.permission.BLUETOOTH_CONNECT"
  ]
}
```

### iOS (`app.json`)

```json
"ios": {
  "supportsTablet": true,
  "bundleIdentifier": "com.wattr.app",
  "infoPlist": {
    "CFBundleAllowMixedLocalizations": true
  }
}
```

### Web (`app.json`)

```json
"web": {
  "output": "static",
  "favicon": "./assets/images/favicon.png"
}
```

---

## Development Scripts

```json
{
  "start": "expo start",
  "run": "node ./scripts/run-app.js",
  "android": "expo run:android --device",
  "ios": "expo run:ios --device",
  "web": "expo start --web",
  "lint": "expo lint",
  "tsc": "tsc",
  "test": "jest --silent",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "prebuild": "expo prebuild",
  "prebuild:clean": "expo prebuild --clean",
  "pre-commit": "npx prettier --write . && npm run lint && npm run tsc && npm test"
}
```

---

## Testing

### Test Infrastructure

- **Jest**: ~29.7.0 with jest-expo preset
- **React Native Testing Library**: ^13.3.3
- **Coverage**: 1,000+ unit tests across the codebase

### Test Files

```
__tests__/                    # Global test files
components/*//__tests__/      # Component tests (Atomic Design hierarchy)
hooks/*//__tests__/           # Hook tests
schemas/__tests__/            # Schema validation tests
services/*//__tests__/        # Service tests (BLE, storage, Supabase)
stores/*//__tests__/          # Store tests (Zustand)
utils/__tests__/              # Utility function tests
```

### Key Test Suites

- **TabBar**: 232 tests
- **MockHeartRateDevice**: 199 tests
- **MockFitnessMachineDevice**: 256 tests
- **formatNumber**: 208 tests
- **SettingsStore**: 100 tests
- **LogFileManager**: 75 tests
- **BLE Services**: Comprehensive mock tests
- **Auth/Profile**: Integration tests

---

## Notes for AI Code Generation

### Current Architecture Patterns

1. **Service Layer**: Business logic in separate `services/` directory
2. **Component Reusability**: Atomic Design (atoms → molecules → organisms)
3. **File-based Routing**: Screens in `app/` with typed routes
4. **TypeScript First**: Strict mode enabled
5. **Functional Components**: No class components
6. **Custom Hooks**: Business logic extraction
7. **Zustand + MMKV**: State management with persistence
8. **Theme System**: NativeWind + custom useColors hook
9. **i18n**: 5 languages, 200+ translation keys

### Naming Conventions

- **Files**: PascalCase for components (e.g., `Button.tsx`)
- **Files**: camelCase for services (e.g., `HeartRateService.ts`)
- **Routes**: lowercase for routes (e.g., `index.tsx`, `start-workout.tsx`)
- **Styles**: camelCase (e.g., `containerStyle`)
- **Constants**: `SCREAMING_SNAKE_CASE`

### Dependencies to Consider

- Expo SDK 54 compatible
- React Native 0.81.5
- React 19.1.0
- New Architecture enabled
- MapLibre Native 10.4.0
- Garmin FIT SDK 21.178.0

### Common Patterns

```typescript
// Screen component pattern
export default function ScreenName() {
  const { t } = useTranslation();
  const colors = useColors();
  const [state, setState] = useState<Type>(initialValue);

  useEffect(() => {
    // Setup/cleanup
  }, [dependencies]);

  return (
    <PageLayout>
      <View style={{ backgroundColor: colors.background }}>
        <Typography>{t("key")}</Typography>
      </View>
    </PageLayout>
  );
}
```

---

## Future Expansion Ideas

- Advanced workout analytics and insights
- Social features (sharing workouts, challenges)
- Training plans and programs
- Wearable device integrations (Apple Watch, Garmin)
- Offline mode improvements
- Password reset flow
- Social authentication (Google, Apple, Facebook)
- Multi-factor authentication (MFA)
- Profile picture upload
- Additional BLE services (cadence sensors, etc.)
- More map styles and customization
- Workout export to third-party services
- Indoor trainer resistance control

---

## Documentation

For detailed setup and troubleshooting, refer to:

- **`PROJECT_CONTEXT.md`** (this file) - Comprehensive project documentation
- **`DEVELOPMENT.md`** - Development workflow
- **`SUPABASE_SETUP.md`** - Supabase configuration and database schema
- **`SUPABASE_TROUBLESHOOTING.md`** - Common Supabase issues
- **`TEST_ENV_SETUP.md`** - Test environment configuration
- **`ENV_SETUP_TROUBLESHOOTING.md`** - Environment variable debugging
- **`EMAIL_CONFIRMATION_DEEPLINK.md`** - Email confirmation setup
- **`UNIVERSAL_LINKS_SETUP.md`** - Universal links configuration
- **`MAPLIBRE_SETUP.md`** - MapLibre setup guide
- **`FITNESS_MACHINE_IMPLEMENTATION.md`** - Fitness machine details
- **`FEATURE_IDEAS.md`** - Future feature ideas
- **`.cursor/rules`** - Coding guidelines and best practices

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Maintainer**: Wattr Team
