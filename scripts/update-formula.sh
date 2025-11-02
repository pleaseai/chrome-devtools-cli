#!/bin/bash
set -e

# Update Homebrew formula with new version and checksums
VERSION=${1:-$(node -p "require('./package.json').version")}
RELEASE_DIR="dist/release"

if [ ! -d "$RELEASE_DIR" ]; then
  echo "Error: Release directory not found. Run build-release.sh first."
  exit 1
fi

echo "Updating Homebrew formula for version $VERSION"

# Get checksums
DARWIN_ARM64_SHA=$(shasum -a 256 "$RELEASE_DIR/chrome-devtools-cli-darwin-arm64.tar.gz" | cut -d' ' -f1)
DARWIN_X64_SHA=$(shasum -a 256 "$RELEASE_DIR/chrome-devtools-cli-darwin-x64.tar.gz" | cut -d' ' -f1)
LINUX_ARM64_SHA=$(shasum -a 256 "$RELEASE_DIR/chrome-devtools-cli-linux-arm64.tar.gz" | cut -d' ' -f1)
LINUX_X64_SHA=$(shasum -a 256 "$RELEASE_DIR/chrome-devtools-cli-linux-x64.tar.gz" | cut -d' ' -f1)

echo "Checksums:"
echo "  macOS ARM64: $DARWIN_ARM64_SHA"
echo "  macOS x64:   $DARWIN_X64_SHA"
echo "  Linux ARM64: $LINUX_ARM64_SHA"
echo "  Linux x64:   $LINUX_X64_SHA"

# Update formula
FORMULA_FILE="Formula/chrome-devtools-cli.rb"

# Backup original
cp "$FORMULA_FILE" "$FORMULA_FILE.bak"

# Update version and checksums
sed -i.tmp "s|v[0-9]*\.[0-9]*\.[0-9]*|v${VERSION}|g" "$FORMULA_FILE"
sed -i.tmp "s|PLACEHOLDER_ARM64_SHA256|${DARWIN_ARM64_SHA}|" "$FORMULA_FILE"
sed -i.tmp "s|PLACEHOLDER_X64_SHA256|${DARWIN_X64_SHA}|" "$FORMULA_FILE"
sed -i.tmp "s|PLACEHOLDER_LINUX_ARM64_SHA256|${LINUX_ARM64_SHA}|" "$FORMULA_FILE"
sed -i.tmp "s|PLACEHOLDER_LINUX_X64_SHA256|${LINUX_X64_SHA}|" "$FORMULA_FILE"

# Clean up temp files
rm -f "$FORMULA_FILE.tmp"

echo ""
echo "Formula updated successfully!"
echo "File: $FORMULA_FILE"
echo ""
echo "Review the changes and commit:"
echo "  git diff $FORMULA_FILE"
echo "  git add $FORMULA_FILE"
echo "  git commit -m 'chore: update formula to v${VERSION}'"
