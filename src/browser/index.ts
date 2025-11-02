/**
 * Browser management utilities
 */

import type { Browser, Page } from 'puppeteer'
import puppeteer from 'puppeteer'
import type { BrowserOptions } from '../types.js'

let browser: Browser | null = null
let currentPage: Page | null = null

export async function getBrowser(options: BrowserOptions = {}): Promise<Browser> {
  if (browser) {
    return browser
  }

  // Connect to existing browser if URL or endpoint provided
  if (options.wsEndpoint) {
    browser = await puppeteer.connect({
      browserWSEndpoint: options.wsEndpoint,
    })
    return browser
  }

  // Launch new browser
  const launchOptions: any = {
    headless: options.headless ?? false,
    executablePath: options.executablePath,
    channel: options.channel,
    args: options.chromeArgs || [],
  }

  if (options.viewport) {
    const [width, height] = options.viewport.split('x').map(Number)
    launchOptions.defaultViewport = { width, height }
  }

  if (options.proxyServer) {
    launchOptions.args.push(`--proxy-server=${options.proxyServer}`)
  }

  if (options.acceptInsecureCerts) {
    launchOptions.args.push('--ignore-certificate-errors')
  }

  browser = await puppeteer.launch(launchOptions)
  return browser
}

export async function getPage(): Promise<Page> {
  if (currentPage) {
    return currentPage
  }

  const browserInstance = await getBrowser()
  const pages = await browserInstance.pages()

  if (pages.length > 0) {
    currentPage = pages[0]
  }
  else {
    currentPage = await browserInstance.newPage()
  }

  return currentPage
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close()
    browser = null
    currentPage = null
  }
}

export async function listPages(): Promise<Page[]> {
  const browserInstance = await getBrowser()
  return browserInstance.pages()
}

export async function newPage(): Promise<Page> {
  const browserInstance = await getBrowser()
  const page = await browserInstance.newPage()
  currentPage = page
  return page
}

export async function selectPage(index: number): Promise<Page> {
  const pages = await listPages()
  if (index < 0 || index >= pages.length) {
    throw new Error(`Page index ${index} out of range (0-${pages.length - 1})`)
  }
  currentPage = pages[index]
  await currentPage.bringToFront()
  return currentPage
}

export async function closePage(index: number): Promise<void> {
  const pages = await listPages()
  if (pages.length === 1) {
    throw new Error('Cannot close the last page')
  }
  if (index < 0 || index >= pages.length) {
    throw new Error(`Page index ${index} out of range (0-${pages.length - 1})`)
  }
  await pages[index].close()
  if (currentPage === pages[index]) {
    currentPage = pages[0]
  }
}
