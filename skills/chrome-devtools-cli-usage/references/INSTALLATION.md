# Installation Guide

Complete installation methods for Chrome DevTools CLI.

## Homebrew (Recommended for macOS/Linux)

```bash
# Add tap and install
brew install pleaseai/tap/chrome-devtools-cli

# Update
brew upgrade chrome-devtools-cli
```

## Quick Install Script (Auto-detects platform)

```bash
curl -fsSL https://raw.githubusercontent.com/pleaseai/chrome-devtools-cli/main/install.sh | bash
```

Or download and run the script manually:

```bash
curl -fsSL https://raw.githubusercontent.com/pleaseai/chrome-devtools-cli/main/install.sh -o install.sh
chmod +x install.sh
./install.sh
```

## npm/Bun

```bash
# Global installation
npm install -g @pleaseai/chrome-devtools-cli
# or
bun add -g @pleaseai/chrome-devtools-cli
```

## Manual Binary Download

Download pre-built binaries from [GitHub Releases](https://github.com/pleaseai/chrome-devtools-cli/releases):

### macOS (Apple Silicon)

```bash
curl -L https://github.com/pleaseai/chrome-devtools-cli/releases/latest/download/chrome-devtools-darwin-arm64 -o chrome-devtools
chmod +x chrome-devtools
sudo mv chrome-devtools /usr/local/bin/
```

### macOS (Intel)

```bash
curl -L https://github.com/pleaseai/chrome-devtools-cli/releases/latest/download/chrome-devtools-darwin-x64 -o chrome-devtools
chmod +x chrome-devtools
sudo mv chrome-devtools /usr/local/bin/
```

### Linux (ARM64)

```bash
curl -L https://github.com/pleaseai/chrome-devtools-cli/releases/latest/download/chrome-devtools-linux-arm64 -o chrome-devtools
chmod +x chrome-devtools
sudo mv chrome-devtools /usr/local/bin/
```

### Linux (x64)

```bash
curl -L https://github.com/pleaseai/chrome-devtools-cli/releases/latest/download/chrome-devtools-linux-x64 -o chrome-devtools
chmod +x chrome-devtools
sudo mv chrome-devtools /usr/local/bin/
```

## Local Installation (as library)

```bash
npm install @pleaseai/chrome-devtools-cli
# or
bun add @pleaseai/chrome-devtools-cli
```

## Requirements

- Node.js v20.19+ or newer (LTS version)
- Chrome current stable version or newer
- npm or Bun package manager

## Verification

After installation, verify the CLI is working:

```bash
chrome-devtools --version
chrome-devtools --help
```
