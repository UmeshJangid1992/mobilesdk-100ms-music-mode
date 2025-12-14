# CLAUDE.md

This file provides comprehensive guidance to Claude Code when working with the 100ms Flutter SDK repository.

## Project Overview

This is the official **100ms Flutter SDK** repository, providing real-time audio/video conferencing, interactive live streaming, and chat capabilities for Flutter applications. The repository contains two main packages and multiple sample applications demonstrating various implementation patterns.

### Repository Structure

```
100ms-flutter/
├── packages/
│   ├── hmssdk_flutter/          # Core SDK package (v1.11.0)
│   │   ├── android/             # Android platform code (Kotlin)
│   │   ├── ios/                 # iOS platform code (Swift)
│   │   ├── lib/                 # Dart SDK implementation
│   │   └── example/             # Full-featured example app
│   │
│   └── hms_room_kit/            # Prebuilt UI package (v1.2.0)
│       ├── android/             # Android platform integration
│       ├── ios/                 # iOS platform integration
│       ├── lib/                 # Prebuilt UI components
│       └── example/             # Prebuilt UI example
│
└── sample apps/                 # 11 different sample implementations
    ├── bloc/                    # BLoC pattern example
    ├── getx/                    # GetX state management
    ├── mobx/                    # MobX state management
    ├── riverpod/                # Riverpod state management
    ├── flutter-quickstart-app/  # Simple quickstart
    ├── hms-callkit-app/         # CallKit integration
    ├── one_to_one_callkit/      # 1-to-1 calling
    ├── flutter-audio-room-quickstart/
    ├── flutter-hls-quickstart/
    ├── flutterflow-prebuilt-quickstart/
    └── flutter-meet/
```

## Development Environment

### Required Tools & Versions

#### Minimum Configuration
- **Flutter**: 3.24.0 or higher
- **Dart**: 2.16.0 or higher
- **Android**:
  - Android Studio with Android SDK
  - API Level: 24 (Android 7.0) minimum
  - Java: JDK 17 or higher
  - Kotlin: 2.0.21 or higher
  - Android Gradle Plugin (AGP): 8.9.0 or higher
  - Gradle: 8.10 or higher
  - NDK: r28 (27.2.12479018) or higher
- **iOS**:
  - macOS with Xcode 12 or higher
  - iOS 12.0+ deployment target
  - CocoaPods

#### Recommended Configuration
- **Flutter**: 3.27.0 or higher (latest stable)
- **Android API Level**: 35 or 36 (for 16KB page size support)
- **iOS**: 16.0+ deployment target
- **Xcode**: 15 or higher

### Flutter & Dart Setup

The repo uses Flutter's stable channel. Ensure your Flutter installation is up to date:

```bash
flutter --version
flutter doctor -v
```

## Package Details

### 1. hmssdk_flutter (Core SDK)

**Location**: `packages/hmssdk_flutter/`

**Purpose**: Low-level Flutter plugin providing native platform integrations for 100ms video/audio SDK.

**Key Features**:
- Real-time audio/video conferencing
- Interactive live streaming (HLS, RTMP)
- Recording (Server, Browser, HLS)
- Picture-in-Picture (PiP) mode
- CallKit & VoIP support
- Screen sharing (Android & iOS)
- Audio sharing (Android 10+)
- Chat messaging (broadcast, group, direct)
- Role-based permissions
- Session store & metadata
- Network quality monitoring
- Audio output routing (Android)
- Active speaker detection
- Video track management

**Platform Code**:
- **Android**: `android/src/main/kotlin/` - Kotlin implementation using 100ms Android SDK
- **iOS**: `ios/Classes/` - Swift implementation using 100ms iOS SDK
- **Dart**: `lib/` - Platform channel interfaces and Dart models

**Native Dependencies**:
- Android: `live.100ms:android-sdk`, `live.100ms:video-view`, `live.100ms:hls-player`
- iOS: 100ms iOS SDK via CocoaPods

