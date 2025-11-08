/**
 * Navigation commands tests
 */

import type { Page } from 'puppeteer'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

// Mock page
const mockPage = {
  url: mock(() => 'https://example.com'),
  title: mock(() => Promise.resolve('Example Domain')),
  goto: mock(() => Promise.resolve()),
  bringToFront: mock(() => Promise.resolve()),
  close: mock(() => Promise.resolve()),
  waitForSelector: mock(() => Promise.resolve()),
  waitForFunction: mock(() => Promise.resolve()),
} as unknown as Page

const mockPage2 = {
  url: mock(() => 'https://example.org'),
  title: mock(() => Promise.resolve('Example Org')),
  goto: mock(() => Promise.resolve()),
  bringToFront: mock(() => Promise.resolve()),
  close: mock(() => Promise.resolve()),
} as unknown as Page

// Mock browser module
mock.module('../../../src/browser/index.js', () => ({
  getPage: mock(() => Promise.resolve(mockPage)),
  listPages: mock(() => Promise.resolve([mockPage, mockPage2])),
  selectPage: mock((index: number) => {
    if (index < 0 || index >= 2) {
      throw new Error(`Page index ${index} out of range (0-1)`)
    }
    return Promise.resolve(index === 0 ? mockPage : mockPage2)
  }),
  closePage: mock((index: number) => {
    if (index < 0 || index >= 2) {
      throw new Error(`Page index ${index} out of range (0-1)`)
    }
    return Promise.resolve()
  }),
  newPage: mock(() => Promise.resolve(mockPage)),
}))

describe('navigation commands', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockPage.goto.mockClear()
    mockPage.waitForSelector.mockClear()
    mockPage.waitForFunction.mockClear()
  })

  describe('listPages', () => {
    it('should return list of pages with index, url, and title', async () => {
      const { listPages } = await import('../../../src/commands/navigation.js')

      const pages = await listPages()

      expect(pages).toHaveLength(2)
      expect(pages[0]).toEqual({
        index: 0,
        url: 'https://example.com',
        title: 'Example Domain',
      })
      expect(pages[1]).toEqual({
        index: 1,
        url: 'https://example.org',
        title: 'Example Org',
      })
    })
  })

  describe('selectPage', () => {
    it('should select page by index', async () => {
      const { selectPage } = await import('../../../src/commands/navigation.js')
      const browserModule = await import('../../../src/browser/index.js')

      await selectPage(1)

      expect(browserModule.selectPage).toHaveBeenCalledWith(1)
    })

    it('should throw error for invalid index', async () => {
      const { selectPage } = await import('../../../src/commands/navigation.js')

      await expect(selectPage(999)).rejects.toThrow('out of range')
    })
  })

  describe('closePage', () => {
    it('should close page by index', async () => {
      const { closePage } = await import('../../../src/commands/navigation.js')
      const browserModule = await import('../../../src/browser/index.js')

      await closePage(1)

      expect(browserModule.closePage).toHaveBeenCalledWith(1)
    })

    it('should throw error for invalid index', async () => {
      const { closePage } = await import('../../../src/commands/navigation.js')

      await expect(closePage(-1)).rejects.toThrow('out of range')
    })
  })

  describe('newPage', () => {
    it('should create new page and navigate to URL', async () => {
      const { newPage } = await import('../../../src/commands/navigation.js')

      await newPage('https://example.com')

      expect(mockPage.goto).toHaveBeenCalledWith('https://example.com', { timeout: undefined })
    })

    it('should create new page with custom timeout', async () => {
      const { newPage } = await import('../../../src/commands/navigation.js')

      await newPage('https://example.com', 5000)

      expect(mockPage.goto).toHaveBeenCalledWith('https://example.com', { timeout: 5000 })
    })
  })

  describe('navigatePage', () => {
    it('should navigate to URL', async () => {
      const { navigatePage } = await import('../../../src/commands/navigation.js')

      await navigatePage({ url: 'https://example.com' })

      expect(mockPage.goto).toHaveBeenCalledWith('https://example.com', { timeout: undefined })
    })

    it('should navigate with custom timeout', async () => {
      const { navigatePage } = await import('../../../src/commands/navigation.js')

      await navigatePage({ url: 'https://example.com', timeout: 10000 })

      expect(mockPage.goto).toHaveBeenCalledWith('https://example.com', { timeout: 10000 })
    })
  })

  describe('waitFor', () => {
    it('should wait for selector', async () => {
      const { waitFor } = await import('../../../src/commands/navigation.js')

      await waitFor({ selector: '.my-element' })

      expect(mockPage.waitForSelector).toHaveBeenCalledWith('.my-element', { timeout: undefined })
    })

    it('should wait for selector with timeout', async () => {
      const { waitFor } = await import('../../../src/commands/navigation.js')

      await waitFor({ selector: '.my-element', timeout: 3000 })

      expect(mockPage.waitForSelector).toHaveBeenCalledWith('.my-element', { timeout: 3000 })
    })

    it('should wait for text content', async () => {
      const { waitFor } = await import('../../../src/commands/navigation.js')

      await waitFor({ text: 'Hello World' })

      expect(mockPage.waitForFunction).toHaveBeenCalledWith(
        expect.any(Function),
        { timeout: undefined },
        'Hello World',
      )
    })

    it('should wait for text with timeout', async () => {
      const { waitFor } = await import('../../../src/commands/navigation.js')

      await waitFor({ text: 'Hello World', timeout: 5000 })

      expect(mockPage.waitForFunction).toHaveBeenCalledWith(
        expect.any(Function),
        { timeout: 5000 },
        'Hello World',
      )
    })
  })
})
