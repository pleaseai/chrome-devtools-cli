/**
 * Input automation commands
 */

import { getPage } from '../browser/index.js'
import type { ClickOptions, FillOptions } from '../types.js'

export async function click(options: ClickOptions): Promise<void> {
  const page = await getPage()
  const selector = `[data-uid="${options.uid}"]`

  if (options.dblClick) {
    await page.click(selector, { clickCount: 2 })
  }
  else {
    await page.click(selector)
  }
}

export async function hover(uid: string): Promise<void> {
  const page = await getPage()
  const selector = `[data-uid="${uid}"]`
  await page.hover(selector)
}

export async function fill(options: FillOptions): Promise<void> {
  const page = await getPage()
  const selector = `[data-uid="${options.uid}"]`
  await page.type(selector, options.value)
}

export async function pressKey(key: string): Promise<void> {
  const page = await getPage()
  await page.keyboard.press(key)
}

export async function drag(fromUid: string, toUid: string): Promise<void> {
  const page = await getPage()
  const fromSelector = `[data-uid="${fromUid}"]`
  const toSelector = `[data-uid="${toUid}"]`

  const fromElement = await page.$(fromSelector)
  const toElement = await page.$(toSelector)

  if (!fromElement || !toElement) {
    throw new Error('Element not found')
  }

  const fromBox = await fromElement.boundingBox()
  const toBox = await toElement.boundingBox()

  if (!fromBox || !toBox) {
    throw new Error('Could not get element bounds')
  }

  await page.mouse.move(fromBox.x + fromBox.width / 2, fromBox.y + fromBox.height / 2)
  await page.mouse.down()
  await page.mouse.move(toBox.x + toBox.width / 2, toBox.y + toBox.height / 2)
  await page.mouse.up()
}

export async function uploadFile(uid: string, filePath: string): Promise<void> {
  const page = await getPage()
  const selector = `[data-uid="${uid}"]`
  const fileInput = await page.$(selector)

  if (!fileInput) {
    throw new Error('File input element not found')
  }

  await fileInput.uploadFile(filePath)
}

export async function handleDialog(action: 'accept' | 'dismiss', promptText?: string): Promise<void> {
  const page = await getPage()

  page.once('dialog', async (dialog) => {
    if (promptText) {
      await dialog.accept(promptText)
    }
    else if (action === 'accept') {
      await dialog.accept()
    }
    else {
      await dialog.dismiss()
    }
  })
}

export interface FillFormField {
  uid: string
  value: string
}

export async function fillForm(elements: FillFormField[]): Promise<void> {
  for (const element of elements) {
    await fill(element)
  }
}
