/**
 * Network inspection commands
 */

import type { HTTPRequest, HTTPResponse } from 'puppeteer'
import { getPage } from '../browser/index.js'

interface NetworkRequest {
  id: string
  url: string
  method: string
  headers: Record<string, string>
  postData?: string
  response?: {
    status: number
    statusText: string
    headers: Record<string, string>
    body?: string
  }
  timestamp: number
}

const networkRequests = new Map<string, NetworkRequest>()
let requestIdCounter = 0

export function startNetworkMonitoring(): void {
  const page = getPage()

  page.then((p) => {
    p.on('request', (request: HTTPRequest) => {
      const id = `req-${++requestIdCounter}`
      networkRequests.set(id, {
        id,
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        postData: request.postData(),
        timestamp: Date.now(),
      })
    })

    p.on('response', (response: HTTPResponse) => {
      const request = response.request()
      const existingReq = Array.from(networkRequests.values()).find(
        r => r.url === request.url() && !r.response,
      )

      if (existingReq) {
        existingReq.response = {
          status: response.status(),
          statusText: response.statusText(),
          headers: response.headers(),
        }
      }
    })
  })
}

export async function listNetworkRequests(options?: {
  limit?: number
  offset?: number
  resourceTypes?: string[]
}): Promise<NetworkRequest[]> {
  let requests = Array.from(networkRequests.values())

  // Filter by resource type if specified
  if (options?.resourceTypes) {
    requests = requests.filter(req =>
      options.resourceTypes!.some(type => req.url.includes(type)),
    )
  }

  // Apply pagination
  const offset = options?.offset ?? 0
  const limit = options?.limit ?? requests.length

  return requests.slice(offset, offset + limit)
}

export async function getNetworkRequest(requestId: string): Promise<NetworkRequest | undefined> {
  return networkRequests.get(requestId)
}

export function clearNetworkRequests(): void {
  networkRequests.clear()
  requestIdCounter = 0
}
