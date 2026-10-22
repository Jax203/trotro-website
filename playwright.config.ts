import { defineConfig } from "@playwright/test";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 3,
  timeout: 45000,
  use: {
    baseURL,
    headless: true,
    trace: "retain-on-failure",
  },
  reporter: "list",
  webServer: {
    command: `npm run dev -- --port ${new URL(baseURL).port || "3000"}`,
    url: baseURL,
    reuseExistingServer: true,
  },
});
