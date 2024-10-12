import { expect } from "@playwright/test"
import fs from "fs"
import path from "path"
import { test } from "../parametrized-test"

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

  await expect(page.locator("#ss-container")).toHaveScreenshot()
})

test("correctly justifies notes and rests according to fractional position (time signature 4/4)", async ({ page }) => {
  const inputXmlString = fs.readFileSync(path.join(__dirname, "justification-4-4.musicxml"), "utf8")
  await page.evaluate((xml) => {
    window.scoreStorm.setScore(window.getScoreFormMusicXml(xml))
  }, inputXmlString)
})