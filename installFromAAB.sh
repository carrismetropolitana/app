#!/bin/bash

# ---------------- CONFIG ----------------

# Paths and file names (change these as needed)
AAB_FILE="./android/app/build/outputs/bundle/release/app-release.aab"
KEYSTORE_FILE="./android/app/release.keystore"
KEY_ALIAS="release"
KEYSTORE_PASSWORD="Bruno2670!"
KEY_PASSWORD="Bruno2670!"
APKS_OUTPUT="output.apks"

# ----------------------------------------

echo "🔍 Checking for bundletool..."
if ! command -v bundletool &> /dev/null; then
  echo "❌ Error: bundletool not found. Install it with 'brew install bundletool'"
  exit 1
fi

echo "🔍 Checking for keytool..."
if ! command -v keytool &> /dev/null; then
  echo "❌ Error: keytool not found. Ensure Java is installed."
  exit 1
fi

# Build .apks file
echo "📦 Building APKs from AAB..."
bundletool build-apks \
  --bundle="$AAB_FILE" \
  --output="$APKS_OUTPUT" \
  --ks=$KEYSTORE_FILE \
  --ks-key-alias="$KEY_ALIAS" \
  --ks-pass=pass:"$KEYSTORE_PASSWORD" \
  --key-pass=pass:"$KEY_PASSWORD" \
  --mode=universal

if [ $? -ne 0 ]; then
  echo "❌ Failed to build APKs."
  exit 1
fi

# Install APKs to connected device
echo "📲 Installing APKs to connected device..."
bundletool install-apks --apks="$APKS_OUTPUT"

if [ $? -eq 0 ]; then
  echo "✅ App installed successfully!"
else
  echo "❌ Installation failed."
fi
