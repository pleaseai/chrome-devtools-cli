#!/usr/bin/env node
/**
 * CLI entry point for Chrome DevTools CLI
 */

import { Command } from 'commander'
import { outputData, outputJson, outputToon } from '@pleaseai/cli-toolkit'
import type { OutputFormat } from '@pleaseai/cli-toolkit'
import * as input from './commands/input.js'
import * as navigation from './commands/navigation.js'
import * as emulation from './commands/emulation.js'
import * as performance from './commands/performance.js'
import * as network from './commands/network.js'
import * as debugging from './commands/debugging.js'
import { closeBrowser, getBrowser } from './browser/index.js'
import type { BrowserOptions } from './types.js'

const program = new Command()

program
  .name('chrome-devtools')
  .description('CLI wrapper for Chrome DevTools MCP - Control and inspect Chrome')
  .version('0.1.0')

// Global options
program
  .option('--browser-url <url>', 'Connect to running Chrome via port forwarding')
  .option('--ws-endpoint <endpoint>', 'WebSocket endpoint for Chrome')
  .option('--ws-headers <headers>', 'Custom WebSocket headers (JSON)')
  .option('--headless', 'Run in headless mode')
  .option('--executable-path <path>', 'Path to Chrome executable')
  .option('--isolated', 'Use temporary user data directory')
  .option('--channel <channel>', 'Chrome channel (stable|canary|beta|dev)')
  .option('--viewport <viewport>', 'Initial viewport size (e.g., 1280x720)')
  .option('--proxy-server <proxy>', 'Proxy server configuration')
  .option('--accept-insecure-certs', 'Ignore certificate errors')
  .option('--format <format>', 'Output format (json|toon|text)', 'text')

// ============================================================================
// Input Automation Commands
// ============================================================================

const inputCmd = program.command('input').description('Input automation commands')

