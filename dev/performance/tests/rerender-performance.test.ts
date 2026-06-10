/* eslint-disable @typescript-eslint/no-explicit-any */
import { chromium, expect, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

/**
 * Warm-path (re-render) benchmark.
 *
 * Mounts the ERD diagram fixture once, then drives setState-based re-renders and
 * collects the per-frame `flitter:*` user-timing measures that the engine already
 * emits on every frame (flushBuild/drawFrame/layout/paint). This measures the
 * cached path the mount-only tracking-performance test cannot see.
 *
 * Scenarios:
 *  - identity:   push the same project — structure and values stable, pure cache-hit path
 *  - mutate-one: change one field name on ONE table — small subtree invalidation
 *  - mutate-all: change one field name on EVERY table — broad text/layout invalidation
 */

const perfTraceNote = process.env.PERF_TRACE_NOTE?.trim();

// Validated inside the tests (not at module load) so unrelated playwright runs
// that merely collect this file don't crash.
const requireNote = (): string => {
	if (perfTraceNote == null || perfTraceNote === '') {
		throw new Error(
			'PERF_TRACE_NOTE is required. Run via `pnpm run perf:rerender -- --note "<summary>"`.'
		);
	}
	return perfTraceNote;
};

const RENDERERS = ['svg', 'canvas'] as const;
const SCENARIOS = ['identity', 'mutate-one', 'mutate-all'] as const;
const BROWSERS_PER_COMBO = 3;
const WARMUP_FRAMES = 5;
const MEASURED_FRAMES = 40;

const median = (values: number[]) => {
	const sorted = [...values].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
};

const percentile = (values: number[], p: number) => {
	const sorted = [...values].sort((a, b) => a - b);
	const index = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
	return sorted[Math.max(0, index)];
};

const round = (value: number) => Math.round(value * 10000) / 10000;

const appendHistory = (entry: Record<string, unknown>) => {
	const __dirname = path.dirname(fileURLToPath(import.meta.url));
	const filePath = path.join(__dirname, '../performance-history/rerender.ts');
	let fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
	fileContent += `rerenderHistories.push(${JSON.stringify(entry)});\n`;
	fs.writeFileSync(filePath, fileContent);
};

test.describe('Re-render performance', () => {
	for (const renderer of RENDERERS) {
		for (const scenario of SCENARIOS) {
			test(`rerender ${renderer} ${scenario}`, async () => {
				test.setTimeout(180_000);
				const note = requireNote();

				const pooled = {
					build: [] as number[],
					layout: [] as number[],
					paint: [] as number[],
					frame: [] as number[]
				};

				for (let i = 0; i < BROWSERS_PER_COMBO; i += 1) {
					const browser = await chromium.launch({ headless: true });
					const context = await browser.newContext();
					const page = await context.newPage();
					await page.goto(
						`http://localhost:4173/performance/rerender?renderer=${renderer}&scenario=${scenario}`
					);

					await page.click('button');
					await page.waitForFunction(() => (window as any).__rerenderBench?.ready === true);

					// Warmup: settle one-time work (font/measure caches, JIT warm code, resize frames).
					await page.evaluate(
						async (frames) => await (window as any).__rerenderBench.run(frames),
						WARMUP_FRAMES
					);

					// Drop mount + warmup entries so only measured frames remain.
					await page.evaluate(() => {
						window.performance.clearMarks();
						window.performance.clearMeasures();
					});

					await page.evaluate(
						async (frames) => await (window as any).__rerenderBench.run(frames),
						MEASURED_FRAMES
					);

					const samples = await page.evaluate(() => {
						const durations = (name: string) =>
							window.performance.getEntriesByName(name).map((entry) => entry.duration);
						return {
							build: durations('flitter:flushBuild'),
							drawFrame: durations('flitter:drawFrame'),
							layout: durations('flitter:layout'),
							paint: durations('flitter:paint')
						};
					});

					await browser.close();

					// Every measured tick must map to exactly one frame — guards stray
					// frames (hover/resize) from polluting the distribution.
					expect(samples.drawFrame.length).toBe(MEASURED_FRAMES);
					expect(samples.build.length).toBe(MEASURED_FRAMES);

					pooled.build.push(...samples.build);
					pooled.layout.push(...samples.layout);
					pooled.paint.push(...samples.paint);
					samples.drawFrame.forEach((duration, index) => {
						pooled.frame.push(duration + samples.build[index]);
					});
				}

				const entry = {
					timestamp: Date.now(),
					renderer,
					scenario,
					frames: pooled.frame.length,
					buildMedian: round(median(pooled.build)),
					buildP95: round(percentile(pooled.build, 95)),
					layoutMedian: round(median(pooled.layout)),
					layoutP95: round(percentile(pooled.layout, 95)),
					paintMedian: round(median(pooled.paint)),
					paintP95: round(percentile(pooled.paint, 95)),
					frameMedian: round(median(pooled.frame)),
					frameP95: round(percentile(pooled.frame, 95)),
					note
				};

				console.log(
					`[rerender ${renderer}/${scenario}] frame median ${entry.frameMedian}ms p95 ${entry.frameP95}ms ` +
						`(build ${entry.buildMedian}, layout ${entry.layoutMedian}, paint ${entry.paintMedian})`
				);

				appendHistory(entry);
			});
		}
	}
});
