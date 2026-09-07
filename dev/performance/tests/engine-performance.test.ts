import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import type { EngineBench } from '../src/lib/engine-bench';

declare global {
	interface Window {
		__engineBench: EngineBench;
	}
}

const scenarios = [
	'identity',
	'paint-one',
	'paint-all',
	'text',
	'resize',
	'reorder',
	'insert-remove',
	'transform',
	'opacity'
];
const percentile = (values: number[], p: number) =>
	[...values].sort((a, b) => a - b)[Math.ceil(values.length * p) - 1];

test.describe('Canvas engine performance', () => {
	test.skip(
		!process.env.PERF_ENGINE_OUTPUT,
		'Use pnpm perf:engine; timings run separately from correctness tests.'
	);
	test('text-algorithms', async ({ page, browser }) => {
		test.setTimeout(120_000);
		await page.goto('http://localhost:4173/performance/engine');
		await page.waitForFunction(() => !!window.__engineBench);
		const results = [];
		for (const words of [100, 500, 1500]) {
			const samples = await page.evaluate(
				(words) => window.__engineBench.benchmarkText(words, 15),
				words
			);
			results.push({
				words,
				samples,
				median: percentile(samples, 0.5),
				p95: percentile(samples, 0.95)
			});
		}
		const output = path.resolve(process.env.PERF_ENGINE_OUTPUT!);
		fs.mkdirSync(output, { recursive: true });
		fs.writeFileSync(
			path.join(output, 'text-algorithms.json'),
			JSON.stringify({ browser: browser.version(), results }, null, 2)
		);
		console.log(
			'[text layout]',
			results.map((r) => `${r.words}: ${r.median.toFixed(2)}ms`).join(', ')
		);
	});
	for (const scenario of scenarios) {
		test(scenario, async ({ browser }, testInfo) => {
			const samples: Record<string, number[]> = {};
			const errors: string[] = [];
			const repetitions = 3;
			const frames = 40;
			let paints = 0;
			for (let repetition = 0; repetition < repetitions; repetition++) {
				const page = await browser.newPage();
				page.on('pageerror', (error) => errors.push(error.message));
				try {
					await page.goto(
						`http://localhost:4173/performance/engine?renderer=canvas&scenario=${scenario}`
					);
					await page.waitForFunction(() => !!window.__engineBench);
					await page.evaluate(async () => {
						await window.__engineBench.settle();
						await window.__engineBench.run(10);
						performance.clearMarks();
						performance.clearMeasures();
					});
					await page.evaluate((frames) => window.__engineBench.run(frames), frames);
					const batch = await page.evaluate(() => {
						const names = ['flushBuild', 'layout', 'paint', 'drawFrame', 'finalizeTree'];
						return Object.fromEntries(
							names.map((name) => [
								name,
								performance.getEntriesByName(`flitter:${name}`).map((entry) => entry.duration)
							])
						);
					});
					for (const [name, values] of Object.entries(batch)) {
						expect(values.length, `${scenario}/${name} one measure per tick`).toBe(frames);
						(samples[name] ??= []).push(...values);
					}
					(samples.total ??= []).push(
						...batch.drawFrame.map((n, i) => n + batch.flushBuild[i] + batch.finalizeTree[i])
					);
					paints += await page.evaluate(() => window.__engineBench.countPaints());
				} finally {
					await page.close();
				}
			}
			expect(errors).toEqual([]);
			const result = {
				scenario,
				frames: repetitions * frames,
				browser: browser.version(),
				paintsPerTick: paints / repetitions,
				phases: Object.fromEntries(
					Object.entries(samples).map(([name, values]) => [
						name,
						{
							median: percentile(values, 0.5),
							p95: percentile(values, 0.95),
							samples: values
						}
					])
				)
			};
			const output = path.resolve(process.env.PERF_ENGINE_OUTPUT!);
			fs.mkdirSync(output, { recursive: true });
			fs.writeFileSync(path.join(output, `${scenario}.json`), JSON.stringify(result, null, 2));
			await testInfo.attach('metrics', {
				body: JSON.stringify(result),
				contentType: 'application/json'
			});
			console.log(
				`[canvas/${scenario}] median=${result.phases.total.median.toFixed(3)}ms p95=${result.phases.total.p95.toFixed(3)}ms paints=${result.paintsPerTick}`
			);
		});
	}
});
