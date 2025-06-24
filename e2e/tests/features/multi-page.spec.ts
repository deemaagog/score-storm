import { expect } from "@playwright/test"
import { test } from "../parametrized-test"
import { Score, TimeSignature } from "@score-storm/core"

// todo: move to global setup
test.beforeEach(async ({ page, renderer }) => {
  page.setViewportSize({ width: 1600, height: 800 })
  await page.goto("/")
  await page.evaluate((renderer) => {
    window.scoreStorm.setRenderer(renderer === "svg" ? window.svgRenderer : window.canvasRenderer)
  }, renderer)
})

// todo: move to global setup
test.afterEach(async ({ page }) => {
  await page.evaluate(() => {
    window.scoreStorm.render()
  })

  // Take individual screenshots for each page element
  const pageElements = await page.locator(".ss-page").all()
  for (let i = 0; i < pageElements.length; i++) {
    await expect(pageElements[i]).toHaveScreenshot(`page-${i}.png`)
  }
})

test("correctly renders multi page score", async ({ page }) => {
  await page.evaluate(() => {
    window.setPageLayout()
    window.scoreStorm.setScore(window.getDefaultScore(20))
  })
})
