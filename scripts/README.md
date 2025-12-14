# 100ms Flutter Scripts

This directory contains helper scripts for managing the 100ms Flutter project.

## Scripts

### update-changelog-versions.js

Automatically updates the "Current Version Info" section in the ExampleAppChangelog.txt file with the latest version information from:
- Room Kit version (from `packages/hms_room_kit/pubspec.yaml`)
- Core SDK version (from `packages/hmssdk_flutter/pubspec.yaml`)
- Android SDK version (from `packages/hmssdk_flutter/lib/assets/sdk-versions.json`)
- iOS SDK version (from `packages/hmssdk_flutter/lib/assets/sdk-versions.json`)
- Flutter version (from `flutter --version` command)
- Example App version and build number (from Android build.gradle and iOS Info.plist)

**Usage:**
```bash
# From the scripts directory
npm run update-changelog

# Or directly with node
node scripts/update-changelog-versions.js
```

### generate-version-info.js

Generates version information in a formatted string. This is used internally by the update-changelog-versions script, but can also be run standalone to preview the version info.

**Usage:**
```bash
# From the scripts directory
npm run generate-version-info

# Or directly with node
node scripts/generate-version-info.js
```

## Installation

No dependencies are required. These scripts use only Node.js built-in modules.

## Integration with Release Process

These scripts are **automatically integrated** into the release workflow via the `release-apps.sh` script at the project root.

### Automatic Integration

The `release-apps.sh` script automatically runs `update-changelog-versions.js`:
1. After Flutter pub get
2. After building and distributing Android/iOS apps (which bump version numbers via Fastlane)
3. Before committing and pushing release changes

This ensures the changelog always reflects the current version information from the actual build files.

### Release Workflow

```bash
# From project root
./release-apps.sh              # Build and release both platforms
./release-apps.sh --android-only   # Build Android only
./release-apps.sh --ios-only       # Build iOS only
./release-apps.sh --dry-run        # Preview what would happen
```

The script will:
1. Run Flutter pub get
2. Build and distribute apps (Fastlane bumps versions here)
3. **Automatically update the changelog with new versions**
4. Commit and push changes (including updated changelog)

### Manual Usage

You can also run the script manually to update the changelog at any time:

```bash
node scripts/update-changelog-versions.js
```

## Example Output

```
Current Version Info:
Room Kit: 1.2.0
Core SDK: 1.11.0
Android SDK: 2.9.78
iOS SDK: 1.17.0
Flutter version: 3.35.7
Example App Version: 1.5.229 (529)
```

## Environment Variables

- **FLUTTER_PATH**: Optional. Path to the Flutter executable. Defaults to `flutter` (assumes it's in your PATH).
