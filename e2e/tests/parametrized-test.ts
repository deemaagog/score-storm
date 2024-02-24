import { test as base } from "@playwright/test"

export type TestOptions = {
  renderer: string
}

export const test = base.extend<TestOptions>({
  // Define an option and provide a default value.
  // We can later override it in the config.
  renderer: ["svg", { option: true }],
})
