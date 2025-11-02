/**
 * Debugging commands
 */

import { getPage } from '../browser/index.js'
import type { ScreenshotOptions } from '../types.js'
import type { ConsoleMessage } from 'puppeteer'

interface ConsoleMessageData {
  id: string
  type: string
  text: string
  timestamp: number
  location?: {
    url: string
    lineNumber: number
    columnNumber: number
  }
}

const consoleMessages: ConsoleMessageData[] = []
let messageIdCounter = 0

export function startConsoleMonitoring(): void {
  const page = getPage()

  page.then((p) => {
    p.on('console', (msg: ConsoleMessage) => {
      const location = msg.location()
      consoleMessages.push({
        id: `msg-${++messageIdCounter}`,
        type: msg.type(),
        text: msg.text(),
        timestamp: Date.now(),
        location: location
          ? {
              url: location.url || '',
              lineNumber: location.lineNumber || 0,
              columnNumber: location.columnNumber || 0,
            }
          : undefined,
      })
    })
  })
}

export async function listConsoleMessages(options?: {
  limit?: number
  offset?: number
  types?: string[]
}): Promise<ConsoleMessageData[]> {
  let messages = [...consoleMessages]

  // Filter by type if specified
  if (options?.types) {
    messages = messages.filter(msg => options.types!.includes(msg.type))
  }

  // Apply pagination
  const offset = options?.offset ?? 0
  const limit = options?.limit ?? messages.length

  return messages.slice(offset, offset + limit)
}

export async function getConsoleMessage(messageId: string): Promise<ConsoleMessageData | undefined> {
  return consoleMessages.find(msg => msg.id === messageId)
}

export function clearConsoleMessages(): void {
  consoleMessages.length = 0
  messageIdCounter = 0
}

export async function evaluateScript(script: string): Promise<any> {
  const page = await getPage()
  return page.evaluate(script)
}

export async function takeScreenshot(options: ScreenshotOptions = {}): Promise<Buffer | string> {
  const page = await getPage()

  const screenshotOptions: any = {
    type: options.type ?? 'png',
    fullPage: options.fullPage ?? false,
  }

  if (options.quality && (options.type === 'jpeg' || options.type === 'webp')) {
    screenshotOptions.quality = options.quality
  }

  if (options.path) {
    screenshotOptions.path = options.path
  }

  return page.screenshot(screenshotOptions)
}

export async function takeSnapshot(options?: { verbose?: boolean }): Promise<string> {
  const page = await getPage()

  // Get page content
  const content = await page.content()

  // Get accessibility tree if verbose
  if (options?.verbose) {
    const snapshot = await page.accessibility.snapshot()
    return JSON.stringify({ content, accessibility: snapshot }, null, 2)
  }

  return content
}
