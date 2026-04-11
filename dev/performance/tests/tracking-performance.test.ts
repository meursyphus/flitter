/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDate } from '../src/lib/formatDate';
import { chromium, test } from '@playwright/test';
import ChromeTraceAnalyzer from '../src/lib/ChromeTraceAnalyzer';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

test.describe('Performance Tracking', () => {
	test('Capture performance traces ans save json file on diagram is rendered', async ({
		page,
		browser
	}) => {
		await browser.startTracing(page, {
			path: `./performance-history/${formatDate(new Date())}.json`
		});
		await page.goto('http://localhost:4173/performance/diagram');

		await page.evaluate(() => window.performance.mark('Perf:Started'));
		await page.click('button');
		await page.waitForSelector('svg');
		await page.evaluate(() => window.performance.mark('Perf:Ended'));
		await page.evaluate(() => window.performance.measure('overall', 'Perf:Started', 'Perf:Ended'));

		await browser.stopTracing();
	});

	test('Capture analyzed trace when diagram is rendered', async () => {
		const COUNT = 10;

		const duration = {
			timestamp: Date.now(),
			runApp: 0,
			mount: 0,
			draw: 0,
			layout: 0,
			paint: 0,
			note: ''
		};
		for (let i = 0; i < COUNT; i++) {
			const browser = await chromium.launch({ headless: true });
			const context = await browser.newContext();
			const page = await context.newPage();
			await page.goto('http://localhost:4173/performance/diagram');
			await browser.startTracing(page, {});
			await page.evaluate(() => window.performance.mark('Perf:Started'));
			await page.click('button');
			await page.waitForSelector('svg');
			await page.evaluate(() => window.performance.mark('Perf:Ended'));
			await page.evaluate(() =>
				window.performance.measure('overall', 'Perf:Started', 'Perf:Ended')
			);

			const buffer = await browser.stopTracing();
			const jsonString = buffer.toString('utf8'); // buffer를 UTF-8 문자열로 변환
			const trace = JSON.parse(jsonString); // 문자열을 JSON 객체로 파싱
			const analyzer = new ChromeTraceAnalyzer(trace);
			duration.runApp += analyzer.getDurationMs('runApp') / COUNT;
			duration.mount += analyzer.getDurationMs('mount') / COUNT;
			duration.draw += analyzer.getDurationMs('draw') / COUNT;
			duration.layout += analyzer.getDurationMs('layout') / COUNT;
			duration.paint += analyzer.getDurationMs('paint') / COUNT;
			browser.close();
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
