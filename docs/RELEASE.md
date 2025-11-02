# Release Guide

This document describes how to release a new version of Chrome DevTools CLI.

## Release Process

### 1. Prepare Release

Update version in `package.json`:

```bash
# Update version (follow semver)
vim package.json  # Update version field

# Update CHANGELOG.md
vim CHANGELOG.md  # Add release notes
```

### 2. Build Release Binaries

```bash
# Build for all platforms
./scripts/build-release.sh

# Or specify version
./scripts/build-release.sh 0.1.0
```

This creates the following binaries in `dist/release/`:
- `chrome-devtools-cli-darwin-arm64.tar.gz` (macOS Apple Silicon)
- `chrome-devtools-cli-darwin-x64.tar.gz` (macOS Intel)
- `chrome-devtools-cli-linux-arm64.tar.gz` (Linux ARM64)
- `chrome-devtools-cli-linux-x64.tar.gz` (Linux x64)

### 3. Create GitHub Release

```bash
# Tag the release
VERSION=$(node -p "require('./package.json').version")
git tag -a "v${VERSION}" -m "Release v${VERSION}"
git push origin "v${VERSION}"

# Create GitHub release and upload binaries
gh release create "v${VERSION}" \
  --title "v${VERSION}" \
  --notes-file RELEASE_NOTES.md \
  dist/release/*.tar.gz \
  dist/release/checksums.txt
```

### 4. Update Homebrew Formula

```bash
# Update formula with new version and checksums
./scripts/update-formula.sh

# Review changes
git diff Formula/chrome-devtools-cli.rb

# Commit formula update
git add Formula/chrome-devtools-cli.rb
git commit -m "chore: update formula to v${VERSION}"
git push origin main
```

### 5. Publish to npm (Optional)

```bash
# Build for npm
bun run build
bun run build:types

# Publish
npm publish
```

## Homebrew Tap Setup

To create your own Homebrew tap:

### 1. Create Tap Repository

```bash
# Create a new repository named homebrew-tap
# Example: https://github.com/pleaseai/homebrew-tap
```

### 2. Add Formula

```bash
# Copy formula to tap repository
cp Formula/chrome-devtools-cli.rb ../homebrew-tap/Formula/
cd ../homebrew-tap
git add Formula/chrome-devtools-cli.rb
git commit -m "feat: add chrome-devtools-cli formula"
git push origin main
```

### 3. Users Install via Tap

```bash
# Add tap
brew tap pleaseai/tap

# Install
brew install chrome-devtools-cli

# Or one-liner
brew install pleaseai/tap/chrome-devtools-cli
```

## Installation Methods

### Homebrew (Recommended)

```bash
# Via tap
brew tap pleaseai/tap
brew install chrome-devtools-cli

# Update
brew upgrade chrome-devtools-cli
```

### Direct Binary Download

```bash
# macOS ARM64
curl -L https://github.com/pleaseai/chrome-devtools-cli/releases/download/v0.1.0/chrome-devtools-cli-darwin-arm64.tar.gz | tar xz
sudo mv chrome-devtools /usr/local/bin/

# macOS x64
curl -L https://github.com/pleaseai/chrome-devtools-cli/releases/download/v0.1.0/chrome-devtools-cli-darwin-x64.tar.gz | tar xz
sudo mv chrome-devtools /usr/local/bin/

# Linux ARM64
curl -L https://github.com/pleaseai/chrome-devtools-cli/releases/download/v0.1.0/chrome-devtools-cli-linux-arm64.tar.gz | tar xz
sudo mv chrome-devtools /usr/local/bin/

# Linux x64
curl -L https://github.com/pleaseai/chrome-devtools-cli/releases/download/v0.1.0/chrome-devtools-cli-linux-x64.tar.gz | tar xz
sudo mv chrome-devtools /usr/local/bin/
```

### npm/Bun

```bash
# Global install
npm install -g @pleaseai/chrome-devtools-cli
# or
bun add -g @pleaseai/chrome-devtools-cli

# Local install
npm install @pleaseai/chrome-devtools-cli
# or
bun add @pleaseai/chrome-devtools-cli
```

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

Examples:
- `0.1.0` → `0.1.1` (bug fix)
- `0.1.1` → `0.2.0` (new feature)
- `0.2.0` → `1.0.0` (breaking change)

## Release Checklist

Before releasing:

- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md` with release notes
- [ ] Run tests: `bun test`
- [ ] Run linting: `bun run lint`
- [ ] Run type checking: `bun run type-check`
- [ ] Build release binaries: `./scripts/build-release.sh`
- [ ] Test binaries locally
- [ ] Create git tag
- [ ] Create GitHub release
- [ ] Upload release binaries
- [ ] Update Homebrew formula
- [ ] Publish to npm (if applicable)
- [ ] Update documentation if needed
- [ ] Announce release

## Troubleshooting

### Build Fails

```bash
# Clean and rebuild
rm -rf dist node_modules
bun install
./scripts/build-release.sh
```

### Formula SHA Mismatch

```bash
# Regenerate checksums
cd dist/release
shasum -a 256 *.tar.gz
# Update formula manually with correct checksums
```

### Binary Not Executable

```bash
# Make binary executable
chmod +x chrome-devtools
```

## Automated Releases (Future)

We plan to automate releases using GitHub Actions:

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest]
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: ./scripts/build-release.sh
      - uses: softprops/action-gh-release@v1
        with:
          files: dist/release/*.tar.gz
```

## Support

For release issues, please open an issue on GitHub:
https://github.com/pleaseai/chrome-devtools-cli/issues
