#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

/**
 * Script to automatically generate version information from package files
 * This replaces manual updates to the "Current Version Info" section
 */

function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

function readYamlVersion(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    // Simple regex to extract version from pubspec.yaml
    const match = content.match(/^version:\s+([^\s]+)/m);
    return match ? match[1] : null;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

function readPlistValue(filePath, key) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    // Simple regex to extract value after the key
    const regex = new RegExp(`<key>${key}</key>\\s*<string>([^<]+)</string>`);
    const match = content.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error(`Error reading plist ${filePath}:`, error.message);
    return null;
  }
}

function readGradleVersion(filePath, versionType) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    if (versionType === "versionName") {
      // Match: versionName "1.5.229"
      const regex = /versionName\s+"([^"]+)"/;
      const match = content.match(regex);
      return match ? match[1] : null;
    } else if (versionType === "versionCode") {
      // Match: versionCode 529
      const regex = /versionCode\s+(\d+)/;
      const match = content.match(regex);
      return match ? match[1] : null;
    }

    return null;
  } catch (error) {
    console.error(`Error reading gradle ${filePath}:`, error.message);
    return null;
  }
}

function getFlutterVersion() {
  try {
    // Get Flutter version from flutter --version command
    const flutterPath = process.env.FLUTTER_PATH || "flutter";
    const output = execSync(`${flutterPath} --version`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });

    // Parse the first line which contains: "Flutter 3.35.7 • channel stable • ..."
    const match = output.match(/Flutter\s+([^\s•]+)/);
    return match ? match[1] : null;
  } catch (error) {
    console.error("Error getting Flutter version:", error.message);
    return null;
  }
}

function generateVersionInfo() {
  const rootDir = path.join(__dirname, "..");

  // Read package versions from pubspec.yaml files
  const roomKitVersion = readYamlVersion(
    path.join(rootDir, "packages/hms_room_kit/pubspec.yaml")
  );
  const coreSdkVersion = readYamlVersion(
    path.join(rootDir, "packages/hmssdk_flutter/pubspec.yaml")
  );
  const exampleVersion = readYamlVersion(
    path.join(rootDir, "packages/hmssdk_flutter/example/pubspec.yaml")
  );

  // Read SDK versions from json file
  const sdkVersions = readJsonFile(
    path.join(rootDir, "packages/hmssdk_flutter/lib/assets/sdk-versions.json")
  );

  // Read Android app version
  const androidVersionName = readGradleVersion(
    path.join(
      rootDir,
      "packages/hmssdk_flutter/example/android/app/build.gradle"
    ),
    "versionName"
  );
  const androidVersionCode = readGradleVersion(
    path.join(
      rootDir,
      "packages/hmssdk_flutter/example/android/app/build.gradle"
    ),
    "versionCode"
  );

  // Read iOS app version
  const iosVersion = readPlistValue(
    path.join(
      rootDir,
      "packages/hmssdk_flutter/example/ios/Runner/Info.plist"
    ),
    "CFBundleShortVersionString"
  );
  const iosBuild = readPlistValue(
    path.join(
      rootDir,
      "packages/hmssdk_flutter/example/ios/Runner/Info.plist"
    ),
    "CFBundleVersion"
  );

  // Get Flutter version from flutter --version command
  const flutterSdkVersion = getFlutterVersion() || "N/A";

  // Determine app version and build number (prefer Android, fallback to iOS)
  const appVersion = androidVersionName || iosVersion || "N/A";
  const buildNumber = androidVersionCode || iosBuild || "N/A";

  // Generate version info text matching the current format
  const versionInfo = `
Current Version Info:
Room Kit: ${roomKitVersion || "N/A"}
Core SDK: ${coreSdkVersion || "N/A"}
Android SDK: ${sdkVersions?.android || "N/A"}
iOS SDK: ${sdkVersions?.ios || "N/A"}
Flutter version: ${flutterSdkVersion}
Example App Version: ${appVersion} (${buildNumber})
`;

  return versionInfo.trim();
}

// Export for use in other scripts
if (require.main === module) {
  // Running as a script
  const versionInfo = generateVersionInfo();
  console.log(versionInfo);
} else {
  // Being imported as a module
  module.exports = { generateVersionInfo };
}
