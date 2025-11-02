# Chrome DevTools CLI

[![npm version](https://img.shields.io/npm/v/@pleaseai/chrome-devtools-cli.svg)](https://www.npmjs.com/package/@pleaseai/chrome-devtools-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

CLI wrapper for [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) - Control and inspect Chrome with command-line tools.

## Features

- **🎯 Input Automation**: Click, hover, fill forms, drag-and-drop, keyboard input
- **🧭 Navigation**: Multi-page management, URL navigation, wait conditions
- **📱 Emulation**: Device emulation, viewport resizing
- **⚡ Performance**: Trace recording, performance analysis
- **🌐 Network**: Request monitoring, inspection
- **🐛 Debugging**: Console monitoring, script evaluation, screenshots, snapshots
- **🎨 Multiple Output Formats**: JSON, TOON, or human-readable text
- **🔧 Flexible Browser Connection**: Launch new instances or connect to existing Chrome

## Installation

### Homebrew (Recommended for macOS/Linux)

```bash
# Add tap
brew tap pleaseai/tap

# Install
brew install chrome-devtools-cli

# Or one-liner
brew install pleaseai/tap/chrome-devtools-cli
```

Update:
```bash
brew upgrade chrome-devtools-cli
```

### Binary Download

Download pre-built binaries from [GitHub Releases](https://github.com/pleaseai/chrome-devtools-cli/releases):

```bash
# macOS (Apple Silicon)
curl -L https://github.com/pleaseai/chrome-devtools-cli/releases/latest/download/chrome-devtools-darwin-arm64 -o chrome-devtools
chmod +x chrome-devtools
sudo mv chrome-devtools /usr/local/bin/

# macOS (Intel)
curl -L https://github.com/pleaseai/chrome-devtools-cli/releases/latest/download/chrome-devtools-darwin-x64 -o chrome-devtools
chmod +x chrome-devtools
sudo mv chrome-devtools /usr/local/bin/

# Linux (ARM64)
curl -L https://github.com/pleaseai/chrome-devtools-cli/releases/latest/download/chrome-devtools-linux-arm64 -o chrome-devtools
chmod +x chrome-devtools
sudo mv chrome-devtools /usr/local/bin/

# Linux (x64)
curl -L https://github.com/pleaseai/chrome-devtools-cli/releases/latest/download/chrome-devtools-linux-x64 -o chrome-devtools
chmod +x chrome-devtools
sudo mv chrome-devtools /usr/local/bin/
```

### npm/Bun

```bash
# Global installation
npm install -g @pleaseai/chrome-devtools-cli
# or
bun add -g @pleaseai/chrome-devtools-cli
```

### Local Installation (as library)

```bash
npm install @pleaseai/chrome-devtools-cli
# or
bun add @pleaseai/chrome-devtools-cli
```

## Quick Start

### Launch Chrome and Navigate

```bash
# Open a new page
chrome-devtools nav new-page --url https://example.com

# Navigate current page
chrome-devtools nav navigate --url https://google.com
```

### Take a Screenshot

```bash
chrome-devtools debug screenshot --path screenshot.png --full-page
```

### Analyze Performance

```bash
chrome-devtools perf analyze --url https://example.com --format json
```

### Monitor Network Requests

```bash
# Start monitoring
chrome-devtools network start-monitoring

# List requests
chrome-devtools network list-requests --format toon
```

## Usage

### Global Options

```bash
chrome-devtools [global-options] <command> [command-options]
```

**Global Options:**

- `--browser-url <url>` - Connect to running Chrome via port forwarding
- `--ws-endpoint <endpoint>` - WebSocket endpoint for Chrome
- `--ws-headers <headers>` - Custom WebSocket headers (JSON)
- `--headless` - Run in headless mode
- `--executable-path <path>` - Path to Chrome executable
- `--isolated` - Use temporary user data directory
- `--channel <channel>` - Chrome channel (stable|canary|beta|dev)
- `--viewport <viewport>` - Initial viewport size (e.g., 1280x720)
- `--proxy-server <proxy>` - Proxy server configuration
- `--accept-insecure-certs` - Ignore certificate errors
- `--format <format>` - Output format (json|toon|text)

## Commands

### Input Automation

#### Click on Element

```bash
chrome-devtools input click --uid <element-uid>
chrome-devtools input click --uid <element-uid> --dbl-click
```

#### Hover over Element

```bash
chrome-devtools input hover --uid <element-uid>
```

#### Fill Input Field

```bash
chrome-devtools input fill --uid <element-uid> --value "text"
```

#### Press Keyboard Key

```bash
chrome-devtools input press-key --key Enter
chrome-devtools input press-key --key "Control+C"
```

#### Drag and Drop

```bash
chrome-devtools input drag --from <source-uid> --to <target-uid>
```

#### Upload File

```bash
chrome-devtools input upload-file --uid <input-uid> --file /path/to/file.pdf
```

#### Handle Dialog

```bash
chrome-devtools input handle-dialog --action accept
chrome-devtools input handle-dialog --action dismiss
chrome-devtools input handle-dialog --action accept --prompt-text "my input"
```

### Navigation

#### List Pages

```bash
chrome-devtools nav list-pages
chrome-devtools nav list-pages --format json
```

#### Select Page

```bash
chrome-devtools nav select-page --index 0
```

#### Close Page

```bash
chrome-devtools nav close-page --index 1
```

#### Create New Page

```bash
chrome-devtools nav new-page --url https://example.com
chrome-devtools nav new-page --url https://example.com --timeout 30000
```

#### Navigate Page

```bash
chrome-devtools nav navigate --url https://example.com
```

#### Wait for Element or Text

```bash
chrome-devtools nav wait-for --selector "#my-element"
chrome-devtools nav wait-for --text "Welcome"
chrome-devtools nav wait-for --selector ".button" --timeout 5000
```

### Emulation

#### Emulate Device

```bash
chrome-devtools emulate device --name "iPhone 13"
chrome-devtools emulate device --name "iPad Pro"
```

#### Resize Viewport

```bash
chrome-devtools emulate resize --width 1920 --height 1080
```

### Performance

#### Start Performance Trace

```bash
chrome-devtools perf start-trace
```

#### Stop Performance Trace

```bash
chrome-devtools perf stop-trace --output trace.json
```

#### Analyze Performance

```bash
chrome-devtools perf analyze --url https://example.com
chrome-devtools perf analyze --url https://example.com --duration 5000 --format json
```

### Network

#### Start Monitoring

```bash
chrome-devtools network start-monitoring
```

#### List Network Requests

```bash
chrome-devtools network list-requests
chrome-devtools network list-requests --limit 10 --offset 0 --format toon
```

#### Get Request Details

```bash
chrome-devtools network get-request --id req-123
```

#### Clear Request History

```bash
chrome-devtools network clear
```

### Debugging

#### Start Console Monitoring

```bash
chrome-devtools debug start-console-monitoring
```

#### List Console Messages

```bash
chrome-devtools debug list-console
chrome-devtools debug list-console --types error,warning --format json
```

#### Get Console Message

```bash
chrome-devtools debug get-console --id msg-123
```

#### Clear Console History

```bash
chrome-devtools debug clear-console
```

#### Evaluate JavaScript

```bash
chrome-devtools debug evaluate --script "document.title"
chrome-devtools debug evaluate --script "window.innerWidth" --format json
```

#### Take Screenshot

```bash
chrome-devtools debug screenshot --path screenshot.png
chrome-devtools debug screenshot --path screenshot.jpg --type jpeg --quality 80
chrome-devtools debug screenshot --full-page --path full-page.png
```

#### Take Page Snapshot

```bash
chrome-devtools debug snapshot
chrome-devtools debug snapshot --verbose
```

### Browser Management

#### Close Browser

```bash
chrome-devtools close
```

## Output Formats

### Text (Default)

Human-readable output format for console display.

```bash
chrome-devtools nav list-pages
```

### JSON

Standard JSON format for programmatic consumption.

```bash
chrome-devtools nav list-pages --format json
```

### TOON

Token-optimized format that reduces output size by ~58.9% compared to JSON, ideal for LLM processing.

```bash
chrome-devtools nav list-pages --format toon
```

## Advanced Usage

### Connecting to Existing Chrome Instance

#### Step 1: Start Chrome with Remote Debugging

**macOS:**
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-profile
```

**Linux:**
```bash
/usr/bin/google-chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-profile
```

**Windows:**
```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --remote-debugging-port=9222 ^
  --user-data-dir="%TEMP%\chrome-profile"
```

#### Step 2: Connect via CLI

```bash
chrome-devtools --browser-url http://127.0.0.1:9222 nav list-pages
```

### Using WebSocket Endpoint

```bash
# Get WebSocket URL from http://127.0.0.1:9222/json/version
chrome-devtools --ws-endpoint ws://127.0.0.1:9222/devtools/browser/<id> nav list-pages
```

### Headless Mode

```bash
chrome-devtools --headless nav new-page --url https://example.com
chrome-devtools --headless debug screenshot --path screenshot.png
```

### Custom Chrome Channel

```bash
chrome-devtools --channel canary nav new-page --url https://example.com
chrome-devtools --channel beta perf analyze --url https://example.com
```

### Isolated Mode (Temporary Profile)

```bash
chrome-devtools --isolated nav new-page --url https://example.com
```

## Examples

### Complete Automation Workflow

```bash
# 1. Start console and network monitoring
chrome-devtools debug start-console-monitoring
chrome-devtools network start-monitoring

# 2. Navigate to a page
chrome-devtools nav new-page --url https://example.com

# 3. Interact with the page
chrome-devtools input fill --uid input-email --value "user@example.com"
chrome-devtools input fill --uid input-password --value "password123"
chrome-devtools input click --uid button-login

# 4. Wait for navigation
chrome-devtools nav wait-for --text "Dashboard"

# 5. Take a screenshot
chrome-devtools debug screenshot --path dashboard.png

# 6. Get console errors
chrome-devtools debug list-console --types error --format json

# 7. Get network requests
chrome-devtools network list-requests --format toon

# 8. Clean up
chrome-devtools close
```

### Performance Testing

```bash
# Analyze performance with trace
chrome-devtools perf start-trace
chrome-devtools nav new-page --url https://example.com
chrome-devtools nav wait-for --timeout 5000
chrome-devtools perf stop-trace --output trace.json

# Or use the combined analyze command
chrome-devtools perf analyze \
  --url https://example.com \
  --duration 10000 \
  --format json > performance-report.json
```

### Mobile Emulation Testing

```bash
# Test on iPhone
chrome-devtools emulate device --name "iPhone 13"
chrome-devtools nav new-page --url https://example.com
chrome-devtools debug screenshot --path mobile-view.png

# Test on iPad
chrome-devtools emulate device --name "iPad Pro"
chrome-devtools nav navigate --url https://example.com
chrome-devtools debug screenshot --path tablet-view.png

# Custom viewport
chrome-devtools emulate resize --width 375 --height 667
```

## Architecture

This CLI wraps the [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) functionality using:

- **[Puppeteer](https://pptr.dev/)** - Browser automation
- **[Commander.js](https://github.com/tj/commander.js)** - CLI framework
- **[@pleaseai/cli-toolkit](https://github.com/passionfactory/cli-toolkit)** - Output formatting and utilities

### Project Structure

```
chrome-devtools-cli/
├── src/
│   ├── browser/         # Browser management utilities
│   ├── commands/        # Command implementations
│   │   ├── input.ts     # Input automation
│   │   ├── navigation.ts # Navigation commands
│   │   ├── emulation.ts # Device emulation
│   │   ├── performance.ts # Performance analysis
│   │   ├── network.ts   # Network inspection
│   │   └── debugging.ts # Debugging tools
│   ├── cli.ts          # CLI entry point
│   ├── types.ts        # TypeScript types
│   └── index.ts        # Library exports
├── references/
│   └── chrome-devtools-mcp/ # Submodule reference
└── package.json
```

## API Reference

The CLI can also be used programmatically:

```typescript
import {
  click,
  navigatePage,
  takeScreenshot,
  performanceAnalyzeInsight,
  getBrowser,
  closeBrowser,
} from '@pleaseai/chrome-devtools-cli'

// Navigate to a page
await navigatePage({ url: 'https://example.com' })

// Take a screenshot
const screenshot = await takeScreenshot({
  path: 'screenshot.png',
  fullPage: true,
})

// Analyze performance
const perfData = await performanceAnalyzeInsight({
  url: 'https://example.com',
})

// Clean up
await closeBrowser()
```

## Comparison with Chrome DevTools MCP

| Feature | Chrome DevTools MCP | Chrome DevTools CLI |
|---------|-------------------|-------------------|
| Interface | MCP Server | CLI Commands |
| Usage | AI Assistants (Claude, Copilot) | Command Line / Scripts |
| Output Format | MCP Protocol | JSON / TOON / Text |
| Browser Control | ✅ | ✅ |
| Performance Analysis | ✅ | ✅ |
| Network Inspection | ✅ | ✅ |
| Debugging Tools | ✅ | ✅ |
| Automation Scripts | ❌ | ✅ |
| Programmatic API | ❌ | ✅ |

## Requirements

- [Node.js](https://nodejs.org/) v20.19 or newer (LTS version)
- [Chrome](https://www.google.com/chrome/) current stable version or newer
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © PleaseAI

## Credits

This project wraps the excellent [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) by Google LLC.

## Related Projects

- [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) - MCP server for Chrome DevTools
- [@pleaseai/cli-toolkit](https://github.com/passionfactory/cli-toolkit) - CLI utilities for LLM-focused tools
- [Puppeteer](https://pptr.dev/) - Headless Chrome Node.js API

## Support

- [GitHub Issues](https://github.com/passionfactory/chrome-devtools-cli/issues)
- [Documentation](https://github.com/passionfactory/chrome-devtools-cli#readme)

---

**Author**: Minsu Lee ([@amondnet](https://github.com/amondnet))
