import { writeFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

const families = ['box-plot', 'bullet', 'funnel', 'histogram', 'sankey', 'sunburst', 'waterfall'];
type Probe = { x: number; y: number; expected: string | null; reason: string };

async function open(page: Page, family: string, style: string, renderer = 'svg', width = 800) {
	await page.goto(
		`/iframe.html?id=gallery-interaction-review--${family}-${style}&viewMode=story&args=renderer:${renderer};width:${width};theme:dark`,
		{ waitUntil: 'networkidle' }
	);
	await expect(page.locator(`[data-testid="gallery-chart"] ${renderer}`)).toBeVisible();
	await page.waitForFunction(() => !!(window as any).__galleryAudit);
	await page.waitForTimeout(900);
}

/** The rendered SVG is the geometric oracle, not the engine's hit-test code. */
async function probes(
	page: Page
): Promise<{ points: Probe[]; markCount: number; legendCount: number; expectedMarks: number }> {
	return page.evaluate(() => {
		const audit = (window as any).__galleryAudit;
		const root = document.querySelector('[data-testid="gallery-chart"] svg')!;
		const bounds = root.getBoundingClientRect();
		const marks = audit.marks().filter((mark: any) => mark.slot !== 'legend');
		const shapes: { id: string; shape: SVGGeometryElement; rect: DOMRect; outline: boolean }[] = [];
		for (const mark of marks) {
			for (const shape of mark.geometries as SVGGeometryElement[]) {
				const rect = shape.getBoundingClientRect();
				const style = getComputedStyle(shape);
				const visible = (color: string) => {
					const channels = color.match(/[\d.]+/g)?.map(Number) ?? [];
					return (
						color !== 'none' &&
						color !== 'transparent' &&
						!(channels.length === 4 && channels[3] === 0)
					);
				};
				if (
					rect.width < 0.9 ||
					rect.height < 0.9 ||
					(!visible(style.fill) && !visible(style.stroke))
				)
					continue;
				shapes.push({ id: mark.id, shape, rect, outline: mark.slot === 'outlier' });
			}
		}
		shapes.sort((a, b) =>
			a.shape.compareDocumentPosition(b.shape) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
		);
		const contains = (entry: (typeof shapes)[number], x: number, y: number) => {
			if (
				x < entry.rect.left ||
				y < entry.rect.top ||
				x >= entry.rect.right - 0.001 ||
				y >= entry.rect.bottom - 0.001
			)
				return false;
			const matrix = entry.shape.getScreenCTM();
			return (
				matrix != null &&
				entry.shape.isPointInFill(new DOMPoint(x, y).matrixTransform(matrix.inverse()))
			);
		};
		const expectedAt = (x: number, y: number) => {
			for (let i = shapes.length - 1; i >= 0; i--)
				if (contains(shapes[i], x, y)) return shapes[i].id;
			// Box-and-whisker targets intentionally include the narrow region joining
			// their whiskers; outlined outlier dots include their hollow center.
			for (const mark of marks)
				if (mark.slot === 'boxPlot' || mark.slot === 'outlier') {
					const r = mark.rect;
					const px = x - bounds.left;
					const py = y - bounds.top;
					if (px >= r.x && px < r.x + r.width - 0.001 && py >= r.y && py < r.y + r.height - 0.001)
						return mark.id;
				}
			return null;
		};
		const points: Probe[] = [];
		const seen = new Set<string>();
		const add = (x: number, y: number, expected: string | null, reason: string) => {
			x = Math.round(x);
			y = Math.round(y);
			if (expectedAt(x, y) !== expected) return;
			// Adjacent fills share their exact mathematical edge. Check each side's
			// interior rather than imposing a paint-order tie-break on that edge.
			if (
				new Set(shapes.filter((shape) => contains(shape, x, y)).map((shape) => shape.id)).size > 1
			)
				return;
			const key = `${x}:${y}`;
			if (seen.has(key)) return;
			seen.add(key);
			points.push({ x: x - bounds.left, y: y - bounds.top, expected, reason });
		};
		for (const entry of shapes) {
			const r = entry.rect;
			const candidates: { x: number; y: number }[] = [];
			for (const fx of [0.02, 0.15, 0.35, 0.5, 0.65, 0.85, 0.98])
				for (const fy of [0.02, 0.15, 0.35, 0.5, 0.65, 0.85, 0.98]) {
					const x = r.left + r.width * fx;
					const y = r.top + r.height * fy;
					if (expectedAt(x, y) === entry.id) candidates.push({ x, y });
				}
			const extremes = [
				candidates.find(
					(p) =>
						Math.abs(p.x - r.left - r.width / 2) < 1 && Math.abs(p.y - r.top - r.height / 2) < 1
				),
				...[...candidates].sort((a, b) => a.x - b.x).slice(0, 1),
				...[...candidates].sort((a, b) => b.x - a.x).slice(0, 1),
				...[...candidates].sort((a, b) => a.y - b.y).slice(0, 1),
				...[...candidates].sort((a, b) => b.y - a.y).slice(0, 1)
			].filter(Boolean) as { x: number; y: number }[];
			for (const p of extremes) add(p.x, p.y, entry.id, 'mark interior / edge');
		}
		// Include holes, between-mark gaps and the unused portions of bar columns.
		for (let y = 35; y < bounds.height - 30; y += 27)
			for (let x = 15; x < bounds.width - 15; x += 31) {
				const sx = bounds.left + x,
					sy = bounds.top + y;
				if (
					[
						[-2, 0],
						[2, 0],
						[0, -2],
						[0, 2],
						[0, 0]
					].every(([dx, dy]) => expectedAt(sx + dx, sy + dy) == null)
				)
					add(sx, sy, null, 'empty plot');
			}
		const c = audit.controller;
		const expectedMarks = audit.slug.startsWith('sankey')
			? c.layout.nodes.length + c.layout.links.length
			: audit.slug.startsWith('sunburst')
				? c.segments.length
				: audit.slug.startsWith('funnel')
					? c.stages.length
					: audit.slug.startsWith('histogram')
						? c.bins.length
						: audit.slug.startsWith('waterfall')
							? c.items.length
							: audit.slug.startsWith('bullet')
								? c.data.datasets.length
								: c.data.datasets.reduce(
										(sum: number, d: any) =>
											sum +
											d.data.length +
											d.data.reduce((n: number, p: any) => n + (p.outliers?.length ?? 0), 0),
										0
									);
		return {
			points,
			expectedMarks,
			markCount: new Set(shapes.map((s) => s.id)).size,
			legendCount: audit.marks().filter((m: any) => m.slot === 'legend').length
		};
	});
}

for (const family of families)
	for (const style of ['ag', 'toast']) {
		test(`${family}/${style}: every gallery mark and empty region selects the correct data`, async ({
			page
		}, info) => {
			test.setTimeout(180000);
			const errors: string[] = [];
			page.on('pageerror', (e) => errors.push(e.stack ?? e.message));
			await open(page, family, style);
			const plan = await probes(page);
			expect(plan.markCount).toBe(plan.expectedMarks);
			expect(
				new Set(plan.points.filter((p) => p.expected != null).map((p) => p.expected)).size
			).toBe(plan.expectedMarks);
			const failures: unknown[] = [];
			for (const renderer of ['svg', 'canvas']) {
				if (renderer === 'canvas') await open(page, family, style, renderer);
				const surface = page.locator(`[data-testid="gallery-chart"] ${renderer}`);
				const box = (await surface.boundingBox())!;
				const clicked = new Set<string>();
				let captured = false;
				for (const point of plan.points) {
					await page.mouse.move(box.x + point.x, box.y + point.y);
					if (point.expected != null && !clicked.has(point.expected)) {
						await page.mouse.click(box.x + point.x, box.y + point.y);
						clicked.add(point.expected);
						await page.waitForTimeout(150);
						const tooltipRect = await page.evaluate(() =>
							(window as any).__galleryAudit.tooltipBounds()
						);
						if (
							tooltipRect == null ||
							tooltipRect.x < -1 ||
							tooltipRect.y < -1 ||
							tooltipRect.x + tooltipRect.width > box.width + 1 ||
							tooltipRect.y + tooltipRect.height > box.height + 1
						) {
							failures.push({ renderer, ...point, reason: 'tooltip clipping', tooltipRect });
						}
					}
					await page.waitForTimeout(35);
					const { actual, tooltip } = await page.evaluate(() => ({
						actual: (window as any).__galleryAudit.hover(),
						tooltip: (window as any).__galleryAudit.hasTooltip()
					}));
					if (tooltip !== (point.expected != null))
						failures.push({ renderer, ...point, actual, reason: 'tooltip presence', tooltip });
					if (!captured && point.expected != null) {
						await surface.screenshot({ path: info.outputPath(`${renderer}-hover.png`) });
						captured = true;
					}
					if (actual !== point.expected) {
						if (failures.length === 0)
							await surface.screenshot({ path: info.outputPath(`${renderer}-first-failure.png`) });
						failures.push({ renderer, ...point, actual });
					}
				}
				await page.mouse.move(0, 0);
				await page.waitForTimeout(150);
				expect(await page.evaluate(() => (window as any).__galleryAudit.hover())).toBeNull();
			}
			const report = info.outputPath('hit-audit.json');
			writeFileSync(
				report,
				JSON.stringify(
					{
						family,
						style,
						marks: plan.markCount,
						probes: plan.points.length * 2,
						failures,
						errors
					},
					null,
					2
				)
			);
			await info.attach('hit-audit.json', { path: report, contentType: 'application/json' });
			expect(errors).toEqual([]);
			expect(failures, `${plan.markCount} marks, ${plan.points.length * 2} pointer probes`).toEqual(
				[]
			);
		});
	}

for (const style of ['ag', 'toast']) {
	test(`box-plot/${style}: both legend entries filter and restore in SVG and Canvas`, async ({
		page
	}) => {
		await open(page, 'box-plot', style);
		const legends = await page.evaluate(() =>
			(window as any).__galleryAudit
				.marks()
				.filter((mark: any) => mark.slot === 'legend')
				.map((mark: any) => ({ rect: mark.rect, name: mark.name }))
		);
		expect(legends).toHaveLength(2);
		const first = (await probes(page)).points.find((p) => p.expected != null)!;
		for (const renderer of ['svg', 'canvas']) {
			if (renderer === 'canvas') await open(page, 'box-plot', style, renderer);
			const box = (await page.locator(`[data-testid="gallery-chart"] ${renderer}`).boundingBox())!;
			for (const legend of legends) {
				const x = box.x + legend.rect.x + legend.rect.width / 2,
					y = box.y + legend.rect.y + legend.rect.height / 2;
				await page.mouse.click(x, y);
				await page.waitForTimeout(400);
				expect(
					await page.evaluate(
						(name) => (window as any).__galleryAudit.controller.isSeriesVisible(name),
						legend.name
					)
				).toBe(false);
				await page.mouse.click(x, y);
				await page.waitForTimeout(400);
				expect(
					await page.evaluate(
						(name) => (window as any).__galleryAudit.controller.isSeriesVisible(name),
						legend.name
					)
				).toBe(true);
			}
			for (const expected of [0, 2]) {
				for (const legend of legends) {
					const r = legend.rect;
					await page.mouse.click(box.x + r.x + r.width / 2, box.y + r.y + r.height / 2);
					await page.waitForTimeout(250);
				}
				expect(
					await page.evaluate(() => (window as any).__galleryAudit.controller.data.datasets.length)
				).toBe(expected);
			}
			await page.mouse.move(box.x + first.x, box.y + first.y);
			await page.waitForTimeout(100);
			expect(await page.evaluate(() => (window as any).__galleryAudit.hover())).toBe(
				first.expected
			);
		}
	});
}

for (const family of ['funnel', 'sunburst'])
	for (const style of ['ag', 'toast']) {
		test(`${family}/${style}: hide all legends, restore, and keep hover identity`, async ({
			page
		}) => {
			test.setTimeout(90000);
			await page.goto(
				`/iframe.html?id=gallery-interaction-review--${family}-${style}&viewMode=story&args=legendMode:show;theme:dark`,
				{ waitUntil: 'networkidle' }
			);
			await page.waitForTimeout(900);
			const legends = await page.evaluate(() =>
				(window as any).__galleryAudit
					.marks()
					.filter((mark: any) => mark.slot === 'legend')
					.map((mark: any) => ({ rect: mark.rect, id: mark.id }))
			);
			expect(legends.length).toBeGreaterThan(1);
			const first = (await probes(page)).points.find((p) => p.expected != null)!;
			let singleVisible: Probe[] = [];
			for (const renderer of ['svg', 'canvas']) {
				if (renderer === 'canvas') {
					await page.goto(
						`/iframe.html?id=gallery-interaction-review--${family}-${style}&viewMode=story&args=legendMode:show;renderer:canvas;theme:dark`,
						{ waitUntil: 'networkidle' }
					);
					await page.waitForTimeout(900);
				}
				const box = (await page
					.locator(`[data-testid="gallery-chart"] ${renderer}`)
					.boundingBox())!;
				const visible = () =>
					page.evaluate((family) => {
						const c = (window as any).__galleryAudit.controller;
						return family === 'funnel' ? c.stages.length : c.data.nodes.length;
					}, family);
				for (let i = 0; i < legends.length; i++) {
					const r = legends[i].rect;
					await page.mouse.click(box.x + r.x + r.width / 2, box.y + r.y + r.height / 2);
					await page.waitForTimeout(250);
					expect(await visible()).toBe(legends.length - i - 1);
					if (i === legends.length - 2) {
						if (renderer === 'svg') {
							const single = await probes(page);
							expect(single.markCount).toBe(single.expectedMarks);
							singleVisible = [
								...new Map(
									single.points.filter((p) => p.expected != null).map((p) => [p.expected, p])
								).values()
							];
							expect(singleVisible.length).toBe(single.expectedMarks);
						}
						for (const point of singleVisible) {
							await page.mouse.move(box.x + point.x, box.y + point.y);
							await page.waitForTimeout(80);
							expect(await page.evaluate(() => (window as any).__galleryAudit.hover())).toBe(
								point.expected
							);
						}
					}
				}
				for (const legend of legends) {
					const r = legend.rect;
					await page.mouse.click(box.x + r.x + r.width / 2, box.y + r.y + r.height / 2);
					await page.waitForTimeout(250);
				}
				expect(await visible()).toBe(legends.length);
				expect(await page.evaluate(() => (window as any).__galleryAudit.hover())).toBeNull();
				await page.mouse.move(box.x + first.x, box.y + first.y);
				await page.waitForTimeout(100);
				expect(await page.evaluate(() => (window as any).__galleryAudit.hover())).toBe(
					first.expected
				);
			}
		});
	}

for (const renderer of ['svg', 'canvas']) {
	test(`sankey: pointer coordinates follow a centered ${renderer} chart after viewport resize`, async ({
		page
	}) => {
		await open(page, 'sankey', 'toast');
		const plan = await probes(page);
		const link = plan.points.find((p) => p.expected?.startsWith('link:') && p.x > 150)!;
		const node = plan.points.find((p) => p.expected === 'node:Trial')!;
		if (renderer === 'canvas') await open(page, 'sankey', 'toast', renderer);
		const surface = page.locator(`[data-testid="gallery-chart"] ${renderer}`);
		let box = (await surface.boundingBox())!;
		await page.mouse.move(box.x + link.x, box.y + link.y);
		await page.waitForTimeout(80);
		expect(await page.evaluate(() => (window as any).__galleryAudit.hover())).toBe(link.expected);
		await page.setViewportSize({ width: 1440, height: 800 });
		box = (await surface.boundingBox())!;
		await page.mouse.move(box.x + node.x, box.y + node.y);
		await page.waitForTimeout(80);
		expect(await page.evaluate(() => (window as any).__galleryAudit.hover())).toBe(node.expected);
	});
}

for (const family of ['sunburst', 'funnel']) {
	test(`${family}/toast: hover repaints the SVG outline and clears it on leave`, async ({
		page
	}) => {
		await open(page, family, 'toast');
		const point = (await probes(page)).points.find((p) => p.expected != null)!;
		const surface = page.locator('[data-testid="gallery-chart"] svg');
		const box = (await surface.boundingBox())!;
		const outlined = () =>
			page.evaluate(
				(id) =>
					(window as any).__galleryAudit
						.marks()
						.find((mark: any) => mark.id === id)
						.geometries.some(
							(shape: SVGGeometryElement) =>
								shape.getAttribute('stroke') === 'white' &&
								Number(shape.getAttribute('stroke-width')) >= 4
						),
				point.expected
			);
		expect(await outlined()).toBe(false);
		await page.mouse.move(box.x + point.x, box.y + point.y);
		await page.waitForTimeout(150);
		expect(await outlined()).toBe(true);
		await page.mouse.move(0, 0);
		await page.waitForTimeout(150);
		expect(await outlined()).toBe(false);
	});
}