**Important Files**:
- `lib/assets/sdk-versions.json` - Native SDK version configuration
- `pubspec.yaml` - Flutter package configuration
- `android/build.gradle` - Android build configuration
- `ios/hmssdk_flutter.podspec` - iOS CocoaPods spec

### 2. hms_room_kit (Prebuilt UI)

**Location**: `packages/hms_room_kit/`

**Purpose**: High-level prebuilt UI components for quick integration of video conferencing features.

**Key Features**:
- Ready-to-use video conferencing UI
- Customizable themes and layouts
- Built-in chat interface
- Participant list management
- Screen sharing UI
- Audio/video controls
- Role-based UI elements
- Settings and permissions UI

**Dependencies**:
- Uses `hmssdk_flutter` as core dependency
- Additional UI packages: `provider`, `google_fonts`, `flutter_svg`, `lottie`, etc.

**Integration**: Single widget implementation
```dart
HMSPrebuilt(
  roomCode: "your-room-code",
  hmsConfig: HMSPrebuiltOptions(userName: "User Name")
)
```

### 3. Example App

**Location**: `packages/hmssdk_flutter/example/`

**Purpose**: Comprehensive reference implementation demonstrating all SDK features.

**State Management**: Provider pattern

**Architecture**:
- `PreviewStore` - Manages preview screen state (implements `HMSPreviewListener`)
- `MeetingStore` - Manages meeting room state (implements `HMSUpdateListener`, `HMSActionResultListener`)
- `PeerTrackNode` - Per-peer state management to optimize UI updates

**Key Files**:
- `lib/main.dart` - App entry point
- `lib/data_store/meeting_store.dart` - Main meeting state
- `lib/data_store/preview_store.dart` - Preview state
- `lib/common/peer_widgets/peer_tile.dart` - Video tile component
- `lib/hms_sdk_interactor.dart` - SDK initialization

**Features Demonstrated**:
- Join with/without preview
- Multiple meeting modes (Grid, Active Speaker, Hero, Audio, Single Tile)
- Screen sharing & audio sharing
- Chat (broadcast, group, direct)
- Hand raise & BRB (Be Right Back)
- Role changes
- Mute/unmute controls
- Remove peer
- HLS streaming
- PiP mode
- Spotlight feature

**Firebase Integration**: Uses Firebase for crashlytics and performance monitoring.

## Android-Specific Configuration

### Build Requirements (16KB Page Size Support)

Google Play requires 16KB page size support starting November 1, 2025. This repo is configured accordingly.

**Required in `android/app/build.gradle`**:
```gradle
android {
    compileSdkVersion 36
    ndkVersion "27.2.12479018"

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = '17'
    }

    defaultConfig {
        minSdkVersion 24
        targetSdkVersion 36

        ndk {
            // Only 64-bit architectures for 16KB page size support
            abiFilters 'arm64-v8a', 'x86_64'
        }
    }
}
```

**Required in project-level `android/build.gradle`**:
```gradle
buildscript {
    ext.kotlin_version = '2.1.10'
    dependencies {
        classpath 'com.android.tools.build:gradle:8.9.0'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}
```

**Gradle Wrapper**:
- Ensure `android/gradle/wrapper/gradle-wrapper.properties` uses Gradle 8.10+

### Android Permissions

Required in `AndroidManifest.xml`:
```xml
<uses-feature android:name="android.hardware.camera"/>
<uses-feature android:name="android.hardware.camera.autofocus"/>
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.RECORD_AUDIO"/>
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE"/>
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS"/>
<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
<uses-permission android:name="android.permission.BLUETOOTH" android:maxSdkVersion="30"/>
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT"/>
```

### PiP Configuration (Android)

In `AndroidManifest.xml`:
```xml
<activity
    android:supportsPictureInPicture="true"
    android:configChanges="screenSize|smallestScreenSize|screenLayout|orientation"
    .../>
```

