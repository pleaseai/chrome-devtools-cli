# API Reference

This document describes the programmatic API for using Chrome DevTools CLI as a library.

## Installation

```bash
npm install @pleaseai/chrome-devtools-cli
# or
bun add @pleaseai/chrome-devtools-cli
```

## Browser Management

### `getBrowser(options?: BrowserOptions): Promise<Browser>`

Get or launch a browser instance.

```typescript
import { getBrowser } from '@pleaseai/chrome-devtools-cli'

const browser = await getBrowser({
  headless: true,
  viewport: '1920x1080',
})
```

### `getPage(): Promise<Page>`

Get the current active page.

```typescript
import { getPage } from '@pleaseai/chrome-devtools-cli'

const page = await getPage()
```

### `closeBrowser(): Promise<void>`

Close the browser instance.

```typescript
import { closeBrowser } from '@pleaseai/chrome-devtools-cli'

await closeBrowser()
```

### `listPages(): Promise<Page[]>`

List all open pages.

```typescript
import { listPages } from '@pleaseai/chrome-devtools-cli'

const pages = await listPages()
console.log(`${pages.length} pages open`)
```

### `newPage(): Promise<Page>`

Create a new page.

```typescript
import { newPage } from '@pleaseai/chrome-devtools-cli'

const page = await newPage()
await page.goto('https://example.com')
```

### `selectPage(index: number): Promise<Page>`

Select a page by index.

```typescript
import { selectPage } from '@pleaseai/chrome-devtools-cli'

const page = await selectPage(0)
```

### `closePage(index: number): Promise<void>`

Close a page by index.

```typescript
import { closePage } from '@pleaseai/chrome-devtools-cli'

await closePage(1)
```

## Input Automation

### `click(options: ClickOptions): Promise<void>`

Click on an element.

```typescript
import { click } from '@pleaseai/chrome-devtools-cli'

await click({ uid: 'button-submit' })
await click({ uid: 'button-submit', dblClick: true })
```

### `hover(uid: string): Promise<void>`

Hover over an element.

```typescript
import { hover } from '@pleaseai/chrome-devtools-cli'

await hover('menu-item')
```

### `fill(options: FillOptions): Promise<void>`

Fill an input field.

```typescript
import { fill } from '@pleaseai/chrome-devtools-cli'

await fill({ uid: 'input-email', value: 'user@example.com' })
```

### `pressKey(key: string): Promise<void>`

Press a keyboard key.

```typescript
import { pressKey } from '@pleaseai/chrome-devtools-cli'

await pressKey('Enter')
await pressKey('Control+C')
```

### `drag(fromUid: string, toUid: string): Promise<void>`

Drag an element to another element.

```typescript
import { drag } from '@pleaseai/chrome-devtools-cli'

await drag('item-1', 'dropzone')
```

### `uploadFile(uid: string, filePath: string): Promise<void>`

Upload a file to a file input.

```typescript
import { uploadFile } from '@pleaseai/chrome-devtools-cli'

await uploadFile('file-input', '/path/to/file.pdf')
```

### `handleDialog(action: 'accept' | 'dismiss', promptText?: string): Promise<void>`

Handle browser dialogs.

```typescript
import { handleDialog } from '@pleaseai/chrome-devtools-cli'

await handleDialog('accept')
await handleDialog('accept', 'my input text')
await handleDialog('dismiss')
```

### `fillForm(elements: FillFormField[]): Promise<void>`

Fill multiple form fields at once.

```typescript
import { fillForm } from '@pleaseai/chrome-devtools-cli'

await fillForm([
  { uid: 'input-name', value: 'John Doe' },
  { uid: 'input-email', value: 'john@example.com' },
  { uid: 'input-phone', value: '123-456-7890' },
])
```

## Navigation

### `navigatePage(options: NavigateOptions): Promise<void>`

Navigate the current page to a URL.

```typescript
import { navigatePage } from '@pleaseai/chrome-devtools-cli'

await navigatePage({ url: 'https://example.com' })
await navigatePage({ url: 'https://example.com', timeout: 30000 })
```

### `waitFor(params: WaitForOptions): Promise<void>`

Wait for a selector or text to appear.

```typescript
import { waitFor } from '@pleaseai/chrome-devtools-cli'

await waitFor({ selector: '#content' })
await waitFor({ text: 'Welcome' })
await waitFor({ selector: '.button', timeout: 5000 })
```

## Emulation

### `emulate(options: EmulateOptions): Promise<void>`

Emulate a device or set custom viewport/user agent.

```typescript
import { emulate } from '@pleaseai/chrome-devtools-cli'

await emulate({ device: 'iPhone 13' })
await emulate({ viewport: { width: 1920, height: 1080 } })
await emulate({ userAgent: 'Custom User Agent' })
```

### `resizePage(width: number, height: number): Promise<void>`

Resize the viewport.

```typescript
import { resizePage } from '@pleaseai/chrome-devtools-cli'

await resizePage(1920, 1080)
```

## Performance

### `performanceStartTrace(): Promise<void>`

Start performance tracing.

```typescript
import { performanceStartTrace } from '@pleaseai/chrome-devtools-cli'

await performanceStartTrace()
```

### `performanceStopTrace(): Promise<Buffer>`

Stop performance tracing and get trace data.

```typescript
import { performanceStopTrace } from '@pleaseai/chrome-devtools-cli'

const trace = await performanceStopTrace()
await Bun.write('trace.json', trace)
```

### `performanceAnalyzeInsight(options?: PerformanceOptions): Promise<any>`

Analyze page performance.

```typescript
import { performanceAnalyzeInsight } from '@pleaseai/chrome-devtools-cli'

const perf = await performanceAnalyzeInsight({
  url: 'https://example.com',
  duration: 5000,
})

console.log('Metrics:', perf.metrics)
console.log('Timing:', perf.timing)
```

