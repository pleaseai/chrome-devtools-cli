# Quick Reference Guide

## Installation

```bash
npm install -g @pleaseai/chrome-devtools-cli
```

## Common Commands

### Navigation

```bash
# Open new page
chrome-devtools nav new-page --url <url>

# Navigate
chrome-devtools nav navigate --url <url>

# List pages
chrome-devtools nav list-pages

# Select page
chrome-devtools nav select-page --index <n>

# Wait for element
chrome-devtools nav wait-for --selector <selector>
```

### Input

```bash
# Click
chrome-devtools input click --uid <uid>

# Fill
chrome-devtools input fill --uid <uid> --value <value>

# Press key
chrome-devtools input press-key --key <key>

# Drag
chrome-devtools input drag --from <uid> --to <uid>
```

### Debugging

```bash
# Screenshot
chrome-devtools debug screenshot --path <path>

# Evaluate JS
chrome-devtools debug evaluate --script <script>

# List console
chrome-devtools debug list-console

# Snapshot
chrome-devtools debug snapshot
```

### Performance

```bash
# Analyze
chrome-devtools perf analyze --url <url>

# Start trace
chrome-devtools perf start-trace

# Stop trace
chrome-devtools perf stop-trace --output <path>
```

### Network

```bash
# Start monitoring
chrome-devtools network start-monitoring

# List requests
chrome-devtools network list-requests

# Get request
chrome-devtools network get-request --id <id>
```

### Emulation

```bash
# Emulate device
chrome-devtools emulate device --name "<device>"

# Resize
chrome-devtools emulate resize --width <w> --height <h>
```

## Output Formats

```bash
# Text (default)
chrome-devtools nav list-pages

# JSON
chrome-devtools nav list-pages --format json

# TOON (58.9% smaller)
chrome-devtools nav list-pages --format toon
```

## Browser Options

```bash
# Headless
chrome-devtools --headless nav new-page --url <url>

# Connect to existing
chrome-devtools --browser-url http://127.0.0.1:9222 nav list-pages

# Custom channel
chrome-devtools --channel canary nav new-page --url <url>

# Isolated mode
chrome-devtools --isolated nav new-page --url <url>

# Custom viewport
chrome-devtools --viewport 1920x1080 nav new-page --url <url>
```

## Common Workflows

### Screenshot Workflow

```bash
chrome-devtools nav new-page --url https://example.com
chrome-devtools debug screenshot --path screenshot.png --full-page
chrome-devtools close
```

### Performance Testing

```bash
chrome-devtools perf analyze --url https://example.com --format json > perf.json
```

### Form Automation

```bash
chrome-devtools nav new-page --url https://example.com/form
chrome-devtools input fill --uid input-name --value "John"
chrome-devtools input fill --uid input-email --value "john@example.com"
chrome-devtools input click --uid button-submit
chrome-devtools nav wait-for --text "Success"
```

### Network Debugging

```bash
chrome-devtools network start-monitoring
chrome-devtools nav new-page --url https://example.com
chrome-devtools network list-requests --format json > requests.json
```

## Device Names

Common device names for emulation:

- iPhone 13
- iPhone 13 Pro
- iPhone 13 Pro Max
- iPhone SE
- iPad
- iPad Pro
- Galaxy S21
- Galaxy S21 Ultra
- Pixel 5
- Pixel 6

## Keyboard Keys

Common key names for press-key:

- Enter
- Escape
- Tab
- Backspace
- Delete
- ArrowUp, ArrowDown, ArrowLeft, ArrowRight
- Control+C, Control+V, Control+X
- Meta+A (Cmd+A on Mac)

## Exit Codes

- 0: Success
- 1: Error

## Environment Variables

None currently used.

## Tips

1. Use `--format json` for piping to jq or other tools
2. Use `--format toon` for LLM processing (58.9% smaller than JSON)
3. Use `--headless` for CI/CD environments
4. Use `--isolated` to avoid polluting your Chrome profile
5. Start monitoring before navigation to capture all requests/console messages
6. Use `--full-page` for complete screenshots
7. Set timeouts for unreliable networks: `--timeout 30000`

## Troubleshooting

### Browser won't start

```bash
# Check Chrome is installed
chrome --version

# Use specific executable
chrome-devtools --executable-path /path/to/chrome nav new-page --url <url>
```

### Can't connect to existing Chrome

```bash
# Check Chrome is running with remote debugging:
# macOS:
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-profile

# Then connect:
chrome-devtools --browser-url http://127.0.0.1:9222 nav list-pages
```

### Element not found

```bash
# Wait for element first
chrome-devtools nav wait-for --selector "#my-element" --timeout 10000
chrome-devtools input click --uid my-element
```

## Links

- [Full Documentation](../README.md)
- [API Reference](./API.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Examples](../examples/)
