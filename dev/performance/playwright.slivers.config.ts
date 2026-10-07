import { defineConfig } from '@playwright/test';
export default defineConfig({
	testDir: './tests',
	testMatch: 'sliver-virtualization.test.ts',
	workers: 1,
	outputDir: 'test-results/slivers',
	use: { baseURL: 'http://127.0.0.1:4130', viewport: { width: 600, height: 400 } },
	webServer: {
		command: 'pnpm exec vite --config vite.slivers.config.ts --host 127.0.0.1 --port 4130',
		url: 'http://127.0.0.1:4130',
		reuseExistingServer: false
	}
});
