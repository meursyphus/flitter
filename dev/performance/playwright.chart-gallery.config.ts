import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PlaywrightTestConfig } from '@playwright/test';

const root = path.dirname(fileURLToPath(import.meta.url));
export default {
	testDir: path.join(root, 'tests'),
	testMatch: /chart-gallery\.spec\.ts/,
	outputDir: path.join(root, 'test-results/chart-gallery'),
	timeout: 60000,
	workers: 2,
	use: { baseURL: 'http://127.0.0.1:6007', viewport: { width: 1280, height: 800 } },
	webServer: {
		command: `pnpm --dir "${path.join(root, '../chart-storybook')}" exec storybook dev -p 6007 --ci --no-open`,
		port: 6007,
		reuseExistingServer: true,
		timeout: 120000
	}
} satisfies PlaywrightTestConfig;
