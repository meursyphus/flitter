import { test, expect } from '@playwright/test';
import type ScrollController from '../../../packages/core/src/component/ScrollController';
declare global {
	interface Window {
		sliverTest: {
			controller: ScrollController;
			settle: () => Promise<void>;
			pixel: (x: number, y: number) => Promise<number[]>;
			stats: {
				built: number[];
				mounts: number;
				disposals: number;
				clicks: number[];
				activations: number;
				dragStarts: number;
			};
			dispose: () => void;
		};
	}
}
for (const renderer of ['svg', 'canvas']) {
	test(`${renderer}: virtualizes, clips, hit tests, recycles and disposes a 10,000-row list`, async ({
		page
	}) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.goto(`/?renderer=${renderer}`);
		await page.waitForFunction(() => !!window.sliverTest);
		expect(await page.evaluate(() => window.sliverTest.stats.built)).toEqual([0, 1, 2, 3, 4, 5]);
		expect(await page.evaluate(() => window.sliverTest.pixel(30, 130))).toEqual([
			255, 255, 255, 255
		]);
		await page.mouse.click(30, 25);
		await page.evaluate(() => window.sliverTest.settle());
		const selected = await page.locator('#view').screenshot();
		expect(await page.evaluate(() => window.sliverTest.pixel(30, 25))).toEqual([0, 255, 0, 255]);
		await page.evaluate(async () => {
			window.sliverTest.controller.jumpTo(100);
			await window.sliverTest.settle();
		});
		await page.mouse.click(30, 130); // Cached row below the clipped viewport must not receive this.
		expect(await page.evaluate(() => window.sliverTest.stats.clicks)).toEqual([0]);
		await page.evaluate(async () => {
			window.sliverTest.controller.jumpTo(0);
			await window.sliverTest.settle();
		});
		expect((await page.locator('#view').screenshot()).equals(selected)).toBe(true);
		expect(await page.evaluate(() => window.sliverTest.stats.activations)).toBeGreaterThan(0);
		await page.mouse.click(30, 25); // A recycled detector must register one drag start.
		await page.evaluate(async () => {
			window.sliverTest.controller.jumpTo(100000);
			await window.sliverTest.settle();
		});
		expect(await page.evaluate(() => window.sliverTest.stats.built.length)).toBeLessThan(25);
		await page.mouse.click(30, 25);
		expect(await page.evaluate(() => window.sliverTest.stats.clicks)).toEqual([0, 0, 5000]);
		expect(await page.evaluate(() => window.sliverTest.pixel(30, 130))).toEqual([
			255, 255, 255, 255
		]);
		await page.mouse.move(30, 45);
		await page.mouse.wheel(0, 40);
		await expect.poll(() => page.evaluate(() => window.sliverTest.controller.offset)).toBe(100040);
		await page.evaluate(async () => {
			await window.sliverTest.controller.animateTo(0, { duration: 32 });
			await window.sliverTest.settle();
		});
		expect(await page.evaluate(() => window.sliverTest.controller.offset)).toBe(0);
		await page.evaluate(() => window.sliverTest.dispose());
		const stats = await page.evaluate(() => window.sliverTest.stats);
		expect(stats.disposals).toBe(stats.mounts);
		expect(stats.dragStarts).toBe(3);
		expect(errors).toEqual([]);
	});

	test(`${renderer}: variable-height horizontal scrolling keeps the viewport coordinates correct`, async ({
		page
	}) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.goto(`/?renderer=${renderer}&horizontal&variable`);
		await page.waitForFunction(() => !!window.sliverTest);
		await page.evaluate(async () => {
			window.sliverTest.controller.jumpTo(1015);
			await window.sliverTest.settle();
		});
		await page.mouse.click(25, 30);
		expect(await page.evaluate(() => window.sliverTest.stats.clicks)).toEqual([51]);
		expect(await page.evaluate(() => window.sliverTest.pixel(225, 30))).toEqual([
			255, 255, 255, 255
		]);
		expect(
			await page.evaluate(() => window.sliverTest.stats.mounts - window.sliverTest.stats.disposals)
		).toBeLessThan(40);
		await page.evaluate(() => window.sliverTest.dispose());
		expect(errors).toEqual([]);
	});
}

