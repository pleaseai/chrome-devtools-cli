#!/bin/bash

# Complete Automation Workflow Example

echo "=== Automation Workflow Example ==="
echo ""

# 1. Start monitoring
echo "Step 1: Starting monitoring..."
chrome-devtools debug start-console-monitoring
chrome-devtools network start-monitoring

# 2. Open the application
echo "Step 2: Opening application..."
chrome-devtools nav new-page --url https://example.com/login

# 3. Wait for page to load
echo "Step 3: Waiting for page load..."
chrome-devtools nav wait-for --selector "#login-form" --timeout 10000

# 4. Fill login form
echo "Step 4: Filling login form..."
chrome-devtools input fill --uid input-username --value "testuser"
chrome-devtools input fill --uid input-password --value "testpass123"

# 5. Submit form
echo "Step 5: Submitting form..."
chrome-devtools input click --uid button-submit

# 6. Wait for dashboard
echo "Step 6: Waiting for dashboard..."
chrome-devtools nav wait-for --text "Dashboard" --timeout 10000

# 7. Take screenshot
echo "Step 7: Taking screenshot..."
chrome-devtools debug screenshot --path dashboard-screenshot.png

# 8. Check for console errors
echo "Step 8: Checking console for errors..."
chrome-devtools debug list-console --types error --format json > console-errors.json

# 9. Export network requests
echo "Step 9: Exporting network requests..."
chrome-devtools network list-requests --format json > network-requests.json

# 10. Take page snapshot
echo "Step 10: Taking page snapshot..."
chrome-devtools debug snapshot > page-snapshot.html

# 11. Clean up
echo "Step 11: Cleaning up..."
chrome-devtools close

echo ""
echo "=== Automation completed! ==="
echo "Generated files:"
echo "  - dashboard-screenshot.png"
echo "  - console-errors.json"
echo "  - network-requests.json"
echo "  - page-snapshot.html"
