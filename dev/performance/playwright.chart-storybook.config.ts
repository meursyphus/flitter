import path from "node:path";
import { fileURLToPath } from "node:url";
import type { PlaywrightTestConfig } from "@playwright/test";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const storybookDir = path.resolve(currentDir, "../chart-storybook");

const config: PlaywrightTestConfig = {
  testDir: path.resolve(currentDir, "tests"),
  testMatch: /chart-storybook-llm-evaluation\.spec\.ts/,
  use: {
    baseURL: "http://127.0.0.1:6007",
  },
  webServer: {
    command: `pnpm --dir "${storybookDir}" storybook -- --host 127.0.0.1`,
    port: 6007,
    reuseExistingServer: true,
    timeout: 120000,
  },
};

export default config;
