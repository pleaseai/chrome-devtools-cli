# Commands Reference

Complete command reference for Chrome DevTools CLI.

## Global Options

Available on all commands:

```bash
chrome-devtools [global-options] <command> [command-options]
```

### Connection Options

- `--browser-url <url>` - Connect to Chrome via port forwarding (e.g., http://127.0.0.1:9222)
- `--ws-endpoint <endpoint>` - WebSocket endpoint for Chrome connection
- `--ws-headers <headers>` - Custom WebSocket headers (JSON format)

### Browser Launch Options

- `--headless` - Run Chrome in headless mode (no GUI)
- `--executable-path <path>` - Custom Chrome executable path
- `--isolated` - Use temporary user data directory
- `--channel <channel>` - Chrome channel: stable, canary, beta, or dev

### Display Options

- `--viewport <viewport>` - Initial viewport size (e.g., 1280x720)

### Network Options

- `--proxy-server <proxy>` - Proxy server configuration
- `--accept-insecure-certs` - Ignore certificate errors

### Output Options

- `--format <format>` - Output format: json, toon, or text (default)

## Input Automation

Interact with page elements.

### Click on Element

```bash
# Single click
chrome-devtools input click --uid <element-uid>

# Double click
chrome-devtools input click --uid button-submit --dbl-click
```

**Options:**

- `--uid <string>` (required) - Element unique identifier
- `--dbl-click` - Perform double click instead of single click

### Hover over Element

```bash
chrome-devtools input hover --uid <element-uid>
```

**Options:**

- `--uid <string>` (required) - Element unique identifier

### Fill Input Field

```bash
chrome-devtools input fill --uid input-email --value "user@example.com"
```

**Options:**

- `--uid <string>` (required) - Input element unique identifier
- `--value <string>` (required) - Text to fill into the input

### Press Keyboard Key

```bash
# Single key
chrome-devtools input press-key --key Enter

# Key combination
chrome-devtools input press-key --key "Control+C"
```

**Options:**

- `--key <string>` (required) - Key or key combination to press

### Drag and Drop

```bash
chrome-devtools input drag --from <source-uid> --to <target-uid>
```

**Options:**

- `--from <string>` (required) - Source element unique identifier
- `--to <string>` (required) - Target element unique identifier

### Upload File

```bash
chrome-devtools input upload-file --uid file-input --file /path/to/file.pdf
```

**Options:**

- `--uid <string>` (required) - File input element unique identifier
- `--file <path>` (required) - Path to file to upload

### Handle Dialog

```bash
# Accept dialog (alert, confirm)
chrome-devtools input handle-dialog --action accept

# Dismiss dialog
chrome-devtools input handle-dialog --action dismiss

# Accept prompt with text
chrome-devtools input handle-dialog --action accept --prompt-text "my input"
```

**Options:**

- `--action <string>` (required) - Dialog action: accept or dismiss
- `--prompt-text <string>` - Text to enter for prompt dialogs (when action is accept)

## Navigation

Manage pages and navigation.

### List Pages

```bash
# Human-readable format
chrome-devtools nav list-pages

# JSON format
chrome-devtools nav list-pages --format json

# TOON format (token-optimized)
chrome-devtools nav list-pages --format toon
```

### Select Page

```bash
chrome-devtools nav select-page --index 0
```

**Options:**

- `--index <number>` (required) - Zero-based page index

### Close Page

```bash
chrome-devtools nav close-page --index 1
```

**Options:**

- `--index <number>` (required) - Zero-based page index

### Create New Page

```bash
# Basic usage
chrome-devtools nav new-page --url https://example.com

# With custom timeout
chrome-devtools nav new-page --url https://example.com --timeout 30000
```

**Options:**

- `--url <string>` (required) - URL to navigate to
- `--timeout <number>` - Navigation timeout in milliseconds (default: 30000)

### Navigate Page

```bash
chrome-devtools nav navigate --url https://example.com
```

**Options:**

- `--url <string>` (required) - URL to navigate to

### Wait for Element or Text

```bash
# Wait for CSS selector
chrome-devtools nav wait-for --selector "#my-element"

# Wait for text content
chrome-devtools nav wait-for --text "Welcome"

# Wait with custom timeout
chrome-devtools nav wait-for --selector ".button" --timeout 5000
```

**Options:**

- `--selector <string>` - CSS selector to wait for
- `--text <string>` - Text content to wait for
- `--timeout <number>` - Wait timeout in milliseconds (default: 30000)

**Note:** Either `--selector` or `--text` must be provided.

## Emulation

Device emulation and viewport control.

### Emulate Device

```bash
# iPhone emulation
chrome-devtools emulate device --name "iPhone 13"

# iPad emulation
chrome-devtools emulate device --name "iPad Pro"
```

**Options:**

- `--name <string>` (required) - Device name from Puppeteer's device list

**Common device names:**

- iPhone 13, iPhone 13 Pro, iPhone 13 Pro Max
- iPhone 12, iPhone 12 Pro
- iPad, iPad Pro, iPad Mini
- Galaxy S5, Galaxy S9+
- Pixel 5, Pixel 2

### Resize Viewport

```bash
chrome-devtools emulate resize --width 1920 --height 1080
```

**Options:**

- `--width <number>` (required) - Viewport width in pixels
- `--height <number>` (required) - Viewport height in pixels

## Performance

Performance tracing and analysis.

### Start Performance Trace

```bash
chrome-devtools perf start-trace
```

Begins recording performance trace. Perform actions, then stop the trace.

### Stop Performance Trace

```bash
chrome-devtools perf stop-trace --output trace.json
```

**Options:**

- `--output <path>` (required) - Path to save trace JSON file

### Analyze Performance

```bash
# Basic analysis
chrome-devtools perf analyze --url https://example.com

# With custom duration
chrome-devtools perf analyze --url https://example.com --duration 10000

# JSON output
chrome-devtools perf analyze --url https://example.com --format json
```

**Options:**

- `--url <string>` (required) - URL to analyze
- `--duration <number>` - Recording duration in milliseconds (default: 5000)
- `--format <string>` - Output format: text, json, or toon

## Network Inspection

Monitor and inspect network requests.

### Start Monitoring

```bash
chrome-devtools network start-monitoring
```

Begins monitoring network activity. Must be called before navigation to capture requests.

### List Network Requests

```bash
# All requests
chrome-devtools network list-requests

# Paginated
chrome-devtools network list-requests --limit 10 --offset 0

# Token-optimized format
chrome-devtools network list-requests --format toon

# JSON format
chrome-devtools network list-requests --format json
```

**Options:**

- `--limit <number>` - Maximum number of requests to return
- `--offset <number>` - Number of requests to skip
- `--format <string>` - Output format: text, json, or toon

### Get Request Details

```bash
chrome-devtools network get-request --id req-123
```

**Options:**

- `--id <string>` (required) - Request unique identifier

### Clear Request History

```bash
chrome-devtools network clear
```

Clears all recorded network requests.

## Debugging

Console monitoring and JavaScript execution.

### Start Console Monitoring

```bash
chrome-devtools debug start-console-monitoring
```

Begins monitoring console messages.

### List Console Messages

```bash
# All messages
chrome-devtools debug list-console

# Filter by types
chrome-devtools debug list-console --types error,warning

# JSON format
chrome-devtools debug list-console --format json
```

**Options:**

- `--types <string>` - Comma-separated message types: log, info, warning, error
- `--format <string>` - Output format: text, json, or toon

### Get Console Message

```bash
chrome-devtools debug get-console --id msg-123
```

**Options:**

- `--id <string>` (required) - Message unique identifier

### Clear Console History

```bash
chrome-devtools debug clear-console
```

Clears all recorded console messages.

### Evaluate JavaScript

```bash
# Simple expression
chrome-devtools debug evaluate --script "document.title"

# Complex script
chrome-devtools debug evaluate --script "window.innerWidth"

# JSON output
chrome-devtools debug evaluate --script "document.title" --format json
```

**Options:**

- `--script <string>` (required) - JavaScript code to evaluate
- `--format <string>` - Output format: text, json, or toon

### Take Screenshot

```bash
# Standard screenshot
chrome-devtools debug screenshot --path screenshot.png

# JPEG with quality
chrome-devtools debug screenshot --path screenshot.jpg --type jpeg --quality 80

# Full page screenshot
chrome-devtools debug screenshot --full-page --path full-page.png
```

**Options:**

- `--path <string>` (required) - Output file path
- `--type <string>` - Image type: png or jpeg (default: png)
- `--quality <number>` - JPEG quality 0-100 (default: 80)
- `--full-page` - Capture full scrollable page

### Take Page Snapshot

```bash
# Basic snapshot
chrome-devtools debug snapshot

# Verbose output
chrome-devtools debug snapshot --verbose
```

**Options:**

- `--verbose` - Include additional snapshot details

Returns a snapshot of the current page state including DOM structure and styles.

## Browser Management

### Close Browser

```bash
chrome-devtools close
```

Closes the browser instance and terminates all connections.

## Output Formats

All commands support multiple output formats via `--format` option:

### Text (Default)

Human-readable output for console display:

```bash
chrome-devtools nav list-pages
```

### JSON

Standard JSON format for programmatic consumption:

```bash
chrome-devtools nav list-pages --format json
```

### TOON (Token-Optimized)

Reduces output size by ~58.9% compared to JSON, ideal for LLM processing:

```bash
chrome-devtools nav list-pages --format toon
chrome-devtools network list-requests --format toon
```
