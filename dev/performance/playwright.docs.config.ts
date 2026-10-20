import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';

const root = path.dirname(fileURLToPath(import.meta.url));
const baseURL = process.env.DOCS_BASE_URL ?? 'http://localhost:3101';

export default defineConfig({
	testDir: './tests',
	testMatch: 'docs.spec.ts',
	outputDir: 'test-results/docs',
	timeout: 60000,
	workers: 1,
	use: {
		baseURL,
		viewport: { width: 390, height: 844 },
		isMobile: true,
		hasTouch: true,
		trace: 'retain-on-failure'
	},
	projects: [
		{ name: 'chromium', use: { browserName: 'chromium' } },
		{ name: 'webkit', use: { browserName: 'webkit' } }
	],
	webServer: process.env.DOCS_BASE_URL ? undefined : {
		command: `pnpm --dir "${path.join(root, '../../docs')}" dev --port 3101`,
		url: baseURL,
		reuseExistingServer: true,
		timeout: 120000
	}
});
