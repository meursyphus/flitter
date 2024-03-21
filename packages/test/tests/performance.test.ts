import { test } from '@playwright/test';

test.describe('Performance', () => {
	test('Measure widget rendering time', async ({ page }) => {
		await page.goto('http://localhost:4173/performance');
		const startTime = performance.now();
		await page.click('button');
		await page.waitForSelector('svg');
		const endTime = performance.now();

		const duration = endTime - startTime;

		console.log('render duration: ', duration);
	});
});
