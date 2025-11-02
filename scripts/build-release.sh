#!/bin/bash
set -e

# Build release binaries for all platforms
echo "Building release binaries..."

VERSION=${1:-$(node -p "require('./package.json').version")}
OUTPUT_DIR="dist/release"

echo "Version: $VERSION"
echo "Output directory: $OUTPUT_DIR"

# Clean and create output directory
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Build for macOS (ARM64)
echo "Building for macOS ARM64..."
bun build --compile --minify --sourcemap --bytecode \
  --target bun-darwin-arm64 \
  src/cli.ts \
  --outfile "$OUTPUT_DIR/chrome-devtools-darwin-arm64"

# Build for macOS (x64)
echo "Building for macOS x64..."
bun build --compile --minify --sourcemap --bytecode \
  --target bun-darwin-x64 \
  src/cli.ts \
  --outfile "$OUTPUT_DIR/chrome-devtools-darwin-x64"

# Build for Linux (ARM64)
echo "Building for Linux ARM64..."
bun build --compile --minify --sourcemap --bytecode \
  --target bun-linux-arm64 \
  src/cli.ts \
  --outfile "$OUTPUT_DIR/chrome-devtools-linux-arm64"

# Build for Linux (x64)
echo "Building for Linux x64..."
bun build --compile --minify --sourcemap --bytecode \
  --target bun-linux-x64 \
  src/cli.ts \
  --outfile "$OUTPUT_DIR/chrome-devtools-linux-x64"

echo "Creating archives..."

# Create archives
cd "$OUTPUT_DIR"

# macOS ARM64
tar -czf "chrome-devtools-cli-darwin-arm64.tar.gz" "chrome-devtools-darwin-arm64"
mv "chrome-devtools-darwin-arm64" "chrome-devtools"
tar -czf "chrome-devtools-cli-v${VERSION}-darwin-arm64.tar.gz" "chrome-devtools"
rm "chrome-devtools"

# macOS x64
tar -czf "chrome-devtools-cli-darwin-x64.tar.gz" "chrome-devtools-darwin-x64"
mv "chrome-devtools-darwin-x64" "chrome-devtools"
tar -czf "chrome-devtools-cli-v${VERSION}-darwin-x64.tar.gz" "chrome-devtools"
rm "chrome-devtools"

# Linux ARM64
tar -czf "chrome-devtools-cli-linux-arm64.tar.gz" "chrome-devtools-linux-arm64"
mv "chrome-devtools-linux-arm64" "chrome-devtools"
tar -czf "chrome-devtools-cli-v${VERSION}-linux-arm64.tar.gz" "chrome-devtools"
rm "chrome-devtools"

# Linux x64
tar -czf "chrome-devtools-cli-linux-x64.tar.gz" "chrome-devtools-linux-x64"
mv "chrome-devtools-linux-x64" "chrome-devtools"
tar -czf "chrome-devtools-cli-v${VERSION}-linux-x64.tar.gz" "chrome-devtools"
rm "chrome-devtools"

cd ../..

echo ""
echo "Build complete! Archives created in $OUTPUT_DIR"
echo ""
echo "Files:"
ls -lh "$OUTPUT_DIR"/*.tar.gz

echo ""
echo "Generating checksums..."
cd "$OUTPUT_DIR"
shasum -a 256 *.tar.gz > checksums.txt
cat checksums.txt

echo ""
echo "Done! Release artifacts are ready in $OUTPUT_DIR"
