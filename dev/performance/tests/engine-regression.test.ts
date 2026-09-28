import { test, expect } from '@playwright/test';
import type { EngineBench } from '../src/lib/engine-bench';

declare global {
	interface Window {
		__engineBench: EngineBench;
	}
}

for (const renderer of ['canvas', 'svg']) {
	for (const scenario of [
		'identity',
		'paint-one',
		'paint-all',
		'text',
		'resize',
		'reorder',
		'insert-remove',
		'transform',
		'opacity',
		'z-order'
	]) {
		test(`${renderer} ${scenario}: updated pixels match a fresh scene`, async ({
			page
		}, testInfo) => {
			const errors: string[] = [];
			page.on('pageerror', (error) => errors.push(error.message));
			await page.goto(
				`http://localhost:4173/performance/engine?renderer=${renderer}&scenario=${scenario}`
			);
			await page.waitForFunction(() => !!window.__engineBench);
			await page.evaluate(() => window.__engineBench.settle());
			const view = page.locator('[data-testid="engine"]');
			const initial = await view.screenshot();
			await page.evaluate(() => window.__engineBench.run(3));
			const updated = await view.screenshot();
			if (scenario === 'identity') expect(updated.equals(initial)).toBe(true);
			else expect(updated.equals(initial), 'the mutation must produce visible pixels').toBe(false);
			await page.evaluate(() => window.__engineBench.fresh());
			const fresh = await view.screenshot();
			if (!updated.equals(fresh)) {
				await testInfo.attach('updated', { body: updated, contentType: 'image/png' });
				await testInfo.attach('fresh', { body: fresh, contentType: 'image/png' });
			}
			expect(updated.equals(fresh), 'retained rendering must match a fresh mount').toBe(true);
			expect(errors).toEqual([]);
		});
	}
}

for (const name of ['effects', 'z-order', 'hidden', 'custom-state']) {
	test(`canvas ${name}: retained layers preserve transforms, clips and opacity`, async ({
		page
	}) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.goto('http://localhost:4173/performance/engine');
		await page.waitForFunction(() => !!window.__engineBench);
		await page.evaluate(() => window.__engineBench.settle());
		await page.evaluate((name) => window.__engineBench.renderCase(name, true), name);
		const retained = await page.locator('canvas').screenshot();
		const pixels = await page.evaluate(() =>
			window.__engineBench.pixels([
				[35, 25],
				[75, 25],
				[5, 5],
				[90, 10]
			])
		);
		if (name === 'custom-state') expect(pixels[3]).toEqual([0, 0, 255, 255]);
		else if (name === 'hidden') expect(pixels.every((pixel) => pixel[3] === 0)).toBe(true);
		else {
			// Flitter/SVG opacity is applied to each draw: red at 50% over blue at
			// 50% has 75% combined alpha. Keeping a boundary must preserve that.
			expect(pixels[0]).toEqual(name === 'z-order' ? [170, 0, 85, 192] : [255, 0, 0, 128]);
			expect(pixels[1][3]).toBe(0);
			expect(pixels[2][3]).toBe(0);
		}
		await page.evaluate((name) => window.__engineBench.renderCase(name, false), name);
		const direct = await page.locator('canvas').screenshot();
		expect(retained.equals(direct), 'boundary placement must not change the picture').toBe(true);
		expect(errors).toEqual([]);
	});
}

for (const scenario of ['identity', 'paint-one', 'paint-all', 'transform', 'opacity', 'z-stable']) {
	test(`canvas ${scenario}: warm work stays bounded`, async ({ page }) => {
		await page.goto(`http://localhost:4173/performance/engine?scenario=${scenario}`);
		await page.waitForFunction(() => !!window.__engineBench);
		await page.evaluate(async () => {
			await window.__engineBench.settle();
			await window.__engineBench.run(10);
		});
		const counts = await page.evaluate(() => window.__engineBench.countWork());
		expect(counts.layouts).toBe(0);
		expect(counts.structureChanges).toBe(0);
		expect(counts.textMeasurements).toBe(0);
		expect(counts.canvasAllocations).toBe(0);
		if (scenario === 'identity' || scenario === 'z-stable') expect(counts.paints).toBe(0);
		if (scenario === 'paint-one') expect(counts.paints).toBeLessThan(60);
		if (scenario === 'transform' || scenario === 'opacity') expect(counts.paints).toBeLessThan(10);
	});
}

test('canvas hit testing refreshes after a keyed reorder at the same pointer position', async ({
	page
}) => {
	await page.goto('http://localhost:4173/performance/engine?scenario=reorder');
	await page.waitForFunction(() => !!window.__engineBench);
	await page.evaluate(() => window.__engineBench.settle());
	const rect = (await page.locator('canvas').boundingBox())!;
	await page.mouse.move(rect.x + 40, rect.y + 30);
	expect(await page.evaluate(() => window.__engineBench.hoverHits)).toEqual([0]);
	await page.evaluate(() => window.__engineBench.run(1));
	await page.mouse.move(rect.x + 40, rect.y + 30);
	expect(await page.evaluate(() => window.__engineBench.hoverHits)).toEqual([0, 9]);
	await page.mouse.click(rect.x + 40, rect.y + 30);
	expect(await page.evaluate(() => window.__engineBench.hits)).toEqual([9]);
});

test('disposing runners cancels their queued frames', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('http://localhost:4173/performance/engine');
	await page.waitForFunction(() => !!window.__engineBench);
	await page.evaluate(() => window.__engineBench.settle());
	expect(await page.evaluate(() => window.__engineBench.cycleRunners(30))).toBe(0);
	expect(errors).toEqual([]);
});

test('Canvas decoration shadows do not leak into child text or custom painters', async ({
	page
}) => {
	await page.goto('http://localhost:4173/performance/engine');
	await page.waitForFunction(() => !!window.__engineBench);
	await page.evaluate(() => window.__engineBench.renderCase('shadow-state'));
	expect(await page.evaluate(() => window.__engineBench.shadowBlurAtChild)).toBe(0);
});

test('Canvas effects retain identical pixels at device scale factor 2', async ({ browser }) => {
	const page = await browser.newPage({ deviceScaleFactor: 2 });
	try {
		await page.goto('http://localhost:4173/performance/engine');
		await page.waitForFunction(() => !!window.__engineBench);
		await page.evaluate(() => window.__engineBench.renderCase('effects', true));
		expect(
			await page.evaluate(() =>
				window.__engineBench.pixels([
					[35, 25],
					[75, 25]
				])
			)
		).toEqual([
			[255, 0, 0, 128],
			[0, 0, 0, 0]
		]);
		const retained = await page.locator('canvas').screenshot();
		await page.evaluate(() => window.__engineBench.renderCase('effects', false));
		expect(retained.equals(await page.locator('canvas').screenshot())).toBe(true);
	} finally {
		await page.close();
	}
});
