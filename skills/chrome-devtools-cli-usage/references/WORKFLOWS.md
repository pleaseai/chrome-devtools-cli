# Common Workflows

Practical workflow examples for Chrome DevTools CLI.

## Complete Automation Workflow

End-to-end browser automation with monitoring and debugging.

```bash
# 1. Start monitoring
chrome-devtools debug start-console-monitoring
chrome-devtools network start-monitoring

# 2. Navigate to page
chrome-devtools nav new-page --url https://example.com

# 3. Interact with page
chrome-devtools input fill --uid input-email --value "user@example.com"
chrome-devtools input fill --uid input-password --value "password123"
chrome-devtools input click --uid button-login

# 4. Wait for navigation
chrome-devtools nav wait-for --text "Dashboard"

# 5. Take screenshot
chrome-devtools debug screenshot --path dashboard.png

# 6. Get console errors
chrome-devtools debug list-console --types error --format json

# 7. Get network requests
chrome-devtools network list-requests --format toon

# 8. Clean up
chrome-devtools close
```

## Performance Testing

Measure and analyze page performance.

### Method 1: Manual Trace Control

```bash
# Start performance trace
chrome-devtools perf start-trace

# Navigate to page
chrome-devtools nav new-page --url https://example.com

# Wait for page to settle
chrome-devtools nav wait-for --timeout 5000

# Stop trace and save
chrome-devtools perf stop-trace --output trace.json

# Analyze trace file with Chrome DevTools
# Open chrome://tracing and load trace.json
```

### Method 2: Automated Analysis

```bash
# One-command performance analysis
chrome-devtools perf analyze \
  --url https://example.com \
  --duration 10000 \
  --format json > performance-report.json

# View results
cat performance-report.json | jq .
```

### Performance Testing Script

```bash
#!/bin/bash
# performance-test.sh

URLS=(
  "https://example.com"
  "https://example.com/products"
  "https://example.com/about"
)

for url in "${URLS[@]}"; do
  echo "Testing: $url"
  chrome-devtools --headless perf analyze \
    --url "$url" \
    --duration 5000 \
    --format json > "perf-$(basename "$url").json"
done

echo "Performance testing complete"
```

## Mobile Emulation Testing

Test responsive designs across different devices.

### iPhone Testing

```bash
# Test on iPhone 13
chrome-devtools emulate device --name "iPhone 13"
chrome-devtools nav new-page --url https://example.com
chrome-devtools debug screenshot --path mobile-iphone13.png

# Test on iPhone 12
chrome-devtools emulate device --name "iPhone 12"
chrome-devtools nav navigate --url https://example.com
chrome-devtools debug screenshot --path mobile-iphone12.png
```

### iPad Testing

```bash
# Test on iPad Pro
chrome-devtools emulate device --name "iPad Pro"
chrome-devtools nav new-page --url https://example.com
chrome-devtools debug screenshot --path tablet-ipadpro.png

# Test on iPad
chrome-devtools emulate device --name "iPad"
chrome-devtools nav navigate --url https://example.com
chrome-devtools debug screenshot --path tablet-ipad.png
```

### Custom Viewport Testing

```bash
# Test various viewport sizes
VIEWPORTS=("375x667" "414x896" "768x1024" "1920x1080")

for viewport in "${VIEWPORTS[@]}"; do
  chrome-devtools emulate resize --width ${viewport%x*} --height ${viewport#*x}
  chrome-devtools nav navigate --url https://example.com
  chrome-devtools debug screenshot --path "screenshot-${viewport}.png"
done
```

### Multi-Device Testing Script

```bash
#!/bin/bash
# multi-device-test.sh

DEVICES=(
  "iPhone 13"
  "iPhone 12"
  "iPad Pro"
  "Galaxy S9+"
  "Pixel 5"
)

URL="https://example.com"

for device in "${DEVICES[@]}"; do
  echo "Testing on: $device"

  # Emulate device
  chrome-devtools emulate device --name "$device"

  # Navigate
  chrome-devtools nav navigate --url "$URL"

  # Wait for load
  chrome-devtools nav wait-for --timeout 3000

  # Screenshot
  filename=$(echo "$device" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')
  chrome-devtools debug screenshot --path "screenshots/${filename}.png"
done

echo "Multi-device testing complete"
```

## CI/CD Integration

Automated browser testing in continuous integration pipelines.

### Basic CI Script

