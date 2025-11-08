/**
 * Test setup - preloaded before all tests
 * This file sets up mocks that need to be registered before any module imports
 */

import type { Browser } from 'puppeteer'
import { mock } from 'bun:test'

// Mock browser that will be returned by puppeteer
export const mockBrowser = {
  close: mock(() => Promise.resolve()),
  pages: mock(() => Promise.resolve([])),
  newPage: mock(() => Promise.resolve({})),
} as unknown as Browser

// Mock puppeteer module
export const mockPuppeteer = {
  launch: mock(() => Promise.resolve(mockBrowser)),
  connect: mock(() => Promise.resolve(mockBrowser)),
}

// Register the mock BEFORE any other modules are loaded
mock.module('puppeteer', () => ({
  default: mockPuppeteer,
}))