In `MainActivity.kt`:
```kotlin
override fun onUserLeaveHint() {
    super.onUserLeaveHint()
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O &&
        Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
        HMSPipAction.autoEnterPipMode(this)
    }
}
```

## iOS-Specific Configuration

### iOS Setup

**Minimum iOS Version**: iOS 12.0 (Recommended: iOS 16.0+)

**Podfile Configuration** (`ios/Podfile`):
```ruby
platform :ios, '12.0'
```

### iOS Permissions

Required in `ios/Runner/Info.plist`:
```xml
<key>NSMicrophoneUsageDescription</key>
<string>$(PRODUCT_NAME) needs microphone access for video calls</string>

<key>NSCameraUsageDescription</key>
<string>$(PRODUCT_NAME) needs camera access for video calls</string>

<key>NSLocalNetworkUsageDescription</key>
<string>$(PRODUCT_NAME) needs local network access</string>

<key>NSBluetoothAlwaysUsageDescription</key>
<string>$(PRODUCT_NAME) needs bluetooth for audio devices</string>
```

### PiP Configuration (iOS)

**Requirements**:
- iOS 15.0+
- Entitlement: `com.apple.developer.avfoundation.multitasking-camera-access`

Add to entitlements file in Xcode:
```xml
<key>com.apple.developer.avfoundation.multitasking-camera-access</key>
<true/>
```

### Screen Share Setup (iOS)

Requires Broadcast Upload Extension. See: https://www.100ms.live/docs/flutter/v2/how-to-guides/set-up-video-conferencing/screen-share#ios-setup

## Common Development Commands

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/100mslive/100ms-flutter.git
cd 100ms-flutter

# Get dependencies for core SDK
cd packages/hmssdk_flutter
flutter pub get

# Get dependencies for room kit
cd ../hms_room_kit
flutter pub get

# Get dependencies for example app
cd ../hmssdk_flutter/example
flutter pub get

# iOS: Install CocoaPods dependencies
cd ios
pod install
cd ..
```

### Running the Example App

```bash
# From packages/hmssdk_flutter/example directory

# Run on connected device/emulator
flutter run

# Run specific platform
flutter run -d <device_id>

# List available devices
flutter devices

# Run in release mode
flutter run --release

# Clean build
flutter clean
flutter pub get
```

### Building

```bash
# Android APK (Debug)
flutter build apk --debug

# Android App Bundle (Release)
flutter build appbundle --release

# iOS (Debug - no codesign)
flutter build ios --debug --no-codesign

# iOS (Release)
flutter build ios --release
```

### Testing & Analysis

```bash
# Run tests
flutter test

# Analyze code
flutter analyze

# Check for outdated dependencies
flutter pub outdated

# Upgrade dependencies
flutter pub upgrade
```

### Platform-Specific

#### Android

```bash
# Clean Android build
cd android
./gradlew clean
cd ..

# Check Gradle dependencies
cd android
./gradlew app:dependencies
cd ..
```

#### iOS

```bash
# Update CocoaPods repo
cd ios
pod repo update
pod install
cd ..

# Clean iOS build
flutter clean
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

## State Management Patterns

The repository demonstrates multiple state management approaches:

1. **Provider** (Default example app)
   - Location: `packages/hmssdk_flutter/example/`
   - Best for: Medium-complexity apps

2. **BLoC**
   - Location: `sample apps/bloc/`
   - Best for: Large-scale apps, predictable state

3. **GetX**
   - Location: `sample apps/getx/`
   - Best for: Quick development, minimal boilerplate

4. **MobX**
   - Location: `sample apps/mobx/`
   - Best for: Reactive programming patterns

5. **Riverpod**
   - Location: `sample apps/riverpod/`
   - Best for: Modern Flutter apps, compile-time safety

## SDK Initialization & Usage

### Basic Flow

1. **Build SDK Instance**
```dart
HMSSDK hmsSDK = HMSSDK();
await hmsSDK.build();
```

