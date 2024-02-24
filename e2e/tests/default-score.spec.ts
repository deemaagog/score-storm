import { expect } from "@playwright/test"
import fs from "fs"
import path from "path"
import { test } from "./parametrized-test"

// todo: move to global setup
test.beforeEach(async ({ page, renderer }) => {
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

test("renders default score", async () => {})

test("renders 3 measures", async ({ page }) => {
  await page.evaluate(() => {
    window.scoreStorm.getScore().addMeasure().addMeasure()
  })
})

test("renders score from musicxml", async ({ page }) => {
  const inputXmlString = fs.readFileSync(path.join(__dirname, "basic-accidentals.musicxml"), "utf8")
  await page.evaluate((xml) => {
    window.scoreStorm.setScore(window.getScoreFormMusicXml(xml))
  }, inputXmlString)
})
