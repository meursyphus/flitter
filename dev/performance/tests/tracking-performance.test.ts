/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDate } from '../src/lib/formatDate';
import { chromium, expect, test, type Page } from '@playwright/test';
import ChromeTraceAnalyzer from '../src/lib/ChromeTraceAnalyzer';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const perfTraceNote = process.env.PERF_TRACE_NOTE?.trim();

// Validated inside the tests (not at module load) so unrelated playwright runs
// that merely collect this file don't crash.
const requireNote = (): string => {
	if (perfTraceNote == null || perfTraceNote === '') {
		throw new Error(
			'PERF_TRACE_NOTE is required. Run via `pnpm run perf:trace -- --note "<summary>"`.'
		);
	}
	return perfTraceNote;
};

const waitForFlitterMeasures = async (page: Page, names: string[]) => {
	await page.waitForFunction(
		(requiredNames) =>
			requiredNames.every((name) => window.performance.getEntriesByName(name).length > 0),
		names
	);
};

test.describe('Performance Tracking', () => {
	test('Capture performance traces ans save json file on diagram is rendered', async ({
		page,
		browser
	}) => {
		requireNote();
		await browser.startTracing(page, {
			path: `./performance-history/${formatDate(new Date())}.json`
		});
		await page.goto('http://localhost:4173/performance/diagram');

		await page.evaluate(() => window.performance.mark('Perf:Started'));
		await page.click('button');
		await waitForFlitterMeasures(page, [
			'flitter:runApp',
			'flitter:mount',
			'flitter:draw',
			'flitter:layout',
			'flitter:paint'
		]);
		await page.evaluate(() => window.performance.mark('Perf:Ended'));
		await page.evaluate(() => window.performance.measure('overall', 'Perf:Started', 'Perf:Ended'));

		await browser.stopTracing();
	});

	test('Capture analyzed trace when diagram is rendered', async () => {
		const note = requireNote();
		const COUNT = 10;
		const metricNames = ['runApp', 'mount', 'draw', 'layout', 'paint'] as const;

		const duration = {
			timestamp: Date.now(),
			runApp: 0,
			mount: 0,
			draw: 0,
			layout: 0,
			paint: 0,
			note
		};
		for (let i = 0; i < COUNT; i++) {
			const browser = await chromium.launch({ headless: true });
			const context = await browser.newContext();
			const page = await context.newPage();
			await page.goto('http://localhost:4173/performance/diagram');
			await browser.startTracing(page, {});
			await page.evaluate(() => {
				window.performance.clearMarks();
				window.performance.clearMeasures();
			});
			await page.evaluate(() => window.performance.mark('Perf:Started'));
			await page.click('button');
			await waitForFlitterMeasures(page, [
				'flitter:runApp',
				'flitter:mount',
				'flitter:draw',
				'flitter:layout',
				'flitter:paint'
			]);
			await page.evaluate(() => window.performance.mark('Perf:Ended'));
			await page.evaluate(() =>
				window.performance.measure('overall', 'Perf:Started', 'Perf:Ended')
			);

			const buffer = await browser.stopTracing();
			const jsonString = buffer.toString('utf8'); // buffer를 UTF-8 문자열로 변환
			const trace = JSON.parse(jsonString); // 문자열을 JSON 객체로 파싱
			const analyzer = new ChromeTraceAnalyzer(trace);

			const metrics = Object.fromEntries(
				metricNames.map((name) => [name, analyzer.getDurationMs(name)])
			) as Record<(typeof metricNames)[number], number>;

			for (const name of metricNames) {
				expect(metrics[name]).toBeGreaterThan(0);
				duration[name] += metrics[name] / COUNT;
			}
			await browser.close();
		}

		console.log('****Execution Time****');
		console.log(`runApp: ${duration.runApp}ms`);
		console.log(`mount: ${duration.mount}ms`);
		console.log(`draw: ${duration.draw}ms`);
		console.log(`layout: ${duration.layout}ms`);
		console.log(`paint: ${duration.paint}ms`);
		console.log('********************');

		const __dirname = path.dirname(fileURLToPath(import.meta.url));
		const filePath = path.join(__dirname, '../performance-history/duration.ts');

		let fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
		fileContent += `histories.push(${JSON.stringify(duration)});\n`;
		fs.writeFileSync(filePath, fileContent);
	});
});
