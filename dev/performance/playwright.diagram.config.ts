import type { PlaywrightTestConfig } from '@playwright/test';

export default {
	testDir: 'tests',
	testMatch: 'diagram.test.ts',
	outputDir: 'test-results/diagram',
	use: { baseURL: 'http://127.0.0.1:4126', hasTouch: true },
	webServer: {
		command: 'pnpm exec vite dev --host 127.0.0.1 --port 4126 --strictPort',
		url: 'http://127.0.0.1:4126/interaction/diagram',
		reuseExistingServer: false
	},
	workers: 1
} satisfies PlaywrightTestConfig;
