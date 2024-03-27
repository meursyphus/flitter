/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDate } from '../src/lib/formatDate';
import { test } from '@playwright/test';

test.describe('Performance Tracking', () => {
	test('Capture performance traces when diagram is rendered', async ({ page, browser }) => {
		await browser.startTracing(page, {
			path: `./performance-history/${formatDate(new Date())}.json`,
			screenshots: true
		});
		await page.goto('http://localhost:4173/performance');

		await page.evaluate(() => window.performance.mark('Perf:Started'));
		await page.click('button');
		await page.waitForSelector('svg');
		await page.evaluate(() => window.performance.mark('Perf:Ended'));
		await page.evaluate(() => window.performance.measure('overall', 'Perf:Started', 'Perf:Ended'));

		await browser.stopTracing();
	});
});
