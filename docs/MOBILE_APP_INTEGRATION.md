# JamboScript Mobile App Integration Guide

This document explains how to embed the JamboScript docs in a mobile WebView and communicate between the web content and native app.

## Overview

The JamboScript docs site is optimized for WebView embedding with:
- Responsive mobile-first design
- Safe area insets for notches/gesture navigation
- WebView communication bridge
- Touch-optimized interactions
- No pull-to-refresh interference

## Quick Start with Capacitor (Recommended)

### 1. Create Your Capacitor App

```bash
# Create a new directory for your mobile app
mkdir jamboscript-app && cd jamboscript-app

# Initialize npm and install Capacitor
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android

# Initialize Capacitor
npx cap init "JamboScript" "org.jamboscript.app" --web-dir=www
```

### 2. Configure Capacitor

Update `capacitor.config.ts`:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.jamboscript.app',
  appName: 'JamboScript',
  webDir: 'www',
  
  // Option A: Load from remote URL (recommended for updates)
  server: {
    url: 'https://jamboscript.org',
    cleartext: false, // Only allow HTTPS
  },
  
  // Option B: Bundle locally (for offline support)
  // Comment out the server block above and copy built files to www/
  
  ios: {
    backgroundColor: '#0F0D2E',
    contentInset: 'automatic',
    allowsLinkPreview: false,
    scrollEnabled: true,
  },
  
  android: {
    backgroundColor: '#0F0D2E',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // Set true for development
  },
  
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0F0D2E',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0F0D2E',
    },
  },
};

export default config;
```

### 3. Add Native Platforms

```bash
# Add iOS and Android
npx cap add ios
npx cap add android
```

### 4. Set Up the Web-to-Native Bridge

Install the Capacitor plugins you'll need:

```bash
npm install @capacitor/status-bar @capacitor/splash-screen @capacitor/app @capacitor/haptics
```

Create `www/bridge.js` (or integrate into your web app):

```javascript
// This script runs in the WebView and communicates with Capacitor
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// Check if running in Capacitor
export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform(); // 'ios', 'android', or 'web'

// Handle back button on Android
if (isNative) {
  App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      App.exitApp();
    }
  });
}

// Haptic feedback for interactions
export async function vibrate(style = 'medium') {
  if (!isNative) return;
  
  const styles = {
    light: ImpactStyle.Light,
    medium: ImpactStyle.Medium,
    heavy: ImpactStyle.Heavy,
  };
  
  await Haptics.impact({ style: styles[style] || ImpactStyle.Medium });
}

// Call this when a challenge is completed
export async function onChallengeComplete() {
  await vibrate('medium');
}

// Call this when a chapter is completed  
export async function onChapterComplete() {
  await vibrate('heavy');
}
```

### 5. For Offline/Bundled Mode

If you want to bundle the JamboScript docs for offline use:

```bash
# In your jamboscript-docs directory
cd /path/to/jamboscript-docs
npm run build

