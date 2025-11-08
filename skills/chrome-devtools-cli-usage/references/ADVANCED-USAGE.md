# Advanced Usage

Advanced features and usage patterns for Chrome DevTools CLI.

## Connect to Existing Chrome Instance

Connect to an already-running Chrome instance with remote debugging enabled.

### Step 1: Start Chrome with Remote Debugging

#### macOS

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-profile
```

#### Linux

```bash
/usr/bin/google-chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-profile
```

#### Windows

```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --remote-debugging-port=9222 ^
  --user-data-dir="%TEMP%\chrome-profile"
```

### Step 2: Connect via CLI

```bash
chrome-devtools --browser-url http://127.0.0.1:9222 nav list-pages
```

This connects to the running Chrome instance without launching a new one.

## Use WebSocket Endpoint

For direct WebSocket connections:

### Step 1: Get WebSocket URL

Visit `http://127.0.0.1:9222/json/version` to get the WebSocket debugger URL.

Example response:

```json
{
  "Browser": "Chrome/120.0.6099.109",
  "Protocol-Version": "1.3",
  "User-Agent": "Mozilla/5.0...",
  "V8-Version": "12.0.267.8",
  "WebKit-Version": "537.36",
  "webSocketDebuggerUrl": "ws://127.0.0.1:9222/devtools/browser/abc123..."
}
```

### Step 2: Connect using WebSocket Endpoint

```bash
chrome-devtools --ws-endpoint ws://127.0.0.1:9222/devtools/browser/<id> nav list-pages
```

## Headless Mode

Run Chrome without a visible GUI, perfect for CI/CD and automated testing.

### Basic Headless Usage

```bash
chrome-devtools --headless nav new-page --url https://example.com
chrome-devtools --headless debug screenshot --path screenshot.png
```

### Headless with Custom Viewport

```bash
chrome-devtools --headless --viewport 1920x1080 nav new-page --url https://example.com
```

### Benefits

- Faster execution (no rendering overhead)
- Server/container compatible
- CI/CD friendly
- Lower resource usage

## Custom Chrome Channel

Test with different Chrome versions (stable, beta, dev, canary).

### Using Canary

```bash
chrome-devtools --channel canary nav new-page --url https://example.com
```

### Using Beta

```bash
chrome-devtools --channel beta perf analyze --url https://example.com
```

### Available Channels

- `stable` - Default stable release
- `beta` - Beta testing version
- `dev` - Developer version
- `canary` - Experimental nightly builds

## Isolated Mode (Temporary Profile)

Use a temporary user data directory for clean, isolated testing.

```bash
chrome-devtools --isolated nav new-page --url https://example.com
```

**Benefits:**

- Clean state for each run
- No cookies, cache, or history
- Reproducible test environment
- No impact on main Chrome profile

## Custom Chrome Executable

Specify a custom Chrome executable path.

```bash
chrome-devtools --executable-path /path/to/chrome nav new-page --url https://example.com
```

**Use cases:**

- Testing with specific Chrome build
- Using Chromium instead of Chrome
- Custom Chrome installation location

## Proxy Configuration

Route Chrome traffic through a proxy server.

```bash
chrome-devtools --proxy-server http://proxy.example.com:8080 nav new-page --url https://example.com
```

**Proxy formats:**

- HTTP: `http://proxy:port`
- HTTPS: `https://proxy:port`
- SOCKS5: `socks5://proxy:port`

## Accept Insecure Certificates

Ignore SSL/TLS certificate errors (for testing only).

```bash
chrome-devtools --accept-insecure-certs nav new-page --url https://self-signed.example.com
```

**Warning:** Only use for testing. Never use in production.

## Custom WebSocket Headers

Add custom headers to WebSocket connections.

```bash
chrome-devtools --ws-headers '{"Authorization":"Bearer token123"}' --ws-endpoint ws://... nav list-pages
```

Headers must be valid JSON format.

## Viewport Configuration

Set initial viewport size for all pages.

```bash
chrome-devtools --viewport 1280x720 nav new-page --url https://example.com
```

**Common viewport sizes:**

- Desktop: `1920x1080`, `1366x768`, `1280x720`
- Tablet: `768x1024`, `1024x768`
- Mobile: `375x667`, `414x896`, `360x640`

## Combining Options

