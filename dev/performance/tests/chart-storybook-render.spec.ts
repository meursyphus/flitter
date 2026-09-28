import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(currentDir, '../test-results/chart-renders');
const baseURL = process.env.STORYBOOK_BASE_URL ?? 'http://127.0.0.1:6007';
const renderers = ['svg', 'canvas'] as const;

type StoryIndex = {
	entries: Record<
		string,
		{
			id: string;
			title: string;
			type: string;
			name: string;
		}
	>;
};

function sanitize(value: string): string {
	return value.replace(/[^a-z0-9-_]+/gi, '-').toLowerCase();
}

test.describe('Chart Storybook render sweep', () => {
	test('renders every Charts/* story and produces non-empty output', async ({
		browser,
		request
	}) => {
		test.setTimeout(10 * 60 * 1000);
		fs.rmSync(outputDir, { recursive: true, force: true });
		fs.mkdirSync(outputDir, { recursive: true });

		let response = await request.get(`${baseURL}/index.json`);
		for (let attempt = 0; attempt < 30 && !response.ok(); attempt++) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			response = await request.get(`${baseURL}/index.json`);
		}
		expect(response.ok()).toBeTruthy();

		const index = (await response.json()) as StoryIndex;
		const stories = Object.values(index.entries)
			.filter((entry) => entry.type === 'story' && entry.title.startsWith('Charts/'))
			.sort((a, b) => a.title.localeCompare(b.title) || a.name.localeCompare(b.name));

		expect(stories.length).toBeGreaterThan(0);

		for (const story of stories) {
			for (const renderer of renderers) {
				const page = await browser.newPage({
					viewport: { width: 1440, height: 960 }
				});

				const consoleErrors: string[] = [];
				const pageErrors: string[] = [];

				page.on('console', (message) => {
					if (message.type() === 'error' && !message.text().includes('favicon')) {
						consoleErrors.push(message.text());
					}
				});

				page.on('pageerror', (error) => {
					pageErrors.push(error.message);
				});

				const url = `${baseURL}/iframe.html?id=${story.id}&viewMode=story&args=renderer:${renderer}`;
				await page.goto(url, { waitUntil: 'networkidle' });
				await page.waitForTimeout(1200);

				const storyRoot = page.locator('#storybook-root');
				await expect(storyRoot).toBeVisible();

				const renderSurface = page.locator('svg, canvas').first();
				await expect(renderSurface).toBeVisible();

				const surfaceInfo = await page.evaluate(() => {
					const svg = document.querySelector('svg');
					const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;

					if (svg) {
						const bbox = svg.getBoundingClientRect();
						const drawNodes = svg.querySelectorAll(
							'path, rect, circle, ellipse, line, polyline, polygon, text'
						).length;

						return {
							kind: 'svg' as const,
							width: bbox.width,
							height: bbox.height,
							drawNodes
						};
					}

					if (canvas) {
						const ctx = canvas.getContext('2d');
						if (!ctx) {
							return {
								kind: 'canvas' as const,
								width: canvas.width,
								height: canvas.height,
								nonTransparentPixels: 0,
								uniqueColors: 0
							};
						}

						const width = Math.min(canvas.width, 512);
						const height = Math.min(canvas.height, 512);
						const imageData = ctx.getImageData(0, 0, width, height).data;
						let nonTransparentPixels = 0;
						const uniqueColors = new Set<string>();

						for (let index = 0; index < imageData.length; index += 16) {
							const r = imageData[index];
							const g = imageData[index + 1];
							const b = imageData[index + 2];
							const a = imageData[index + 3];

							if (a > 0) {
								nonTransparentPixels += 1;
							}

							uniqueColors.add(
								`${Math.round(r / 16)}-${Math.round(g / 16)}-${Math.round(b / 16)}-${Math.round(a / 16)}`
							);
						}

						return {
							kind: 'canvas' as const,
							width: canvas.width,
							height: canvas.height,
							nonTransparentPixels,
							uniqueColors: uniqueColors.size
						};
					}

					return null;
				});

				expect(pageErrors, `${story.id} emitted page errors (${renderer})`).toEqual([]);
				expect(consoleErrors, `${story.id} emitted console errors (${renderer})`).toEqual([]);
				expect(
					surfaceInfo,
					`${story.id} did not expose a render surface (${renderer})`
				).not.toBeNull();
				expect(surfaceInfo?.kind, `${story.id} must use the requested renderer`).toBe(renderer);

				if (surfaceInfo?.kind === 'svg') {
					expect(surfaceInfo.width, `${story.id} svg width (${renderer})`).toBeGreaterThan(40);
					expect(surfaceInfo.height, `${story.id} svg height (${renderer})`).toBeGreaterThan(40);
					expect(surfaceInfo.drawNodes, `${story.id} svg draw nodes (${renderer})`).toBeGreaterThan(
						3
					);
				}

				if (surfaceInfo?.kind === 'canvas') {
					expect(surfaceInfo.width, `${story.id} canvas width (${renderer})`).toBeGreaterThan(40);
					expect(surfaceInfo.height, `${story.id} canvas height (${renderer})`).toBeGreaterThan(40);
					expect(
						surfaceInfo.nonTransparentPixels,
						`${story.id} canvas appears blank (${renderer})`
					).toBeGreaterThan(50);
					expect(
						surfaceInfo.uniqueColors,
						`${story.id} canvas color diversity too low (${renderer})`
					).toBeGreaterThan(3);
				}

				await page.screenshot({
					path: path.join(
						outputDir,
						`${sanitize(story.title)}--${sanitize(story.name)}--${renderer}.png`
					),
					fullPage: true
				});

				await page.close();
			}
		}
	});
});
