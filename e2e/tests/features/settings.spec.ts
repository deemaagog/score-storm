import { expect } from "@playwright/test"
import fs from "fs"
import path from "path"
import { test } from "../parametrized-test"

// todo: move to global setup
test.beforeEach(async ({ page, renderer }) => {
  await page.goto("/")
  await page.evaluate((renderer) => {
    window.scoreStorm.setRenderer(renderer === "svg" ? window.svgRenderer : window.canvasRenderer)
    window.scoreStorm.setSettings({ debug: { bBoxes: true } })
  }, renderer)
})

// todo: move to global setup
test.afterEach(async ({ page }) => {
  await page.evaluate(() => {
    window.scoreStorm.render()
  })

  await expect(page.locator(".ss-page")).toHaveScreenshot()
})

test("renders bounding boxes in debug mode", async ({ page }) => {
  await page.evaluate(() => {
    window.scoreStorm.setScore(window.getDefaultScore())
    for (let i = 0; i < 2; i++) {
      window.addMeasure()
    }
  })
})
