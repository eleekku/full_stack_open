const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 30000,
})
