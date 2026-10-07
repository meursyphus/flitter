import { expect, test, type Page } from '@playwright/test';

const cases = [
	['barchart', 'vertical', 'vertical'],
	['piechart', 'default', 'default'],
	['boxplotchart', 'vertical', 'vertical'],
	['bulletchart', 'horizontal', 'horizontal'],
	['histogramchart', 'basic', 'basic'],
	['waterfallchart', 'operating-bridge', 'operating-bridge'],
	['sankeychart', 'energy-flow', 'energy-flow'],
	['sunburstchart', 'organization', 'default'],
	['funnelchart', 'conversion', 'conversion']
] as const;

async function openStory(page: Page, id: string, renderer: 'svg' | 'canvas') {
	await page.goto(`/iframe.html?id=${id}&viewMode=story&args=renderer:${renderer}`, {
		waitUntil: 'networkidle'
	});
	await expect(page.locator(`#storybook-root ${renderer}`).first()).toBeVisible();
	await page.waitForTimeout(1200);
}

/** Find an interior point of a real mark, excluding axes, labels and legend keys. */
async function markPoint(page: Page) {
	return page.evaluate(() => {
		const svg = document.querySelector('#storybook-root svg')!;
		const bounds = svg.getBoundingClientRect();
		const paths = [...svg.querySelectorAll<SVGGeometryElement>('path, rect, circle, polygon')]
			.filter((path) => {
				const box = path.getBoundingClientRect();
				const components =
					getComputedStyle(path)
						.fill.match(/[\d.]+/g)
						?.map(Number) ?? [];
				const [r = 0, g = 0, b = 0, alpha = 1] = components;
				const colored = Math.max(r, g, b) - Math.min(r, g, b) > 30;
				const bullet = r === g && g === b && r >= 32 && r <= 75;
				return alpha > 0 && (colored || bullet) && box.width > 18 && box.height > 12;
			})
			.sort((a, b) => {
				const x = a.getBoundingClientRect();
				const y = b.getBoundingClientRect();
				return y.width * y.height - x.width * x.height;
			});
		for (const path of paths) {
			const box = path.getBoundingClientRect();
			const matrix = path.getScreenCTM();
			if (!matrix) continue;
			for (const x of [0.5, 0.35, 0.65, 0.2, 0.8]) {
				for (const y of [0.5, 0.35, 0.65, 0.2, 0.8]) {
					const point = new DOMPoint(box.left + box.width * x, box.top + box.height * y);
					if (path.isPointInFill(point.matrixTransform(matrix.inverse()))) {
						return { x: point.x - bounds.left, y: point.y - bounds.top };
					}
				}
			}
		}
		return null;
	});
}

async function changedPixels(page: Page, before: Buffer, after: Buffer): Promise<number> {
	return page.evaluate(
		async ([a, b]) => {
			const pixels = await Promise.all(
				[a, b].map(async (source) => {
					const image = new Image();
					image.src = source;
					await image.decode();
					const canvas = document.createElement('canvas');
					canvas.width = image.width;
					canvas.height = image.height;
					const context = canvas.getContext('2d')!;
					context.drawImage(image, 0, 0);
					return context.getImageData(0, 0, canvas.width, canvas.height).data;
				})
			);
			let count = 0;
			for (let index = 0; index < pixels[0].length; index += 4) {
				// Ignore minor shared-edge antialiasing changes after z-order restoration.
				if (
					[0, 1, 2].some(
						(channel) => Math.abs(pixels[0][index + channel] - pixels[1][index + channel]) > 24
					)
				)
					count++;
			}
			return count;
		},
		[before, after].map((buffer) => `data:image/png;base64,${buffer.toString('base64')}`)
	);
}

for (const [chart, agStory, toastStory] of cases) {
	for (const style of ['ag', 'toast'] as const) {
		test(`${chart}/${style}: SVG and Canvas marks, hover and leave`, async ({ page }, info) => {
			const errors: string[] = [];
			page.on('pageerror', (error) => errors.push(error.stack ?? error.message));
			const id = `charts-${chart}-${style}--${style === 'ag' ? agStory : toastStory}`;
			await openStory(page, id, 'svg');
			const point = await markPoint(page);
			expect(point, 'A data mark must be visible').not.toBeNull();

			for (const renderer of ['svg', 'canvas'] as const) {
				if (renderer === 'canvas') await openStory(page, id, renderer);
				const surface = page.locator(`#storybook-root ${renderer}`).first();
				const box = (await surface.boundingBox())!;
				const baseline = await surface.screenshot({
					path: info.outputPath(`${renderer}-default.png`)
				});
				const textCount = await page.locator('#storybook-root svg text').count();
				await page.mouse.move(box.x + point!.x, box.y + point!.y);
				await page.waitForTimeout(600);
				const hovered = await surface.screenshot({
					path: info.outputPath(`${renderer}-hover.png`)
				});
				expect(hovered.equals(baseline), 'Hover must highlight a mark and show a tooltip').toBe(
					false
				);
				if (renderer === 'svg') {
					expect(
						await page.locator('#storybook-root svg text').count(),
						'Tooltip adds text'
					).toBeGreaterThan(textCount);
				}
				await page.mouse.move(0, 0);
				await page.waitForTimeout(650);
				const left = await surface.screenshot({ path: info.outputPath(`${renderer}-leave.png`) });
				expect(
					await changedPixels(page, baseline, left),
					'Leaving must clear the highlight and tooltip'
				).toBeLessThanOrEqual(16);
			}
			expect(errors).toEqual([]);
		});
	}
}

for (const style of ['ag', 'toast'] as const) {
	test(`Funnel/${style}: legend filters and restores stages`, async ({ page }) => {
		await openStory(page, `charts-funnelchart-${style}--interactive-legend`, 'svg');
		const surface = page.locator('#storybook-root svg');
		const legend = page
			.locator('#storybook-root svg text')
			.filter({ hasText: /^Visits$/ })
			.last();
		const baseline = await surface.screenshot();
		const legendBox = (await legend.boundingBox())!;
		await page.mouse.click(legendBox.x + legendBox.width / 2, legendBox.y + legendBox.height / 2);
		await page.mouse.move(0, 0);
		await page.waitForTimeout(600);
		expect((await surface.screenshot()).equals(baseline)).toBe(false);
		await page.mouse.click(legendBox.x + legendBox.width / 2, legendBox.y + legendBox.height / 2);
		await page.mouse.move(0, 0);
		await page.waitForTimeout(600);
		expect((await surface.screenshot()).equals(baseline)).toBe(true);
	});
}
