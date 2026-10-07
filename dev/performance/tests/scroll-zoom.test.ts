import { test, expect, type Page } from '@playwright/test';

const metrics = (page: Page) => page.evaluate(() => (window as any).__scrollZoom.metrics());
async function mount(page: Page, renderer: string, parameters = '') {
	await page.goto(`/interaction/scroll-zoom?renderer=${renderer}${parameters}`);
	await expect.poll(() => page.evaluate(() => !!(window as any).__scrollZoom)).toBe(true);
	const box = (await page.getByTestId('scroll-zoom').boundingBox())!;
	return { x: box.x + 20, y: box.y + 20 };
}

for (const renderer of ['svg', 'canvas']) {
	test(`${renderer}: wheel, drag, controller, clipping and horizontal scrolling`, async ({
		page
	}) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		const origin = await mount(page, renderer);
		await expect.poll(async () => (await metrics(page)).max).toBe(400);
		await page.mouse.move(origin.x + 50, origin.y + 60);
		await page.mouse.wheel(0, 100);
		await expect.poll(async () => (await metrics(page)).offset).toBe(100);
		await page.mouse.down();
		await page.mouse.move(origin.x + 50, origin.y + 20, { steps: 3 });
		await page.mouse.up();
		await expect.poll(async () => (await metrics(page)).offset).toBe(140);
		await page.evaluate(() => (window as any).__scrollZoom.animate(240));
		await expect.poll(async () => (await metrics(page)).offset).toBe(240);
		await page.mouse.click(origin.x + 50, origin.y + 20);
		await expect.poll(async () => (await metrics(page)).hits).toBe(4);
		await page.mouse.click(origin.x + 50, origin.y - 5);
		expect((await metrics(page)).hits).toBe(4);
		await page.evaluate(() => (window as any).__scrollZoom.disable());
		await page.mouse.move(origin.x + 50, origin.y + 60);
		await page.mouse.wheel(0, 100);
		await page.waitForTimeout(80);
		expect((await metrics(page)).offset).toBe(240);
		const horizontal = await mount(page, renderer, '&horizontal');
		await expect.poll(async () => (await metrics(page)).max).toBe(480);
		await page.mouse.move(horizontal.x + 60, horizontal.y + 40);
		await page.mouse.wheel(90, 0);
		await expect.poll(async () => (await metrics(page)).offset).toBe(90);
		expect(errors).toEqual([]);
	});

	test(`${renderer}: cursor-centered zoom, transformed hits, drag bounds and controller reset`, async ({
		page
	}) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		const origin = await mount(page, renderer, '&mode=zoom');
		const scene = await page.evaluate(() => (window as any).__scrollZoom.toScene(80, 80));
		await page.mouse.move(origin.x + 80, origin.y + 80);
		await page.mouse.wheel(0, -100);
		await expect.poll(async () => (await metrics(page)).matrix[0]).toBeGreaterThan(1.6);
		const after = await page.evaluate(() => (window as any).__scrollZoom.toScene(80, 80));
		expect(after.x).toBeCloseTo(scene.x);
		expect(after.y).toBeCloseTo(scene.y);
		await page.mouse.click(origin.x + 80, origin.y + 40);
		await expect.poll(async () => (await metrics(page)).hits).toBe(1);
		await page.mouse.move(origin.x + 120, origin.y + 120);
		await page.mouse.down();
		await page.mouse.move(origin.x + 200, origin.y + 200, { steps: 3 });
		await page.mouse.up();
		await expect.poll(async () => (await metrics(page)).matrix[12]).toBeCloseTo(0);
		expect((await metrics(page)).matrix[13]).toBeCloseTo(0);
		await page.mouse.wheel(0, -2000);
		await expect.poll(async () => (await metrics(page)).matrix[0]).toBe(3);
		await page.evaluate(() => (window as any).__scrollZoom.reset());
		await expect.poll(async () => (await metrics(page)).matrix[0]).toBe(1);
		await page.evaluate(() => (window as any).__scrollZoom.disable());
		await page.mouse.wheel(0, -200);
		await page.waitForTimeout(80);
		expect((await metrics(page)).matrix[0]).toBe(1);
		expect((await metrics(page)).starts).toBeGreaterThan(0);
		expect((await metrics(page)).updates).toBeGreaterThan(0);
		expect((await metrics(page)).ends).toBeGreaterThan(0);
		await page.evaluate(() => (window as any).__scrollZoom.replace());
		await expect.poll(async () => (await metrics(page)).max).toBe(400);
		expect(errors).toEqual([]);
	});
}
