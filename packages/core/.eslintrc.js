/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@score-storm/eslint-config/base.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  env: {
    "jest": true
  }
}
