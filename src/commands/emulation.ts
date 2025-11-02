/**
 * Emulation commands
 */

import { getPage } from '../browser/index.js'
import type { EmulateOptions } from '../types.js'
import { KnownDevices } from 'puppeteer'

export async function emulate(options: EmulateOptions): Promise<void> {
  const page = await getPage()

  if (options.device) {
    const device = KnownDevices[options.device]
    if (!device) {
      throw new Error(`Unknown device: ${options.device}`)
    }
    await page.emulate(device)
  }
  else {
    if (options.viewport) {
      await page.setViewport(options.viewport)
    }
    if (options.userAgent) {
      await page.setUserAgent(options.userAgent)
    }
  }
}

export async function resizePage(width: number, height: number): Promise<void> {
  const page = await getPage()
  await page.setViewport({ width, height })
}
