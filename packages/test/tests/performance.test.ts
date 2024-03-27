/* eslint-disable @typescript-eslint/no-explicit-any */
import { chromium, expect, test } from '@playwright/test';
import ChromeTraceAnalyzer from '../src/lib/ChromeTraceAnalyzer';

test.describe('Performance', () => {
	test('runApp method must be under 100ms on first call', async () => {
		const COUNT = 10;

		const duration = {
			runApp: 0,
			mount: 0,
			draw: 0,
			layout: 0,
			paint: 0
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
		console.log(
			`Performance Results:\n runApp: ${duration.runApp}ms,\n mount: ${duration.mount}ms,\n draw: ${duration.draw}ms,\n layout: ${duration.layout}ms,\n paint: ${duration.paint}ms`
		);
		expect(duration.runApp).toBeLessThan(100);
	});
});
