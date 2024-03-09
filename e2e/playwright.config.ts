import { defineConfig, devices } from "@playwright/test"
import { TestOptions } from "./tests/parametrized-test"

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */

const previewUrl = "http://localhost:4173"

export default defineConfig<TestOptions>({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: previewUrl,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },
  expect: {
    toHaveScreenshot: { maxDiffPixels: 0, threshold: 0 /* default is 0.2 */ },
  },

  /* Configure projects for major browsers */
  projects: [
    // smoke tests for various browsers
    {
      name: "chromium-svg",
      testMatch: "default-score.spec.ts",
      use: { ...devices["Desktop Chrome"], renderer: "svg" },
    },
    {
      name: "chromium-canvas",
      testMatch: "default-score.spec.ts",
      use: { ...devices["Desktop Chrome"], renderer: "canvas" },
    },

    {
      name: "firefox-svg",
      testMatch: "default-score.spec.ts",
      use: { ...devices["Desktop Firefox"], renderer: "svg" },
    },

    {
      name: "firefox-canvas",
      testMatch: "default-score.spec.ts",
      use: { ...devices["Desktop Firefox"], renderer: "canvas" },
    },

    {
      name: "webkit-svg",
      testMatch: "default-score.spec.ts",
      use: { ...devices["Desktop Safari"], renderer: "svg" },
    },
    {
      name: "webkit-canvas",
      testMatch: "default-score.spec.ts",
      use: { ...devices["Desktop Safari"], renderer: "canvas" },
    },
    // feature tests
    {
      name: "features",
      testMatch: "features/*.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "pnpm run serve",
    url: previewUrl,
  },
})
