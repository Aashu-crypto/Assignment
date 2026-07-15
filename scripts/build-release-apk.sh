#!/usr/bin/env bash
# Build a release-signed APK locally for Drape.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f credentials/drape-release.keystore || ! -f credentials/keystore.properties ]]; then
  echo "Missing credentials/drape-release.keystore or credentials/keystore.properties"
  exit 1
fi

export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"

if [[ ! -d android ]]; then
  echo "Running expo prebuild..."
  CI=1 npx expo prebuild --platform android
fi

# Ensure keystore.properties uses a path relative to android/
STORE_PASS="$(sed -n 's/^storePassword=//p' credentials/keystore.properties)"
KEY_PASS="$(sed -n 's/^keyPassword=//p' credentials/keystore.properties)"
KEY_ALIAS="$(sed -n 's/^keyAlias=//p' credentials/keystore.properties)"
cat > android/keystore.properties <<EOF
storeFile=../credentials/drape-release.keystore
storePassword=${STORE_PASS}
keyAlias=${KEY_ALIAS}
keyPassword=${KEY_PASS}
EOF
chmod 600 android/keystore.properties

APP_GRADLE="android/app/build.gradle"
if ! grep -q "signingConfigs.release" "$APP_GRADLE" 2>/dev/null && ! grep -q 'signingConfig signingConfigs.release' "$APP_GRADLE"; then
  python3 - <<'PY'
from pathlib import Path
path = Path("android/app/build.gradle")
text = path.read_text()
old = """    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.debug"""
new = """    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            def keystorePropertiesFile = rootProject.file("keystore.properties")
            if (keystorePropertiesFile.exists()) {
                def keystoreProperties = new Properties()
                keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
                storeFile rootProject.file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.release"""
if old not in text:
    raise SystemExit("Could not patch android/app/build.gradle — signing block not found in expected form")
path.write_text(text.replace(old, new, 1))
print("Patched release signing into android/app/build.gradle")
PY
fi

(
  cd android
  ./gradlew assembleRelease --no-daemon
)

mkdir -p dist
cp android/app/build/outputs/apk/release/app-release.apk dist/drape-1.0.0-release.apk
cp dist/drape-1.0.0-release.apk drape-1.0.0-release.apk
echo "Signed APK: $ROOT/drape-1.0.0-release.apk"