for (const renderer of ['svg', 'canvas']) {
	for (const horizontal of [false, true]) {
		for (const reverse of [false, true]) {
			test(`${renderer}: padded ${horizontal ? 'horizontal' : 'vertical'} ${reverse ? 'reverse' : 'forward'} list supports wheel and drag`, async ({
				page
			}) => {
				const errors: string[] = [];
				page.on('pageerror', (error) => errors.push(error.message));
				await page.goto(
					`/?renderer=${renderer}&padded${horizontal ? '&horizontal' : ''}${reverse ? '&reverse' : ''}`
				);
				await page.waitForFunction(() => !!window.sliverTest);
				const mainExtent = horizontal ? 200 : 100;
				expect(await page.evaluate(() => window.sliverTest.controller.maxScrollExtent)).toBe(
					200000 + 40 - mainExtent
				);
				const firstMain = reverse ? mainExtent - 30 - 10 : 10 + 10;
				await page.mouse.click(horizontal ? 20 + firstMain : 50, horizontal ? 50 : 20 + firstMain);
				expect(await page.evaluate(() => window.sliverTest.stats.clicks)).toEqual([0]);
				// The leading padding moves out of the viewport after scrolling.
				await page.evaluate(async (reverse) => {
					window.sliverTest.controller.jumpTo(reverse ? 30 : 10);
					await window.sliverTest.settle();
				}, reverse);
				const viewportEdge = reverse ? mainExtent - 5 : 5;
				const position = {
					x: horizontal ? 20 + viewportEdge : 50,
					y: horizontal ? 50 : 20 + viewportEdge
				};
				await page.mouse.click(position.x, position.y);
				expect(await page.evaluate(() => window.sliverTest.stats.clicks)).toEqual([0, 0]);
				await page.mouse.move(60, 60);
				await page.mouse.wheel(
					horizontal ? (reverse ? -40 : 40) : 0,
					horizontal ? 0 : reverse ? -40 : 40
				);
				const afterWheel = (reverse ? 30 : 10) + 40;
				await expect
					.poll(() => page.evaluate(() => window.sliverTest.controller.offset))
					.toBe(afterWheel);
				await page.mouse.move(90, 75);
				await page.mouse.down();
				await page.mouse.move(
					horizontal ? 90 + (reverse ? 20 : -20) : 90,
					horizontal ? 75 : 75 + (reverse ? 20 : -20),
					{ steps: 2 }
				);
				await page.mouse.up();
				await expect
					.poll(() => page.evaluate(() => window.sliverTest.controller.offset))
					.toBe(afterWheel + 20);
				await page.evaluate(async () => {
					window.sliverTest.controller.jumpTo(window.sliverTest.controller.maxScrollExtent);
					await window.sliverTest.settle();
				});
				const lastMain = reverse ? 15 : mainExtent - 35;
				await page.mouse.click(horizontal ? 20 + lastMain : 50, horizontal ? 50 : 20 + lastMain);
				expect(await page.evaluate(() => window.sliverTest.stats.clicks.at(-1))).toBe(9999);
				expect(await page.evaluate(() => window.sliverTest.stats.built.length)).toBeLessThan(50);
				await page.evaluate(() => window.sliverTest.dispose());
				expect(errors).toEqual([]);
			});
		}
	}
	test(`${renderer}: NeverScrollable physics blocks wheel and drag but permits programmatic scrolling`, async ({
		page
	}) => {
		await page.goto(`/?renderer=${renderer}&disabled`);
		await page.waitForFunction(() => !!window.sliverTest);
		await page.mouse.move(80, 80);
		await page.mouse.wheel(0, 100);
		await page.mouse.down();
		await page.mouse.move(80, 40, { steps: 2 });
		await page.mouse.up();
		await page.evaluate(() => window.sliverTest.settle());
		expect(await page.evaluate(() => window.sliverTest.controller.offset)).toBe(0);
		await page.evaluate(async () => {
			window.sliverTest.controller.jumpTo(200);
			await window.sliverTest.settle();
		});
		expect(await page.evaluate(() => window.sliverTest.controller.offset)).toBe(200);
		await page.evaluate(() => window.sliverTest.dispose());
	});
}