2. **Add Update Listener**
```dart
class Meeting implements HMSUpdateListener {
  // Implement required callbacks
}
hmsSDK.addUpdateListener(meetingInstance);
```

3. **Get Auth Token**
```dart
// Using room code (recommended)
dynamic authToken = await hmsSDK.getAuthTokenByRoomCode(
  roomCode: 'your-room-code'
);
```

4. **Join Room**
```dart
HMSConfig config = HMSConfig(
  authToken: authToken,
  userName: 'User Name',
);
hmsSDK.join(config: config);
```

### Key SDK Classes

- **HMSSDK**: Main SDK interface
- **HMSUpdateListener**: Callbacks for room/peer/track updates
- **HMSActionResultListener**: Callbacks for action success/failure
- **HMSPreviewListener**: Callbacks for preview
- **HMSConfig**: Room join configuration
- **HMSPeer**: Peer information
- **HMSTrack**: Audio/Video track (LocalAudioTrack, RemoteVideoTrack, etc.)
- **HMSRoom**: Room information
- **HMSVideoView**: Widget for rendering video

### Important SDK Methods

**Room Operations**:
- `build()` - Initialize SDK
- `preview()` - Preview before joining
- `join()` - Join room
- `leave()` - Leave room

**Track Operations**:
- `switchAudio()` - Mute/unmute local audio
- `switchVideo()` - Mute/unmute local video
- `changeTrackState()` - Change remote peer's track state
- `changeTrackStateForRole()` - Change track state for role

**Other Features**:
- `startScreenShare()` / `stopScreenShare()` - Screen sharing
- `startAudioShare()` / `stopAudioShare()` - Audio sharing
- `sendBroadcastMessage()` - Send chat to all
- `sendGroupMessage()` - Send chat to role(s)
- `sendDirectMessage()` - Send chat to specific peer
- `changeRole()` - Change peer role
- `removePeer()` - Remove peer from room
- `startHlsStreaming()` / `stopHlsStreaming()` - HLS streaming

## CI/CD & GitHub Actions

The repository uses GitHub Actions for continuous integration.

### Workflows

**Location**: `.github/workflows/`

1. **build.yml** - Main build workflow
   - Triggers: Push to main, PRs to main/develop
   - Jobs:
     - `check_android_build` - Builds Android app bundle
     - `check_ios_build` - Builds iOS app (debug, no codesign)
   - Configurations:
     - Flutter: 3.35.7
     - Java: 17
     - Android SDK: 36
     - NDK: 27.2.12479018
     - Kotlin: 2.1.10

2. **ktlint.yml** - Kotlin linting
3. **swiftlint.yml** - Swift linting
4. **firstinteraction.yml** - Welcomes new contributors
5. **stale.yml** - Manages stale issues/PRs

### Running CI Locally

For Android builds:
```bash
# Ensure you have the same versions as CI
java -version  # Should be 17
flutter --version  # Should be 3.35.7 or compatible

# Build
cd packages/hmssdk_flutter/example
flutter build appbundle --debug
```

## Testing

### Unit Tests

```bash
# Run all tests
flutter test

# Run tests with coverage
flutter test --coverage

# Run specific test file
flutter test test/your_test.dart
```

### Integration Tests

The example app includes integration testing capabilities. Check `packages/hmssdk_flutter/example/test/` for examples.

## Common Issues & Solutions

### Hot Reload/Hot Restart

HMSSDK does not fully support hot reload/hot restart. To verify changes:
1. Make code changes
2. Leave the room
3. Perform hot reload/restart
4. Rejoin to verify changes

### Build Failures

**Android**:
- Ensure Java 17 is being used: `java -version`
- Clean build: `cd android && ./gradlew clean && cd ..`
- Check Gradle version in `android/gradle/wrapper/gradle-wrapper.properties`
- Verify NDK is installed: Check Android Studio > SDK Manager > SDK Tools > NDK

**iOS**:
- Update CocoaPods: `sudo gem install cocoapods`
- Clean pod cache: `cd ios && rm -rf Pods Podfile.lock && pod install`
- Check Xcode version: `xcodebuild -version`

