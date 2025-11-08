/**
 * Browser module integration tests - Real browser
 */

import { afterEach, describe, expect, it } from 'bun:test'
import { closeBrowser, getBrowser, getPage, listPages, newPage } from '../../../src/browser/index.js'

describe('browser module integration', () => {
  afterEach(async () => {
    // Clean up browser instance after each test
    await closeBrowser()
  })

  describe('getBrowser', () => {
    it('should launch a real headless browser', async () => {
      const browser = await getBrowser({ headless: true })

      expect(browser).toBeDefined()
      expect(browser.isConnected()).toBe(true)

      // Verify browser has basic capabilities
      const pages = await browser.pages()
      expect(Array.isArray(pages)).toBe(true)
    })

    it('should return same browser instance on subsequent calls', async () => {
      const browser1 = await getBrowser({ headless: true })
      const browser2 = await getBrowser({ headless: true })

      expect(browser1).toBe(browser2)
    })

    it('should set viewport when provided', async () => {
      await getBrowser({
        headless: true,
        viewport: '1920x1080',
      })

      const page = await getPage()
      const viewport = page.viewport()

      expect(viewport).toBeDefined()
      expect(viewport?.width).toBe(1920)
      expect(viewport?.height).toBe(1080)
    })
  })

  describe('closeBrowser', () => {
    it('should close browser and allow new instance', async () => {
      const browser1 = await getBrowser({ headless: true })
      const browser1Id = browser1.process()?.pid

      await closeBrowser()

      const browser2 = await getBrowser({ headless: true })
      const browser2Id = browser2.process()?.pid

      expect(browser1Id).not.toBe(browser2Id)
    })

    it('should not throw when no browser exists', async () => {
      await expect(closeBrowser()).resolves.toBeUndefined()
    })
  })

  describe('getPage', () => {
    it('should return existing page when available', async () => {
      await getBrowser({ headless: true })
      const page = await getPage()

      expect(page).toBeDefined()
      expect(page.url()).toBeDefined()
    })

    it('should create new page when none exist', async () => {
      const browser = await getBrowser({ headless: true })

      // Close all existing pages
      const pages = await browser.pages()
      await Promise.all(pages.map(p => p.close()))

      const page = await getPage()

      expect(page).toBeDefined()
    })

    it('should allow navigation to real URL', async () => {
      const page = await getPage()

      await page.goto('about:blank')
      expect(page.url()).toBe('about:blank')
    })
  })

  describe('listPages', () => {
    it('should list all open pages', async () => {
      await getBrowser({ headless: true })
      const page1 = await getPage()

      const pages = await listPages()

      expect(pages.length).toBeGreaterThanOrEqual(1)
      expect(pages).toContain(page1)
    })
  })

  describe('newPage', () => {
    it('should create a new page', async () => {
      await getBrowser({ headless: true })

      const initialPages = await listPages()
      const initialCount = initialPages.length

      const newPageInstance = await newPage()

      const updatedPages = await listPages()

      expect(updatedPages.length).toBe(initialCount + 1)
      expect(updatedPages).toContain(newPageInstance)
    })
  })
})