Multiple global options can be combined:

```bash
chrome-devtools \
  --headless \
  --isolated \
  --viewport 1920x1080 \
  --accept-insecure-certs \
  --format json \
  nav new-page --url https://example.com
```

## Programmatic API Usage

Use Chrome DevTools CLI as a library in your TypeScript/JavaScript projects.

### Basic Usage

```typescript
import {
  click,
  closeBrowser,
  getBrowser,
  navigatePage,
  performanceAnalyzeInsight,
  takeScreenshot,
} from '@pleaseai/chrome-devtools-cli'

// Navigate to a page
await navigatePage({ url: 'https://example.com' })

// Take a screenshot
await takeScreenshot({
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

### Advanced Programmatic Usage

```typescript
import { evaluateScript, getBrowser, navigatePage } from '@pleaseai/chrome-devtools-cli'

// Get browser instance
const browser = await getBrowser({
  headless: true,
  viewport: { width: 1920, height: 1080 },
})

// Navigate
await navigatePage({ url: 'https://example.com' })

// Evaluate custom script
const result = await evaluateScript({
  script: 'document.querySelectorAll("a").length',
})

console.log(`Found ${result} links`)
```

## Environment Variables

Configure Chrome DevTools CLI via environment variables:

- `CHROME_PATH` - Default Chrome executable path
- `CHROME_USER_DATA_DIR` - Default user data directory
- `DEBUG` - Enable debug logging (set to `chrome-devtools:*`)

Example:

```bash
export DEBUG=chrome-devtools:*
export CHROME_PATH=/opt/google/chrome/chrome
chrome-devtools nav new-page --url https://example.com
```

## Remote Chrome (Docker/Container)

Connect to Chrome running in a container or remote server.

### Docker Chrome Setup

```bash
# Run Chrome in Docker with remote debugging
docker run -d -p 9222:9222 \
  --name chrome \
  zenika/alpine-chrome \
  --no-sandbox \
  --remote-debugging-address=0.0.0.0 \
  --remote-debugging-port=9222
```

### Connect to Remote Chrome

```bash
chrome-devtools --browser-url http://remote-host:9222 nav list-pages
```

## Security Considerations

When using remote debugging:

1. **Never expose remote debugging port publicly** - Bind to localhost only
2. **Use SSH tunneling for remote access** - Don't expose port 9222 to the internet
3. **Validate SSL certificates** - Don't use `--accept-insecure-certs` in production
4. **Limit access** - Use firewall rules to restrict access to debugging port

### SSH Tunnel Example

```bash
# On remote server, start Chrome with debugging on localhost only
chrome --remote-debugging-port=9222 --remote-debugging-address=127.0.0.1

# On local machine, create SSH tunnel
ssh -L 9222:localhost:9222 user@remote-host

# Connect via local tunnel
chrome-devtools --browser-url http://127.0.0.1:9222 nav list-pages
```

## Performance Optimization

Tips for optimal performance:

1. **Use headless mode** - Faster execution without UI rendering
2. **Disable images** - Add `--disable-images` flag when images not needed
3. **Use isolated mode** - Clean state, faster startup
4. **Limit viewport size** - Smaller viewport = faster rendering
5. **Use TOON format** - 58.9% token reduction for LLM workflows

## Troubleshooting

### Chrome Won't Start

```bash
# Check Chrome path
which google-chrome
which chromium

# Specify explicit path
chrome-devtools --executable-path /usr/bin/google-chrome nav new-page --url https://example.com
```

### Connection Refused

```bash
# Check if Chrome is running
ps aux | grep chrome

# Check remote debugging port
lsof -i :9222
```

### WebSocket Connection Failed

```bash
# Verify WebSocket URL
curl http://127.0.0.1:9222/json/version

# Test connection
chrome-devtools --browser-url http://127.0.0.1:9222 nav list-pages
```

## Architecture

Chrome DevTools CLI is built on:

- **[Puppeteer](https://pptr.dev/)** - Browser automation framework
- **[Commander.js](https://github.com/tj/commander.js)** - CLI framework
- **[@pleaseai/cli-toolkit](https://github.com/passionfactory/cli-toolkit)** - Output formatting and utilities

The tool wraps Puppeteer's API with a user-friendly CLI interface and adds features like TOON format output and simplified command structure.