### Permission Issues

Make sure all required permissions are declared in:
- Android: `android/app/src/main/AndroidManifest.xml`
- iOS: `ios/Runner/Info.plist`

### Token Validation

To verify auth tokens, visit https://jwt.io/ and decode the token. Ensure:
- Correct `room_id`
- Correct `role`
- Token not expired

## Working with Native Code

### Android (Kotlin)

**Location**: `packages/hmssdk_flutter/android/src/main/kotlin/live/hms/hmssdk_flutter/`

**Key Files**:
- `HmssdkFlutterPlugin.kt` - Main plugin class
- `HMSManager.kt` - SDK manager
- Various action/listener handlers

**Build**: Changes require app rebuild (hot reload won't work)

### iOS (Swift)

**Location**: `packages/hmssdk_flutter/ios/Classes/`

**Key Files**:
- `SwiftHmssdkFlutterPlugin.swift` - Main plugin class
- Various manager classes for different features

**Build**: Changes require app rebuild

## Best Practices

### Performance Optimization

1. **Video Rendering**: Set `isOffscreen` to true for PeerTrackNode when tile is not visible
2. **Track Subscription**: Unsubscribe from tracks not being viewed
3. **State Management**: Use granular state updates (PeerTrackNode pattern)

### Error Handling

Always handle errors from:
- `onHMSError()` callback (HMSUpdateListener)
- `onException()` callback (HMSActionResultListener)

Check `HMSException` for:
- `code` - Error code
- `description` - Error description
- `isTerminal` - Whether error requires leaving room

### Memory Management

- Remove update listeners before leaving: `hmsSDK.removeUpdateListener(listener)`
- Properly dispose state management objects
- Clean up resources in widget `dispose()` methods

## Documentation & Resources

- **Official Docs**: https://www.100ms.live/docs/flutter/v2/guides/quickstart
- **API Reference**: https://pub.dev/documentation/hmssdk_flutter/latest/
- **Discord Community**: https://100ms.live/discord
- **GitHub Issues**: https://github.com/100mslive/100ms-flutter/issues
- **Sample Apps**: https://www.100ms.live/docs/flutter/v2/guides/sample-apps

### Sample App Downloads

- **Android (Firebase)**: https://appdistribution.firebase.dev/i/b623e5310929ab70
- **iOS (TestFlight)**: https://testflight.apple.com/join/Uhzebmut
- **App Store**: https://apps.apple.com/app/100ms-live/id1576541989
- **Play Store**: https://play.google.com/store/apps/details?id=live.hms.flutter

## Git Workflow

### Branches

- `main` - Production releases
- `develop` - Development branch (currently: `add_16kb_support`)
- Feature branches - For specific features

### Current Branch

As of this snapshot: `add_16kb_support` (adding Android 16KB page size support)

### Making Changes

1. Create feature branch from `develop`
2. Make changes
3. Test thoroughly (remember: no hot reload for SDK changes)
4. Create PR to `develop`
5. CI will run Android and iOS builds
6. After review, merge to `develop`

## Important Notes

1. **Single HMSSDK Instance**: Use the same HMSSDK instance throughout the app
2. **Build Method**: Always call `build()` before other operations
3. **Platform Channels**: Native code changes require full rebuild
4. **Token Security**: Never commit auth tokens or Firebase configs
5. **16KB Support**: This is a critical Android requirement for Play Store (Nov 2025)

## Getting Help

When asking for help or reporting issues:

1. Check existing GitHub issues first
2. Include:
   - Flutter version (`flutter --version`)
   - SDK version (from `pubspec.yaml`)
   - Platform (Android/iOS) and version
   - Error logs/stack traces
   - Minimal reproduction code
3. Use Discord for quick questions
4. Use GitHub Issues for bugs/feature requests

---

**Last Updated**: October 2025 (Based on v1.11.0 SDK)