# Copy the built files to your Capacitor app
cp -r out/* /path/to/jamboscript-app/www/
```

Then update `capacitor.config.ts` to remove the `server.url` option.

### 6. Build and Run

```bash
# Sync web files to native projects
npx cap sync

# Open in Xcode (iOS)
npx cap open ios

# Open in Android Studio (Android)
npx cap open android

# Or run directly
npx cap run ios
npx cap run android
```

### 7. Integrate Bridge in JamboScript Docs

Update your JamboScript components to use the bridge. In `src/lib/webview-bridge.ts`, the existing code already supports Capacitor. You can enhance it:

```typescript
// In your React components
import { isWebView, notifyChallengeComplete } from '@/lib/webview-bridge';

// When challenge is solved
const handleSuccess = () => {
  notifyChallengeComplete(chapterId, challengeId, true);
  
  // Capacitor haptics (if available)
  if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform()) {
    import('@capacitor/haptics').then(({ Haptics, ImpactStyle }) => {
      Haptics.impact({ style: ImpactStyle.Medium });
    });
  }
};
```

## Project Structure for Capacitor App

```
jamboscript-app/
├── capacitor.config.ts
├── package.json
├── www/                    # Web content (copy from jamboscript-docs/out)
│   ├── index.html
│   ├── sw/
│   ├── en/
│   └── ...
├── ios/                    # iOS native project
│   └── App/
├── android/                # Android native project
│   └── app/
└── src/                    # Optional: custom native code
```

## Useful Capacitor Plugins

```bash
# Status bar control
npm install @capacitor/status-bar

# Splash screen
npm install @capacitor/splash-screen

# App lifecycle events
npm install @capacitor/app

# Haptic feedback
npm install @capacitor/haptics

# Local notifications (for reminders)
npm install @capacitor/local-notifications

# Share functionality
npm install @capacitor/share

# Store user progress
npm install @capacitor/preferences
```

### Example: Save Progress with Preferences

```typescript
import { Preferences } from '@capacitor/preferences';

// Save progress
export async function saveProgress(data: { chapter: string; completed: boolean }) {
  await Preferences.set({
    key: 'jamboscript_progress',
    value: JSON.stringify(data),
  });
}

// Load progress
export async function loadProgress() {
  const { value } = await Preferences.get({ key: 'jamboscript_progress' });
  return value ? JSON.parse(value) : null;
}
```

## iOS Configuration

Update `ios/App/App/Info.plist` for App Store:

```xml
<key>CFBundleDisplayName</key>
<string>JamboScript</string>
<key>CFBundleName</key>
<string>JamboScript</string>
<key>UIStatusBarStyle</key>
<string>UIStatusBarStyleLightContent</string>
<key>UIViewControllerBasedStatusBarAppearance</key>
<false/>
```

## Android Configuration

Update `android/app/src/main/res/values/styles.xml`:

```xml
<style name="AppTheme" parent="Theme.AppCompat.NoActionBar">
    <item name="android:statusBarColor">#0F0D2E</item>
    <item name="android:navigationBarColor">#0F0D2E</item>
    <item name="android:windowLightStatusBar">false</item>
</style>
```

## Message Types

### Web → Native

| Type | Payload | Description |
|------|---------|-------------|
| `navigation` | `{ path, title, timestamp }` | User navigated to a new page |
| `challenge_complete` | `{ chapterId, challengeId, success, timestamp }` | User completed a coding challenge |
| `chapter_complete` | `{ chapterId, timestamp }` | User finished a chapter |
| `progress` | `{ chaptersCompleted, totalChapters, currentChapter? }` | Progress update |
| `locale` | `{ locale }` | User changed language (sw/en) |
| `error` | `{ error, details?, timestamp }` | An error occurred |

### Native → Web

Send messages to the web app by calling `window.onNativeMessage({ type, payload })`:

| Type | Payload | Description |
|------|---------|-------------|
| `theme` | `{ dark: boolean }` | Change theme mode |
| `locale` | `{ locale: 'sw' \| 'en' }` | Change language |
| `navigate` | `{ path: string }` | Navigate to a specific page |

## Deep Linking

Support deep links in your mobile app to navigate directly to content:

| Path Pattern | Description |
|--------------|-------------|
| `/sw` or `/en` | Home page in specific language |
| `/sw/hadithi` or `/en/hadithi` | Story chapters list |
| `/sw/hadithi/1` | Specific chapter |
| `/sw/cheza` | Practice/playground |
| `/sw/mzazi` | Parent guide |

## Recommended App Settings

### Minimum Requirements
- iOS 13.0+
- Android API 24+ (Android 7.0)
- WebView with JavaScript enabled
- DOM Storage enabled

### Permissions (if needed)
- Internet access
- Audio playback (for narration)

### Offline Support
The site uses static export, so you could bundle it in your app for offline access:

1. Build the docs: `npm run build`
2. Copy the `out/` folder to your app's assets
3. Load from local assets instead of remote URL

## Styling Considerations

The JamboScript theme colors for your native app:

```
Primary (Deep Purple): #1E1B4B
Background (Deep): #0F0D2E
Accent (Yellow): #FACC15
Success (Green): #22C55E
Text (Light): #F5F3FF
```

## Testing the Bridge

You can test the WebView bridge in a browser console:

```javascript
// Simulate receiving a message from native
window.onNativeMessage({ type: 'locale', payload: { locale: 'en' } });

// Listen for messages to native (for debugging)
window.addEventListener('webview-message', (e) => {
  console.log('Would send to native:', e.detail);
});
```
