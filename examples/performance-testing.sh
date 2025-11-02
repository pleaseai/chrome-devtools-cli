#!/bin/bash

# Performance Testing Example

echo "=== Performance Testing Example ==="
echo ""

URLS=(
  "https://example.com"
  "https://google.com"
  "https://github.com"
)

for url in "${URLS[@]}"; do
  echo "Testing performance for: $url"

  # Analyze performance
  chrome-devtools perf analyze \
    --url "$url" \
    --duration 5000 \
    --format json > "perf-$(echo $url | sed 's/[^a-zA-Z0-9]/-/g').json"

  echo "  ✓ Performance report saved"

  # Take screenshot
  chrome-devtools debug screenshot \
    --path "screenshot-$(echo $url | sed 's/[^a-zA-Z0-9]/-/g').png" \
    --full-page

  echo "  ✓ Screenshot saved"
  echo ""
done

echo "=== Performance testing completed! ==="
