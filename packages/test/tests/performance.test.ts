import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
	test('Widget initial rendering time should be under 150ms', async ({ page }) => {
		await page.goto('http://localhost:4173/performance');
		const startTime = performance.now();
		await page.click('button');
		await page.waitForSelector('svg');
		const endTime = performance.now();

		const duration = endTime - startTime;
		console.log('duration: ', duration);
		expect(duration).toBeLessThan(150);
	});
});
