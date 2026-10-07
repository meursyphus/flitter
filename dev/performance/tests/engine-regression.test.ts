import { test, expect } from '@playwright/test';
import type { EngineBench } from '../src/lib/engine-bench';

declare global {
	interface Window {
		__engineBench: EngineBench;
	}
}

test('Canvas clips bound recording allocation for tall and far-translated content', async ({
	page
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('http://localhost:4173/performance/engine?renderer=canvas');
	await page.waitForFunction(() => !!window.__engineBench);
	for (const farTranslation of [false, true]) {
		const sizes = await page.evaluate(
			(far) => window.__engineBench.measureClippedRecording(far),
			farTranslation
		);
		expect(sizes).toContainEqual({ width: 120, height: 80 });
		expect(sizes.every((size) => size.width <= 960 && size.height <= 540)).toBe(true);
		const pixels = await page.evaluate(() =>
			window.__engineBench.pixels([
				[30, 30],
				[30, 100]
			])
		);
		expect(pixels[0]).toEqual(farTranslation ? [0, 0, 0, 0] : [255, 0, 0, 255]);
		expect(pixels[1]).toEqual([0, 0, 0, 0]);
	}
	const empty = await page.evaluate(() =>
		window.__engineBench.measureClippedRecording(false, true)
	);
	expect(empty).toContainEqual({ width: 0, height: 0 });
	expect(await page.evaluate(() => window.__engineBench.pixels([[30, 30]]))).toEqual([
		[0, 0, 0, 0]
	]);
	expect(errors).toEqual([]);
});

for (const deviceScaleFactor of [1, 2]) {
	for (const renderer of ['canvas', 'svg']) {
		test.describe(`${renderer} transformed text at DPR ${deviceScaleFactor}`, () => {
			test.use({ deviceScaleFactor });
			for (const gestureOutside of [false, true]) {
				test(`retaining paint overflow preserves text pixels (gestureOutside=${gestureOutside})`, async ({
					page
				}, testInfo) => {
					const errors: string[] = [];
					page.on('pageerror', (error) => errors.push(error.message));
					await page.goto(`http://localhost:4173/performance/engine?renderer=${renderer}`);
					await page.waitForFunction(() => !!window.__engineBench);
					const cases = ['positive', 'negative', 'rotated', 'nested', 'clipped'];
					const direct = new Map<string, Buffer>();
					const view = page.locator('[data-testid="engine"]');
					for (const name of cases) {
						await page.evaluate(
							({ name, gestureOutside }) =>
								window.__engineBench.renderTextOverflowCase(name, false, gestureOutside),
							{ name, gestureOutside }
						);
						direct.set(name, await view.screenshot());
					}
					// Keep the boundary mounted while geometry changes, exercising both
					// newly allocated and recycled recording buffers.
					for (const name of cases) {
						await page.evaluate(
							({ name, gestureOutside }) =>
								window.__engineBench.renderTextOverflowCase(name, true, gestureOutside),
							{ name, gestureOutside }
						);
						const retained = await view.screenshot();
						if (!retained.equals(direct.get(name)!)) {
							await testInfo.attach(`${name}-retained`, {
								body: retained,
								contentType: 'image/png'
							});
							await testInfo.attach(`${name}-direct`, {
								body: direct.get(name)!,
								contentType: 'image/png'
							});
						}
						const difference = await page.evaluate(
							async ({ reference, actual }) => {
								const decode = async (data: string) => {
									const image = new Image();
									image.src = `data:image/png;base64,${data}`;
									await image.decode();
									const canvas = document.createElement('canvas');
									canvas.width = image.width;
									canvas.height = image.height;
									const context = canvas.getContext('2d')!;
									context.drawImage(image, 0, 0);
									return context.getImageData(0, 0, image.width, image.height).data;
								};
								const [a, b] = await Promise.all([decode(reference), decode(actual)]);
								let max = 0,
									changed = 0;
								for (let i = 0; i < a.length; i++) {
									const delta = Math.abs(a[i] - b[i]);
									max = Math.max(max, delta);
									if (delta) changed++;
								}
								return { max, changed };
							},
							{
								reference: direct.get(name)!.toString('base64'),
								actual: retained.toString('base64')
							}
						);
						// Transparent intermediate text can round antialias coverage by one
						// channel level compared with painting straight onto opaque white.
						expect(difference.max, `${name}: ${JSON.stringify(difference)}`).toBeLessThanOrEqual(1);
						if (renderer === 'canvas') {
							const ink = await page.evaluate(() => {
								const canvas = document.querySelector('canvas')!;
								const pixels = canvas
									.getContext('2d')!
									.getImageData(0, 0, canvas.width, canvas.height).data;
								let count = 0;
								for (let i = 0; i < pixels.length; i += 4)
									if (
										pixels[i] < 100 &&
										pixels[i + 1] < 100 &&
										pixels[i + 2] < 100 &&
										pixels[i + 3] > 100
									)
										count++;
								return count;
							});
							if (name === 'clipped') expect(ink).toBe(0);
							else expect(ink).toBeGreaterThan(300);
						}
					}
					expect(errors).toEqual([]);
				});
			}
		});
	}
}

for (const renderer of ['canvas', 'svg']) {
	for (const boundary of [false, true]) {
		for (const nested of [false, true]) {
			test(`${renderer} clip toggle preserves state (boundary=${boundary}, nested=${nested})`, async ({
				page
			}) => {
				const errors: string[] = [];
				page.on('pageerror', (error) => errors.push(error.message));
				await page.goto(`http://localhost:4173/performance/engine?renderer=${renderer}`);
				await page.waitForFunction(() => !!window.__engineBench);
				await page.evaluate(
					async ({ boundary, nested }) => {
						await window.__engineBench.renderClipToggleCase(boundary, nested);
					},
					{ boundary, nested }
				);
				const view = page.locator('[data-testid="engine"]');
				const clipped = await view.screenshot();
				let unclipped: Buffer;
				for (let i = 0; i < 2; i++) {
					const before = await page.evaluate(() => window.__engineBench.clipCounts);
					await page.evaluate(() => window.__engineBench.setClipped(false));
					expect(await page.evaluate(() => window.__engineBench.clipCounts)).toEqual(before);
					unclipped = await view.screenshot();
					expect(unclipped.equals(clipped)).toBe(false);
					if (renderer === 'canvas') {
						const pixels = await page.evaluate(() =>
							window.__engineBench.pixels([
								[10, 10],
								[50, 10],
								[70, 10]
							])
						);
						expect(pixels).toEqual([
							[255, 0, 0, 255],
							[255, 0, 0, 255],
							nested ? [0, 0, 0, 0] : [255, 0, 0, 255]
						]);
					}
					await page.evaluate(() => window.__engineBench.setClipped(true));
					expect(await page.evaluate(() => window.__engineBench.clipCounts)).toMatchObject({
						mounts: 1,
						disposals: 0
					});
					expect((await view.screenshot()).equals(clipped)).toBe(true);
				}
				await page.evaluate(
					async ({ boundary, nested }) => {
						await window.__engineBench.renderClipToggleCase(boundary, nested, false);
					},
					{ boundary, nested }
				);
				expect(await page.evaluate(() => window.__engineBench.clipCounts)).toEqual({
					mounts: 1,
					disposals: 0,
					clips: 0
				});
				expect((await view.screenshot()).equals(unclipped!)).toBe(true);
				await page.evaluate(() => window.__engineBench.setClipped(true));
				expect(await page.evaluate(() => window.__engineBench.clipCounts)).toMatchObject({
					mounts: 1,
					disposals: 0
				});
				expect((await view.screenshot()).equals(clipped)).toBe(true);
				expect(errors).toEqual([]);
			});
		}
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
		// Repaint only one row, including its ten persistent text clip wrappers.
		if (scenario === 'paint-one') expect(counts.paints).toBeLessThan(70);
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
