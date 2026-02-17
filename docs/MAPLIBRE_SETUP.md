# MapLibre Map Setup Guide

This app uses [MapLibre GL Native](https://github.com/maplibre/maplibre-react-native) for displaying GPX routes on interactive maps. MapLibre is an open-source mapping library that doesn't require API keys for basic usage.

## Why MapLibre?

- **Open Source**: Free and community-driven
- **No API Keys Required**: Works out of the box with OpenStreetMap tiles
- **Privacy-Focused**: No tracking or data collection
- **Flexible**: Can use various tile sources
- **Cross-Platform**: Works on iOS, Android, and Web

## Installation

The package is already included in the project dependencies:

```json
"@maplibre/maplibre-react-native": "^10.4.0"
```

To install:

```bash
npm install
```

## Setup Instructions

### 1. Rebuild Your App

After installing, you need to rebuild your app for native modules:

```bash
# Clean prebuild
npx expo prebuild --clean

# Then build for your platform
npx expo run:android
# or
npx expo run:ios
```

### 2. Using Custom Map Styles (Optional)

By default, the app uses the free MapLibre demo tiles. You can customize the map style by modifying the `styleURL` in the `RouteMap` component:

```tsx
<MapLibreGL.MapView
  styleURL="https://demotiles.maplibre.org/style.json"
  // ... other props
/>
```

#### Alternative Free Tile Sources:

1. **Maptiler** (requires free API key)
   - Sign up at https://www.maptiler.com/
   - Use style URL: `https://api.maptiler.com/maps/streets/style.json?key=YOUR_API_KEY`

2. **MapBox** (if you have an account)
   - Use style URL: `mapbox://styles/mapbox/streets-v11`
   - Requires setting access token

3. **Custom OpenStreetMap Tiles**
   - You can host your own tile server
   - Use any compatible tile source URL

### 3. Configuration in Code

The RouteMap component is configured to use MapLibre in `/components/molecules/RouteMap/index.tsx`:

```tsx
import MapLibreGL from "@maplibre/maplibre-react-native";

// No access token needed for open tiles
MapLibreGL.setAccessToken(null);
```

## Features

The RouteMap component supports:

- ✅ Display GPX routes as lines on the map
- ✅ Show start/finish markers
- ✅ Track current position during workout
- ✅ Auto-follow mode to track rider position
- ✅ Show completed vs remaining route portions
- ✅ Interactive map with pan and zoom
- ✅ Works offline (with cached tiles)

## Troubleshooting

### Map Not Showing or Blank Screen

1. ✅ Make sure you've run `npx expo prebuild --clean`
2. ✅ Verify the app rebuilt completely
3. ✅ Check that Metro bundler restarted
4. ✅ Try clearing cache: `npx expo start -c`

### Build Errors After Installation

#### iOS:

```bash
cd ios && pod install && cd ..
npx expo run:ios
```

#### Android:

```bash
cd android && ./gradlew clean && cd ..
npx expo run:android
```

### Map Tiles Not Loading

- ✅ Check internet connection
- ✅ Verify the styleURL is correct
- ✅ Try using the default demo tiles first
- ✅ Check console for network errors

## Customization

### Changing Map Style

Edit `/components/molecules/RouteMap/index.tsx`:

```tsx
<MapLibreGL.MapView
  styleURL="YOUR_CUSTOM_STYLE_URL"
  // ...
/>
```

### Styling Markers and Routes

The component uses dynamic colors from your theme:

```tsx
// Route line color
lineColor: colors.primary;

// Marker colors
backgroundColor: colors.status.warning; // Current position
backgroundColor: "#22c55e"; // Start (green)
backgroundColor: "#ef4444"; // Finish (red)
```

## Documentation

- [MapLibre React Native Documentation](https://maplibre.org/maplibre-react-native/)
- [MapLibre GL JS Docs](https://maplibre.org/maplibre-gl-js/docs/)
- [GitHub Repository](https://github.com/maplibre/maplibre-react-native)
- [OpenStreetMap](https://www.openstreetmap.org/)

## Migration from Google Maps

If you're migrating from `react-native-maps`:

1. ✅ Remove Google Maps API keys from environment variables
2. ✅ Update `app.config.js` to remove Google Maps configuration
3. ✅ No need to set up API keys or billing
4. ✅ MapLibre uses different coordinate format: `[longitude, latitude]` instead of `{latitude, longitude}`

## Privacy & Legal

- MapLibre is MIT licensed
- Default tiles are provided by MapLibre for demo purposes
- OpenStreetMap data is © OpenStreetMap contributors
- For production apps with high usage, consider hosting your own tiles or using a commercial provider
