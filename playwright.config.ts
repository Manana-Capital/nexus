import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  outputDir: process.env.E2E_OUTPUT ?? 'test-results',
  use: { baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:4200', trace: 'off', screenshot: 'only-on-failure' },
});
