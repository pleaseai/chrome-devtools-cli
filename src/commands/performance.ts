/**
 * Performance analysis commands
 */

import type { Buffer } from 'node:buffer'
import type { PerformanceOptions } from '../types.js'
import { getPage } from '../browser/index.js'

let isTracingActive = false
let traceData: any = null

export async function performanceStartTrace(): Promise<void> {
  if (isTracingActive) {
    throw new Error('Tracing is already active')
  }

  const page = await getPage()
  await page.tracing.start({
    screenshots: true,
    categories: ['devtools.timeline', 'v8', 'disabled-by-default-devtools.timeline'],
  })

  isTracingActive = true
}

export async function performanceStopTrace(): Promise<Buffer> {
  if (!isTracingActive) {
    throw new Error('No active tracing session')
  }

  const page = await getPage()
  traceData = await page.tracing.stop()
  isTracingActive = false

  return traceData
}

export async function performanceAnalyzeInsight(options: PerformanceOptions = {}): Promise<any> {
  const page = await getPage()

  // Start tracing
  await performanceStartTrace()

  // Navigate to URL if provided
  if (options.url) {
    await page.goto(options.url, { waitUntil: 'networkidle2' })
  }

  // Wait for the specified duration
  if (options.duration) {
    await new Promise(resolve => setTimeout(resolve, options.duration))
  }

  // Stop tracing and get data
  const trace = await performanceStopTrace()

  // Basic performance metrics
  const metrics = await page.metrics()
  const performanceTiming = await page.evaluate(() => {
    // @ts-expect-error - window is available in browser context
    return window.performance.timing
  })

  return {
    trace,
    metrics,
    timing: performanceTiming,
  }
}