inputCmd
  .command('click')
  .description('Click on an element')
  .requiredOption('--uid <uid>', 'Element UID')
  .option('--dbl-click', 'Double click')
  .action(async (options) => {
    try {
      await input.click({ uid: options.uid, dblClick: options.dblClick })
      console.log('Successfully clicked element')
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

inputCmd
  .command('hover')
  .description('Hover over an element')
  .requiredOption('--uid <uid>', 'Element UID')
  .action(async (options) => {
    try {
      await input.hover(options.uid)
      console.log('Successfully hovered over element')
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

inputCmd
  .command('fill')
  .description('Fill an input field')
  .requiredOption('--uid <uid>', 'Element UID')
  .requiredOption('--value <value>', 'Value to fill')
  .action(async (options) => {
    try {
      await input.fill({ uid: options.uid, value: options.value })
      console.log('Successfully filled input')
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

inputCmd
  .command('press-key')
  .description('Press a keyboard key')
  .requiredOption('--key <key>', 'Key to press')
  .action(async (options) => {
    try {
      await input.pressKey(options.key)
      console.log('Successfully pressed key')
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

inputCmd
  .command('drag')
  .description('Drag element to another element')
  .requiredOption('--from <fromUid>', 'Source element UID')
  .requiredOption('--to <toUid>', 'Target element UID')
  .action(async (options) => {
    try {
      await input.drag(options.from, options.to)
      console.log('Successfully dragged element')
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

inputCmd
  .command('upload-file')
  .description('Upload file to input element')
  .requiredOption('--uid <uid>', 'File input element UID')
  .requiredOption('--file <path>', 'File path to upload')
  .action(async (options) => {
    try {
      await input.uploadFile(options.uid, options.file)
      console.log('Successfully uploaded file')
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

inputCmd
  .command('handle-dialog')
  .description('Handle browser dialog')
  .requiredOption('--action <action>', 'Action: accept or dismiss')
  .option('--prompt-text <text>', 'Text for prompt dialog')
  .action(async (options) => {
    try {
      await input.handleDialog(options.action, options.promptText)
      console.log('Dialog handler set')
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

// ============================================================================
// Navigation Commands
// ============================================================================

const navCmd = program.command('nav').description('Navigation commands')

navCmd
  .command('list-pages')
  .description('List all open pages')
  .action(async (options, command) => {
    try {
      const pages = await navigation.listPages()
      const format = command.optsWithGlobals().format as OutputFormat
      outputData(pages, format)
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

navCmd
  .command('select-page')
  .description('Select a page by index')
  .requiredOption('--index <index>', 'Page index', Number.parseInt)
  .action(async (options) => {
    try {
      await navigation.selectPage(options.index)
      console.log(`Selected page ${options.index}`)
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

navCmd
  .command('close-page')
  .description('Close a page by index')
  .requiredOption('--index <index>', 'Page index', Number.parseInt)
  .action(async (options) => {
    try {
      await navigation.closePage(options.index)
      console.log(`Closed page ${options.index}`)
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

navCmd
  .command('new-page')
  .description('Create a new page')
  .requiredOption('--url <url>', 'URL to navigate to')
  .option('--timeout <ms>', 'Navigation timeout in ms', Number.parseInt)
  .action(async (options) => {
    try {
      await navigation.newPage(options.url, options.timeout)
      console.log('Created new page')
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

navCmd
  .command('navigate')
  .description('Navigate current page to URL')
  .requiredOption('--url <url>', 'URL to navigate to')
  .option('--timeout <ms>', 'Navigation timeout in ms', Number.parseInt)
  .action(async (options) => {
    try {
      await navigation.navigatePage({ url: options.url, timeout: options.timeout })
      console.log(`Navigated to ${options.url}`)
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

navCmd
  .command('wait-for')
  .description('Wait for element or text')
  .option('--selector <selector>', 'CSS selector to wait for')
  .option('--text <text>', 'Text to wait for')
  .option('--timeout <ms>', 'Timeout in ms', Number.parseInt)
  .action(async (options) => {
    try {
      await navigation.waitFor({
        selector: options.selector,
        text: options.text,
        timeout: options.timeout,
      })
      console.log('Wait condition met')
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

// ============================================================================
// Emulation Commands
// ============================================================================

const emulateCmd = program.command('emulate').description('Emulation commands')

emulateCmd
  .command('device')
  .description('Emulate a device')
  .requiredOption('--name <name>', 'Device name')
  .action(async (options) => {
    try {
      await emulation.emulate({ device: options.name })
      console.log(`Emulating device: ${options.name}`)
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

emulateCmd
  .command('resize')
  .description('Resize viewport')
  .requiredOption('--width <width>', 'Width in pixels', Number.parseInt)
  .requiredOption('--height <height>', 'Height in pixels', Number.parseInt)
  .action(async (options) => {
    try {
      await emulation.resizePage(options.width, options.height)
      console.log(`Resized to ${options.width}x${options.height}`)
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

// ============================================================================
// Performance Commands
// ============================================================================

const perfCmd = program.command('perf').description('Performance analysis commands')

perfCmd
  .command('start-trace')
  .description('Start performance trace')
  .action(async () => {
    try {
      await performance.performanceStartTrace()
      console.log('Performance tracing started')
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

perfCmd
  .command('stop-trace')
  .description('Stop performance trace')
  .option('--output <path>', 'Output file path')
  .action(async (options) => {
    try {
      const trace = await performance.performanceStopTrace()
      if (options.output) {
        await Bun.write(options.output, trace)
        console.log(`Trace saved to ${options.output}`)
      }
      else {
        console.log(trace.toString())
      }
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

perfCmd
  .command('analyze')
  .description('Analyze page performance')
  .option('--url <url>', 'URL to analyze')
  .option('--duration <ms>', 'Trace duration in ms', Number.parseInt)
  .action(async (options, command) => {
    try {
      const result = await performance.performanceAnalyzeInsight({
        url: options.url,
        duration: options.duration,
      })
      const format = command.optsWithGlobals().format as OutputFormat
      outputData(result, format)
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

// ============================================================================
// Network Commands
// ============================================================================

const netCmd = program.command('network').description('Network inspection commands')

netCmd
  .command('start-monitoring')
  .description('Start network request monitoring')
  .action(() => {
    network.startNetworkMonitoring()
    console.log('Network monitoring started')
  })

netCmd
  .command('list-requests')
  .description('List network requests')
  .option('--limit <limit>', 'Maximum number of requests', Number.parseInt)
  .option('--offset <offset>', 'Offset for pagination', Number.parseInt)
  .action(async (options, command) => {
    try {
      const requests = await network.listNetworkRequests({
        limit: options.limit,
        offset: options.offset,
      })
      const format = command.optsWithGlobals().format as OutputFormat
      outputData(requests, format)
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

netCmd
  .command('get-request')
  .description('Get network request details')
  .requiredOption('--id <id>', 'Request ID')
  .action(async (options, command) => {
    try {
      const request = await network.getNetworkRequest(options.id)
      if (!request) {
        console.error('Request not found')
        process.exit(1)
      }
      const format = command.optsWithGlobals().format as OutputFormat
      outputData(request, format)
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

netCmd
  .command('clear')
  .description('Clear network request history')
  .action(() => {
    network.clearNetworkRequests()
    console.log('Network requests cleared')
  })

// ============================================================================
// Debugging Commands
// ============================================================================

const debugCmd = program.command('debug').description('Debugging commands')

debugCmd
  .command('start-console-monitoring')
  .description('Start console message monitoring')
  .action(() => {
    debugging.startConsoleMonitoring()
    console.log('Console monitoring started')
  })

debugCmd
  .command('list-console')
  .description('List console messages')
  .option('--limit <limit>', 'Maximum number of messages', Number.parseInt)
  .option('--offset <offset>', 'Offset for pagination', Number.parseInt)
  .option('--types <types>', 'Message types (comma-separated)')
  .action(async (options, command) => {
    try {
      const messages = await debugging.listConsoleMessages({
        limit: options.limit,
        offset: options.offset,
        types: options.types?.split(','),
      })
      const format = command.optsWithGlobals().format as OutputFormat
      outputData(messages, format)
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

debugCmd
  .command('get-console')
  .description('Get console message details')
  .requiredOption('--id <id>', 'Message ID')
  .action(async (options, command) => {
    try {
      const message = await debugging.getConsoleMessage(options.id)
      if (!message) {
        console.error('Message not found')
        process.exit(1)
      }
      const format = command.optsWithGlobals().format as OutputFormat
      outputData(message, format)
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

debugCmd
  .command('clear-console')
  .description('Clear console message history')
  .action(() => {
    debugging.clearConsoleMessages()
    console.log('Console messages cleared')
  })

debugCmd
  .command('evaluate')
  .description('Evaluate JavaScript in page context')
  .requiredOption('--script <script>', 'JavaScript code to evaluate')
  .action(async (options, command) => {
    try {
      const result = await debugging.evaluateScript(options.script)
      const format = command.optsWithGlobals().format as OutputFormat
      outputData(result, format)
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

debugCmd
  .command('screenshot')
  .description('Take a screenshot')
  .option('--path <path>', 'Output file path')
  .option('--full-page', 'Capture full page')
  .option('--type <type>', 'Image type (png|jpeg|webp)', 'png')
  .option('--quality <quality>', 'Image quality (0-100)', Number.parseInt)
  .action(async (options) => {
    try {
      const screenshot = await debugging.takeScreenshot({
        path: options.path,
        fullPage: options.fullPage,
        type: options.type,
        quality: options.quality,
      })
      if (options.path) {
        console.log(`Screenshot saved to ${options.path}`)
      }
      else {
        console.log(screenshot.toString('base64'))
      }
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

debugCmd
  .command('snapshot')
  .description('Take page content snapshot')
  .option('--verbose', 'Include accessibility tree')
  .action(async (options) => {
    try {
      const snapshot = await debugging.takeSnapshot({ verbose: options.verbose })
      console.log(snapshot)
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

// ============================================================================
// Browser Management
// ============================================================================

program
  .command('close')
  .description('Close browser')
  .action(async () => {
    try {
      await closeBrowser()
      console.log('Browser closed')
    }
    catch (error) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

// Parse and execute
program.parseAsync(process.argv).catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