```bash
#!/bin/bash
# ci-browser-test.sh

set -e  # Exit on error

echo "Starting browser tests..."

# Start in headless mode
chrome-devtools --headless nav new-page --url https://staging.example.com

# Wait for page load
chrome-devtools --headless nav wait-for --text "Welcome"

# Take screenshot for visual verification
chrome-devtools --headless debug screenshot --path ci-screenshot.png --full-page

# Check for console errors
ERRORS=$(chrome-devtools --headless debug list-console --types error --format json)
if [ "$ERRORS" != "[]" ]; then
  echo "Console errors found:"
  echo "$ERRORS"
  exit 1
fi

# Analyze performance
chrome-devtools --headless perf analyze \
  --url https://staging.example.com \
  --format json > perf-results.json

# Verify performance metrics
LOAD_TIME=$(cat perf-results.json | jq '.loadTime')
if [ "$LOAD_TIME" -gt 3000 ]; then
  echo "Load time too slow: ${LOAD_TIME}ms"
  exit 1
fi

# Clean up
chrome-devtools close

echo "Browser tests passed!"
```

### GitHub Actions Workflow

```yaml
name: Browser Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Install Chrome DevTools CLI
        run: |
          curl -fsSL https://raw.githubusercontent.com/pleaseai/chrome-devtools-cli/main/install.sh | bash

      - name: Run browser tests
        run: |
          chrome-devtools --headless nav new-page --url https://staging.example.com
          chrome-devtools --headless debug screenshot --path screenshot.png
          chrome-devtools --headless perf analyze --url https://staging.example.com --format json > perf.json

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            screenshot.png
            perf.json
```

## Form Automation

Automate form filling and submission.

```bash
# Navigate to form
chrome-devtools nav new-page --url https://example.com/signup

# Fill form fields
chrome-devtools input fill --uid input-name --value "John Doe"
chrome-devtools input fill --uid input-email --value "john@example.com"
chrome-devtools input fill --uid input-password --value "SecurePass123"
chrome-devtools input fill --uid input-confirm-password --value "SecurePass123"

# Select checkbox
chrome-devtools input click --uid checkbox-terms

# Submit form
chrome-devtools input click --uid button-submit

# Wait for success message
chrome-devtools nav wait-for --text "Registration successful"

# Take confirmation screenshot
chrome-devtools debug screenshot --path signup-success.png
```

## API Testing with Network Monitoring

Monitor and validate API requests.

```bash
# Start network monitoring
chrome-devtools network start-monitoring

# Navigate to app
chrome-devtools nav new-page --url https://app.example.com

# Trigger API calls (e.g., by clicking button)
chrome-devtools input click --uid button-load-data

# Wait for requests to complete
sleep 2

# Get all network requests
chrome-devtools network list-requests --format json > network-log.json

# Filter API requests
cat network-log.json | jq '.[] | select(.url | contains("/api/"))'

# Check for failed requests
FAILED=$(cat network-log.json | jq '[.[] | select(.status >= 400)] | length')
if [ "$FAILED" -gt 0 ]; then
  echo "Found $FAILED failed requests"
  exit 1
fi
```

## Screenshot Comparison Testing

Visual regression testing by comparing screenshots.

```bash
#!/bin/bash
# visual-regression-test.sh

URL="https://example.com"
BASELINE_DIR="screenshots/baseline"
CURRENT_DIR="screenshots/current"

# Take current screenshots
mkdir -p "$CURRENT_DIR"

PAGES=("home" "about" "products" "contact")

for page in "${PAGES[@]}"; do
  chrome-devtools --headless nav new-page --url "$URL/$page"
  chrome-devtools --headless debug screenshot \
    --path "$CURRENT_DIR/${page}.png" \
    --full-page
done

# Compare with baseline (using ImageMagick or similar)
for page in "${PAGES[@]}"; do
  if [ -f "$BASELINE_DIR/${page}.png" ]; then
    # Use compare tool (ImageMagick)
    compare -metric RMSE \
      "$BASELINE_DIR/${page}.png" \
      "$CURRENT_DIR/${page}.png" \
      "$CURRENT_DIR/${page}-diff.png" 2>&1
  else
    echo "No baseline for $page, creating one"
    cp "$CURRENT_DIR/${page}.png" "$BASELINE_DIR/${page}.png"
  fi
done
```

## Multi-Page Testing

Test multiple pages in sequence.

