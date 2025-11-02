/**
 * Common types for Chrome DevTools CLI
 */

export interface BrowserOptions {
  browserUrl?: string
  wsEndpoint?: string
  wsHeaders?: string
  headless?: boolean
  executablePath?: string
  isolated?: boolean
  channel?: 'stable' | 'canary' | 'beta' | 'dev'
  viewport?: string
  proxyServer?: string
  acceptInsecureCerts?: boolean
  chromeArgs?: string[]
}

export interface OutputOptions {
  format?: 'json' | 'toon' | 'text'
  fields?: string[]
  pretty?: boolean
}

export interface ClickOptions {
  uid: string
  dblClick?: boolean
}

export interface FillOptions {
  uid: string
  value: string
}

export interface NavigateOptions {
  url: string
  timeout?: number
}

export interface ScreenshotOptions {
  path?: string
  fullPage?: boolean
  type?: 'png' | 'jpeg' | 'webp'
  quality?: number
}

export interface PerformanceOptions {
  url?: string
  duration?: number
}

export interface EmulateOptions {
  device?: string
  viewport?: {
    width: number
    height: number
  }
  userAgent?: string
}
