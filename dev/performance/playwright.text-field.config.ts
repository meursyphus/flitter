import { defineConfig } from '@playwright/test';
export default defineConfig({
	use: { baseURL: 'http://localhost:4117' },
	testDir: 'tests',
	testMatch: 'text-field.test.ts',
	workers: 1,
	outputDir: 'test-results/text-field',
	webServer: {
		command: 'pnpm exec vite --config vite.text-field.config.ts --port 4117 --strictPort',
		// Compile the actual fixture before starting the first browser test.
		url: 'http://localhost:4117/performance/text-field?renderer=svg'
	}
});
