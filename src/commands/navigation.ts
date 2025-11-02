/**
 * Navigation automation commands
 */

import type { NavigateOptions } from '../types.js'
import { closePage as browserClosePage, listPages as browserListPages, newPage as browserNewPage, selectPage as browserSelectPage, getPage } from '../browser/index.js'

export async function listPages(): Promise<any[]> {
  const pages = await browserListPages()
  return Promise.all(pages.map(async (page, index) => ({
    index,
    url: page.url(),
    title: await page.title(),
  })))
}

export async function selectPage(pageIdx: number): Promise<void> {
  await browserSelectPage(pageIdx)
}

export async function closePage(pageIdx: number): Promise<void> {
  await browserClosePage(pageIdx)
}

export async function newPage(url: string, timeout?: number): Promise<void> {
  const page = await browserNewPage()
  await page.goto(url, { timeout })
}

export async function navigatePage(options: NavigateOptions): Promise<void> {
  const page = await getPage()
  await page.goto(options.url, { timeout: options.timeout })
}

export async function waitFor(params: {
  selector?: string
  text?: string
  timeout?: number
}): Promise<void> {
  const page = await getPage()

  if (params.selector) {
    await page.waitForSelector(params.selector, { timeout: params.timeout })
  }
  else if (params.text) {
    await page.waitForFunction(
      text => document.body.textContent?.includes(text),
      { timeout: params.timeout },
      params.text,
    )
  }
}
