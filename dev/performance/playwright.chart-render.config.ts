import path from "node:path";
import { fileURLToPath } from "node:url";
import type { PlaywrightTestConfig } from "@playwright/test";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const storybookDir = path.resolve(currentDir, "../chart-storybook");

const config: PlaywrightTestConfig = {
  testDir: path.resolve(currentDir, "tests"),
  testMatch: /chart-storybook-render\.spec\.ts/,
  timeout: 10 * 60 * 1000,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:6007",
    screenshot: "off",
  },
  webServer: {
    command: `CI=1 pnpm --dir "${storybookDir}" build-storybook && python3 -m http.server 6007 -d "${storybookDir}/storybook-static"`,
    port: 6007,
    reuseExistingServer: false,
    timeout: 240000,
  },
};

export default config;
