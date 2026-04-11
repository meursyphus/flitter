import { formatDate } from '../src/lib/formatDate';
import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test('Capture performance trace when diagram is rendered', async ({ page, browser }) => {
	const tracePath =
		process.env.TRACE_OUTPUT_PATH ?? `./performance-history/${formatDate(new Date())}.json`;

	fs.mkdirSync(path.dirname(tracePath), { recursive: true });

	await browser.startTracing(page, { path: tracePath });
	await page.goto('http://localhost:4173/performance/diagram');
	await page.evaluate(() => window.performance.mark('Perf:Started'));
	await page.click('button');
	await page.waitForSelector('svg');
	await page.evaluate(() => window.performance.mark('Perf:Ended'));
	await page.evaluate(() => window.performance.measure('overall', 'Perf:Started', 'Perf:Ended'));
	await browser.stopTracing();
});
