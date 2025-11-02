#!/bin/bash

# Basic Usage Examples for Chrome DevTools CLI

echo "=== Chrome DevTools CLI Examples ==="
echo ""

echo "1. Opening a new page..."
chrome-devtools nav new-page --url https://example.com

echo ""
echo "2. Taking a screenshot..."
chrome-devtools debug screenshot --path example-screenshot.png --full-page

echo ""
echo "3. Listing all pages..."
chrome-devtools nav list-pages --format json

echo ""
echo "4. Starting network monitoring..."
chrome-devtools network start-monitoring

echo ""
echo "5. Navigating to another page..."
chrome-devtools nav navigate --url https://google.com

echo ""
echo "6. Listing network requests..."
chrome-devtools network list-requests --format toon

echo ""
echo "7. Taking a performance snapshot..."
chrome-devtools perf analyze --format json > performance.json

echo ""
echo "8. Evaluating JavaScript..."
chrome-devtools debug evaluate --script "document.title" --format text

echo ""
echo "9. Closing browser..."
chrome-devtools close

echo ""
echo "=== Examples completed! ==="