## Network

### `startNetworkMonitoring(): void`

Start monitoring network requests.

```typescript
import { startNetworkMonitoring } from '@pleaseai/chrome-devtools-cli'

startNetworkMonitoring()
```

### `listNetworkRequests(options?: NetworkRequestOptions): Promise<NetworkRequest[]>`

List captured network requests.

```typescript
import { listNetworkRequests } from '@pleaseai/chrome-devtools-cli'

const requests = await listNetworkRequests()
const firstTen = await listNetworkRequests({ limit: 10, offset: 0 })
```

### `getNetworkRequest(requestId: string): Promise<NetworkRequest | undefined>`

Get details of a specific network request.

```typescript
import { getNetworkRequest } from '@pleaseai/chrome-devtools-cli'

const request = await getNetworkRequest('req-123')
console.log(request?.url, request?.method)
```

### `clearNetworkRequests(): void`

Clear network request history.

```typescript
import { clearNetworkRequests } from '@pleaseai/chrome-devtools-cli'

clearNetworkRequests()
```

## Debugging

### `startConsoleMonitoring(): void`

Start monitoring console messages.

```typescript
import { startConsoleMonitoring } from '@pleaseai/chrome-devtools-cli'

startConsoleMonitoring()
```

### `listConsoleMessages(options?: ConsoleMessageOptions): Promise<ConsoleMessageData[]>`

List captured console messages.

```typescript
import { listConsoleMessages } from '@pleaseai/chrome-devtools-cli'

const messages = await listConsoleMessages()
const errors = await listConsoleMessages({ types: ['error'] })
```

### `getConsoleMessage(messageId: string): Promise<ConsoleMessageData | undefined>`

Get details of a specific console message.

```typescript
import { getConsoleMessage } from '@pleaseai/chrome-devtools-cli'

const message = await getConsoleMessage('msg-123')
console.log(message?.text)
```

### `clearConsoleMessages(): void`

Clear console message history.

```typescript
import { clearConsoleMessages } from '@pleaseai/chrome-devtools-cli'

clearConsoleMessages()
```

### `evaluateScript(script: string): Promise<any>`

Evaluate JavaScript in the page context.

```typescript
import { evaluateScript } from '@pleaseai/chrome-devtools-cli'

const title = await evaluateScript('document.title')
const data = await evaluateScript('JSON.stringify(window.appData)')
```

### `takeScreenshot(options?: ScreenshotOptions): Promise<Buffer | string>`

Take a screenshot of the page.

```typescript
import { takeScreenshot } from '@pleaseai/chrome-devtools-cli'

await takeScreenshot({ path: 'screenshot.png' })
await takeScreenshot({ path: 'screenshot.jpg', type: 'jpeg', quality: 80 })
const buffer = await takeScreenshot({ fullPage: true })
```

### `takeSnapshot(options?: SnapshotOptions): Promise<string>`

Take a snapshot of page content.

```typescript
import { takeSnapshot } from '@pleaseai/chrome-devtools-cli'

const html = await takeSnapshot()
const verbose = await takeSnapshot({ verbose: true })
```

## Types

### `BrowserOptions`

```typescript
interface BrowserOptions {
  browserUrl?: string
  wsEndpoint?: string
  wsHeaders?: string
  headless?: boolean
  executablePath?: string
  isolated?: boolean
  channel?: 'stable' | 'canary' | 'beta' | 'dev'
  viewport?: string
  proxyServer?: string
  acceptInsecureCerts?: boolean
  chromeArgs?: string[]
}
```

### `ClickOptions`

```typescript
interface ClickOptions {
  uid: string
  dblClick?: boolean
}
```

### `FillOptions`

```typescript
interface FillOptions {
  uid: string
  value: string
}
```

### `NavigateOptions`

```typescript
interface NavigateOptions {
  url: string
  timeout?: number
}
```

### `ScreenshotOptions`

```typescript
interface ScreenshotOptions {
  path?: string
  fullPage?: boolean
  type?: 'png' | 'jpeg' | 'webp'
  quality?: number
}
```

### `PerformanceOptions`

```typescript
interface PerformanceOptions {
  url?: string
  duration?: number
}
```

### `EmulateOptions`

```typescript
interface EmulateOptions {
  device?: string
  viewport?: {
    width: number
    height: number
  }
  userAgent?: string
}
```

## Complete Example

```typescript
import {
  click,
  closeBrowser,
  fill,
  getBrowser,
  listConsoleMessages,
  listNetworkRequests,
  navigatePage,
  startConsoleMonitoring,
  startNetworkMonitoring,
  takeScreenshot,
  waitFor,
} from '@pleaseai/chrome-devtools-cli'

async function automateLogin() {
  // Initialize
  await getBrowser({ headless: false })
  startNetworkMonitoring()
  startConsoleMonitoring()

  // Navigate to login page
  await navigatePage({ url: 'https://example.com/login' })

  // Fill login form
  await fill({ uid: 'input-email', value: 'user@example.com' })
  await fill({ uid: 'input-password', value: 'password123' })
  await click({ uid: 'button-submit' })

  // Wait for dashboard
  await waitFor({ text: 'Dashboard', timeout: 10000 })

  // Capture results
  await takeScreenshot({ path: 'dashboard.png' })

  const requests = await listNetworkRequests()
  console.log(`${requests.length} network requests`)

  const errors = await listConsoleMessages({ types: ['error'] })
  if (errors.length > 0) {
    console.log(`Found ${errors.length} console errors`)
  }

  // Clean up
  await closeBrowser()
}

automateLogin().catch(console.error)
```