```bash
#!/bin/bash
# multi-page-test.sh

PAGES=(
  "https://example.com"
  "https://example.com/products"
  "https://example.com/about"
  "https://example.com/contact"
)

# Start monitoring
chrome-devtools debug start-console-monitoring
chrome-devtools network start-monitoring

for page in "${PAGES[@]}"; do
  echo "Testing: $page"

  # Navigate
  chrome-devtools nav navigate --url "$page"

  # Wait for load
  chrome-devtools nav wait-for --timeout 5000

  # Screenshot
  filename=$(echo "$page" | sed 's|https://||' | tr '/' '-')
  chrome-devtools debug screenshot --path "screenshots/${filename}.png"

  # Check console errors
  ERRORS=$(chrome-devtools debug list-console --types error --format json)
  if [ "$ERRORS" != "[]" ]; then
    echo "Errors on $page:"
    echo "$ERRORS"
  fi
done

# Get all network requests
chrome-devtools network list-requests --format json > all-requests.json

chrome-devtools close
```

## E2E User Journey Testing

Test complete user flows.

```bash
#!/bin/bash
# e2e-user-journey.sh

echo "Testing user registration flow..."

# 1. Home page
chrome-devtools nav new-page --url https://example.com
chrome-devtools debug screenshot --path journey-01-home.png

# 2. Click signup
chrome-devtools input click --uid button-signup
chrome-devtools nav wait-for --text "Create Account"
chrome-devtools debug screenshot --path journey-02-signup.png

# 3. Fill registration form
chrome-devtools input fill --uid input-email --value "test@example.com"
chrome-devtools input fill --uid input-password --value "Test123!"
chrome-devtools input click --uid button-register

# 4. Email verification page
chrome-devtools nav wait-for --text "Verify Email"
chrome-devtools debug screenshot --path journey-03-verify.png

# 5. Simulate email verification (direct navigation)
chrome-devtools nav navigate --url https://example.com/verify?token=test123

# 6. Dashboard
chrome-devtools nav wait-for --text "Dashboard"
chrome-devtools debug screenshot --path journey-04-dashboard.png

echo "User journey test complete!"
```

## Accessibility Testing

Basic accessibility checks using JavaScript evaluation.

```bash
# Navigate to page
chrome-devtools nav new-page --url https://example.com

# Check for alt text on images
chrome-devtools debug evaluate --script "
  Array.from(document.images)
    .filter(img => !img.alt)
    .map(img => img.src)
" --format json > images-without-alt.json

# Check for proper heading hierarchy
chrome-devtools debug evaluate --script "
  Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'))
    .map(h => ({ tag: h.tagName, text: h.textContent.trim() }))
" --format json > heading-structure.json

# Check for form labels
chrome-devtools debug evaluate --script "
  Array.from(document.querySelectorAll('input'))
    .filter(input => !input.labels || input.labels.length === 0)
    .map(input => ({ id: input.id, type: input.type }))
" --format json > inputs-without-labels.json
```

## Load Testing

Simulate multiple users/sessions.

```bash
#!/bin/bash
# load-test.sh

CONCURRENT=5
URL="https://example.com"

for i in $(seq 1 $CONCURRENT); do
  (
    echo "Session $i starting..."
    chrome-devtools --isolated --headless nav new-page --url "$URL"
    chrome-devtools --headless perf analyze --url "$URL" \
      --format json > "perf-session-$i.json"
    echo "Session $i complete"
  ) &
done

wait
echo "Load test complete with $CONCURRENT concurrent sessions"
```

## Tips and Best Practices

### 1. Use TOON Format for LLM Workflows

```bash
# Reduces token usage by ~58.9%
chrome-devtools network list-requests --format toon
```

### 2. Headless Mode for Automation

```bash
# Faster execution, lower resources
chrome-devtools --headless nav new-page --url https://example.com
```

### 3. Isolated Mode for Clean State

```bash
# Reproducible tests
chrome-devtools --isolated nav new-page --url https://example.com
```

### 4. Network Monitoring Before Navigation

```bash
# Start monitoring first to capture all requests
chrome-devtools network start-monitoring
chrome-devtools nav new-page --url https://example.com
```

### 5. Error Handling in Scripts

```bash
set -e  # Exit on error
trap cleanup EXIT  # Cleanup on exit

cleanup() {
  chrome-devtools close
}

# Your script here
```
