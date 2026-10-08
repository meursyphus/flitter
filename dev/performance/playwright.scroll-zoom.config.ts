import type { PlaywrightTestConfig } from '@playwright/test';

export default {
	testDir: 'tests',
	testMatch: 'scroll-zoom.test.ts',
	outputDir: 'test-results/scroll-zoom',
	use: { baseURL: 'http://127.0.0.1:4124' },
	webServer: {
		command:
			'pnpm --dir ../../packages/chart build && pnpm exec vite dev --host 127.0.0.1 --port 4124 --strictPort',
		url: 'http://127.0.0.1:4124/interaction/scroll-zoom',
		reuseExistingServer: false
	},
	workers: 1
} satisfies PlaywrightTestConfig;
