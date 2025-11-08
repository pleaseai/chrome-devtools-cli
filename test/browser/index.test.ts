/**
 * Browser module tests
 */

import type { Browser, Page } from 'puppeteer'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

// Mock puppeteer BEFORE importing the module under test
const mockBrowser = {
  close: mock(() => Promise.resolve()),
  pages: mock(() => Promise.resolve([])),
  newPage: mock(() => Promise.resolve({})),
} as unknown as Browser

const mockPage = {
  url: mock(() => 'about:blank'),
  title: mock(() => Promise.resolve('Test Page')),
  bringToFront: mock(() => Promise.resolve()),
  close: mock(() => Promise.resolve()),
} as unknown as Page

const mockPuppeteer = {
  launch: mock(() => Promise.resolve(mockBrowser)),
  connect: mock(() => Promise.resolve(mockBrowser)),
}

mock.module('puppeteer', () => ({
  default: mockPuppeteer,
}))

// Import AFTER mock is set up
// eslint-disable-next-line import/first
import { closeBrowser, getBrowser, getPage } from '../../src/browser/index.js'

describe('browser module', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockPuppeteer.launch.mockClear()
    mockPuppeteer.connect.mockClear()
  })

  afterEach(async () => {
    // Clean up browser instance after each test
    await closeBrowser()
  })

  describe('getBrowser', () => {
    it('should launch a new browser when none exists', async () => {
      const browser = await getBrowser()

      expect(browser).toBeDefined()
      expect(mockPuppeteer.launch).toHaveBeenCalledTimes(1)
    })

    it('should return existing browser instance', async () => {
      const browser1 = await getBrowser()
      const browser2 = await getBrowser()

      expect(browser1).toBe(browser2)
      expect(mockPuppeteer.launch).toHaveBeenCalledTimes(1)
    })

    it('should connect to existing browser when wsEndpoint provided', async () => {
      await closeBrowser()

      await getBrowser({ wsEndpoint: 'ws://localhost:9222' })

      expect(mockPuppeteer.connect).toHaveBeenCalledWith({
        browserWSEndpoint: 'ws://localhost:9222',
      })
    })

    it('should launch headless browser when headless option is true', async () => {
      await closeBrowser()

      await getBrowser({ headless: true })

      expect(mockPuppeteer.launch).toHaveBeenCalledWith(
        expect.objectContaining({ headless: true }),
      )
    })

    it('should set viewport when provided', async () => {
      await closeBrowser()

      await getBrowser({ viewport: '1920x1080' })

      expect(mockPuppeteer.launch).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultViewport: { width: 1920, height: 1080 },
        }),
      )
    })

    it('should add proxy server to args when provided', async () => {
      await closeBrowser()

      await getBrowser({ proxyServer: 'http://proxy.example.com:8080' })

      expect(mockPuppeteer.launch).toHaveBeenCalledWith(
        expect.objectContaining({
          args: expect.arrayContaining(['--proxy-server=http://proxy.example.com:8080']),
        }),
      )
    })

    it('should ignore certificate errors when acceptInsecureCerts is true', async () => {
      await closeBrowser()

      await getBrowser({ acceptInsecureCerts: true })

      expect(mockPuppeteer.launch).toHaveBeenCalledWith(
        expect.objectContaining({
          args: expect.arrayContaining(['--ignore-certificate-errors']),
        }),
      )
    })
  })

  describe('closeBrowser', () => {
    it('should close browser and clear state', async () => {
      mockBrowser.close.mockClear()
      await getBrowser()
      await closeBrowser()

      expect(mockBrowser.close).toHaveBeenCalled()
    })

    it('should not throw when no browser exists', async () => {
      await expect(closeBrowser()).resolves.toBeUndefined()
    })
  })

  describe('getPage', () => {
    it('should return existing page when available', async () => {
      const mockBrowserWithPages = {
        ...mockBrowser,
        pages: mock(() => Promise.resolve([mockPage])),
      } as unknown as Browser

      mockPuppeteer.launch.mockResolvedValue(mockBrowserWithPages)

      await closeBrowser()

      const page = await getPage()

      expect(page).toBeDefined()
    })

    it('should create new page when none exist', async () => {
      const newMockPage = { ...mockPage }
      const mockBrowserNoPages = {
        ...mockBrowser,
        pages: mock(() => Promise.resolve([])),
        newPage: mock(() => Promise.resolve(newMockPage)),
      } as unknown as Browser

      mockPuppeteer.launch.mockResolvedValue(mockBrowserNoPages)

      await closeBrowser()

      const page = await getPage()

      expect(page).toBeDefined()
      expect(mockBrowserNoPages.newPage).toHaveBeenCalledTimes(1)
    })
  })
})
