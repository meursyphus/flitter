import { test, expect, type Page } from '@playwright/test';

type Snapshot = {
	nodes: {
		id: string;
		position: { x: number; y: number };
		measured?: { width: number; height: number };
		selected: boolean;
	}[];
	edges: { id: string; source: string; target: string; selected: boolean }[];
	viewport: { x: number; y: number; zoom: number };
	events: string[];
};

const snapshot = (page: Page): Promise<Snapshot> =>
	page.evaluate(() => {
		const { controller, events } = (window as any).__diagram;
		return {
			nodes: controller.getNodes().map((n: any) => ({
				id: n.id,
				position: n.position,
				measured: n.measured,
				selected: !!n.selected
			})),
			edges: controller.getEdges().map((e: any) => ({
				id: e.id,
				source: e.source,
				target: e.target,
				selected: !!e.selected
			})),
			viewport: controller.getViewport(),
			events: [...events]
		};
	});

const nodeCenter = (page: Page, id: string) =>
	page.evaluate((nodeId) => {
		const { controller } = (window as any).__diagram;
		const rect = controller.getNodeRect(nodeId);
		return controller.flowToScreenPosition({
			x: rect.x + rect.width / 2,
			y: rect.y + rect.height / 2
		});
	}, id);

const nodeCorners = (page: Page, id: string) =>
	page.evaluate((nodeId) => {
		const { controller } = (window as any).__diagram;
		const rect = controller.getNodeRect(nodeId);
		return {
			a: controller.flowToScreenPosition({ x: rect.x, y: rect.y }),
			b: controller.flowToScreenPosition({ x: rect.x + rect.width, y: rect.y + rect.height })
		};
	}, id);

const handleCenter = (page: Page, id: string, type: 'source' | 'target') =>
	page.evaluate(
		([nodeId, handleType]) => {
			const { controller } = (window as any).__diagram;
			const handle = controller.getNodeHandles(nodeId).find((h: any) => h.type === handleType);
			return controller.flowToScreenPosition({ x: handle.x, y: handle.y });
		},
		[id, type] as const
	);

async function mount(page: Page, renderer: string, parameters = '') {
	await page.goto(`/interaction/diagram?renderer=${renderer}${parameters}`);
	await expect.poll(() => page.evaluate(() => !!(window as any).__diagram)).toBe(true);
	await expect
		.poll(async () => (await snapshot(page)).nodes.every((n) => n.measured != null))
		.toBe(true);
	const box = (await page.getByTestId('diagram').boundingBox())!;
	return box;
}

for (const renderer of ['svg', 'canvas']) {
	test(`${renderer}: fit view, drag, select, zoom and pan`, async ({ page }) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		const box = await mount(page, renderer);

		// fitView ran once every node was measured
		const initial = await snapshot(page);
		expect(initial.viewport.zoom).toBeGreaterThan(1);
		expect(initial.nodes[0].measured).toEqual({ width: 150, height: expect.any(Number) });

		// node drag: screen delta / zoom
		const c2 = await nodeCenter(page, '2');
		await page.mouse.move(c2.x, c2.y);
		await page.mouse.down();
		await page.mouse.move(c2.x + 30, c2.y + 20, { steps: 4 });
		await page.mouse.move(c2.x + 60, c2.y + 40, { steps: 4 });
		await page.mouse.up();
		const dragged = await snapshot(page);
		const moved = dragged.nodes.find((n) => n.id === '2')!;
		expect(moved.position.x).toBeCloseTo(100 + 60 / initial.viewport.zoom, 3);
		expect(moved.position.y).toBeCloseTo(180 + 40 / initial.viewport.zoom, 3);
		expect(moved.selected).toBe(true);
		expect(dragged.events).toContain('dragstop:2');
		expect(dragged.events).toContain('selection:2');

		// pane click clears the selection
		await page.mouse.click(box.x + 10, box.y + 10);
		expect((await snapshot(page)).nodes.some((n) => n.selected)).toBe(false);

		// wheel zoom follows d3-zoom's curve: 2 ** (100 * 0.002)
		await page.mouse.move(box.x + 10, box.y + 10);
		await page.mouse.wheel(0, -100);
		await expect
			.poll(async () => (await snapshot(page)).viewport.zoom)
			.toBeCloseTo(initial.viewport.zoom * Math.pow(2, 0.2), 5);

		// drag on the pane pans
		const before = (await snapshot(page)).viewport;
		await page.mouse.move(box.x + 10, box.y + 10);
		await page.mouse.down();
		await page.mouse.move(box.x + 60, box.y + 40, { steps: 5 });
		await page.mouse.up();
		const after = (await snapshot(page)).viewport;
		expect(after.x - before.x).toBeCloseTo(50, 3);
		expect(after.y - before.y).toBeCloseTo(30, 3);
		expect((await snapshot(page)).nodes.some((n) => n.selected)).toBe(false);
		expect(errors).toEqual([]);
	});

	test(`${renderer}: box selection, connection and keyboard delete`, async ({ page }) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await mount(page, renderer);

		// shift + drag selects nodes fully inside the rectangle
		const r1 = await nodeCorners(page, '1');
		await page.keyboard.down('Shift');
		await page.waitForTimeout(100);
		await page.mouse.move(r1.a.x - 15, r1.a.y - 15);
		await page.mouse.down();
		await page.mouse.move(r1.b.x + 15, r1.b.y + 15, { steps: 6 });
		await page.mouse.up();
		await page.keyboard.up('Shift');
		expect((await snapshot(page)).nodes.map((n) => `${n.id}:${n.selected}`)).toEqual([
			'1:true',
			'2:false',
			'3:false'
		]);

		// drag from node 2's source handle onto node 3's target handle
		const from = await handleCenter(page, '2', 'source');
		const to = await handleCenter(page, '3', 'target');
		await page.mouse.move(from.x, from.y);
		await page.mouse.down();
		await page.mouse.move((from.x + to.x) / 2, (from.y + to.y) / 2, { steps: 4 });
		await page.mouse.move(to.x, to.y, { steps: 4 });
		await page.mouse.up();
		const connected = await snapshot(page);
		expect(connected.edges.map((e) => e.id)).toEqual(['e1-2', 'e1-3', 'xy-edge__2-3']);
		expect(connected.events).toContain('connect:2->3');
		// let the frame that builds the new edge render before hit testing it
		await page.evaluate(
			() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
		);

		// click the new edge at its label anchor and delete it
		const mid = await page.evaluate(() => {
			const { controller } = (window as any).__diagram;
			const edge = controller.getEdge('xy-edge__2-3');
			const path = controller.getEdgePath(edge, controller.getEdgeEndpoints(edge));
			return controller.flowToScreenPosition({ x: path.labelX, y: path.labelY });
		});
		await page.mouse.click(mid.x, mid.y);
		expect((await snapshot(page)).edges.find((e) => e.id === 'xy-edge__2-3')!.selected).toBe(true);
		await page.keyboard.press('Backspace');
		await expect.poll(async () => (await snapshot(page)).edges.length).toBe(2);

		// deleting a node removes its edges
		const c1 = await nodeCenter(page, '1');
		await page.mouse.click(c1.x, c1.y);
		await page.keyboard.press('Delete');
		const final = await snapshot(page);
		expect(final.nodes.map((n) => n.id)).toEqual(['2', '3']);
		expect(final.edges).toEqual([]);
		expect(final.events).toContain('delete:1/2');
		expect(errors).toEqual([]);
	});

	test(`${renderer}: content beyond the untransformed viewport survives zooming out`, async ({
		page
	}) => {
		test.skip(renderer !== 'canvas', 'pixel check for the canvas picture-recording bounds');
		await mount(page, renderer);
		// Push node 3 far to the right: in flow coordinates the edge to it now runs
		// past the pane width, which a picture sized to the pane would cull.
		await page.evaluate(() => {
			const { controller } = (window as any).__diagram;
			controller.updateNode('3', { position: { x: 900, y: 180 } });
			void controller.setViewport({ x: 20, y: 20, zoom: 0.5 });
		});
		await page.evaluate(
			() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
		);
		const samples: { x: number; y: number }[] = await page.evaluate(() => {
			const { controller } = (window as any).__diagram;
			const edge = controller.getEdge('e1-3');
			const path = controller.getEdgePath(edge, controller.getEdgeEndpoints(edge));
			const points = path.points.filter((p: { x: number }) => p.x > 700 && p.x < 900);
			const picked = [0.2, 0.5, 0.8].map((t) => points[Math.floor(t * (points.length - 1))]);
			return picked.map((p: { x: number; y: number }) => controller.flowToScreenPosition(p));
		});
		const nonBackground = await page.evaluate((points) => {
			const canvas = document.querySelector('canvas') as HTMLCanvasElement;
			const rect = canvas.getBoundingClientRect();
			const dpr = window.devicePixelRatio;
			const ctx = canvas.getContext('2d')!;
			return points.filter(({ x, y }) => {
				const px = Math.round((x - rect.left) * dpr);
				const py = Math.round((y - rect.top) * dpr);
				// the stroke is thin at 0.5x, so look at a 3x3 neighbourhood
				const data = ctx.getImageData(px - 1, py - 1, 3, 3).data;
				for (let i = 0; i < data.length; i += 4) {
					if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) return true;
				}
				return false;
			}).length;
		}, samples);
		expect(nonBackground).toBeGreaterThanOrEqual(2);
	});

	test(`${renderer}: hover rebuilds only the hovered node and its neighbours`, async ({ page }) => {
		await mount(page, renderer);
		const before = await page.evaluate(() => ({ ...(window as any).__diagram.builds }));
		const c2 = await nodeCenter(page, '2');
		await page.mouse.move(c2.x, c2.y);
		await page.evaluate(
			() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
		);
		const after = await page.evaluate(() => ({ ...(window as any).__diagram.builds }));
		expect(after['2']).toBeGreaterThan(before['2']);
		expect(after['1']).toBeGreaterThan(before['1']);
		expect(after['3']).toBe(before['3']);
	});

	test(`${renderer}: dragging one node rebuilds only that node`, async ({ page }) => {
		const box = await mount(page, renderer);
		const builds = () => page.evaluate(() => ({ ...(window as any).__diagram.builds }));
		const settle = () =>
			page.evaluate(
				() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
			);
		const c2 = await nodeCenter(page, '2');
		// Hover/selection changes neighbour args once. Measure drag ticks after those transitions.
		await page.mouse.click(c2.x, c2.y);
		await settle();
		const before = await builds();
		await page.mouse.down();
		for (let i = 1; i <= 10; i++) await page.mouse.move(c2.x + i * 6, c2.y + i * 4);
		await page.mouse.up();
		await settle();
		const after = await builds();
		// the dragged node rebuilds (selection, dragging flag, positions)...
		expect(after['2']).toBeGreaterThan(before['2']);
		// ...while untouched nodes do not rebuild at all
		expect(after['1']).toBe(before['1']);
		expect(after['3']).toBe(before['3']);
		// park the pointer on empty pane (leaving node 2 ends its hover), then zoom:
		// a viewport change must not rebuild any node body
		await page.mouse.move(box.x + 10, box.y + 10);
		await settle();
		const parked = await builds();
		await page.mouse.wheel(0, -100);
		await settle();
		await page.mouse.wheel(0, 100);
		await settle();
		expect(await builds()).toEqual(parked);
	});

	test(`${renderer}: reconnecting an edge endpoint moves it to another handle`, async ({
		page
	}) => {
		await mount(page, renderer);
		// e1-3 runs from node 1 (source, bottom) to node 3 (target, top); drag its target end onto node 2's target handle.
		// The grab area is a 20px ring around the endpoint; start just outside node 3's 6px handle.
		const targetEnd = await page.evaluate(() => {
			const { controller } = (window as any).__diagram;
			const ep = controller.getEdgeEndpoints(controller.getEdge('e1-3'));
			return controller.flowToScreenPosition({ x: ep.targetX, y: ep.targetY });
		});
		const newTarget = await handleCenter(page, '2', 'target');
		await page.mouse.move(targetEnd.x + 8, targetEnd.y - 6);
		await page.mouse.down();
		await page.mouse.move((targetEnd.x + newTarget.x) / 2, (targetEnd.y + newTarget.y) / 2, {
			steps: 4
		});
		expect((await snapshot(page)).events).toContain('selection:');
		const midState = await page.evaluate(() => {
			const { controller } = (window as any).__diagram;
			return controller.connection?.reconnectingEdge?.id ?? null;
		});
		expect(midState).toBe('e1-3');
		await page.mouse.move(newTarget.x, newTarget.y, { steps: 4 });
		await page.mouse.up();
		const after = await snapshot(page);
		expect(after.events).toContain('reconnect:e1-3->1-2');
		expect(after.edges.map((e) => `${e.source}->${e.target}`).sort()).toEqual(['1->2', '1->2']);
	});

	test(`${renderer}: resizing a selected node from its corner and a node toolbar`, async ({
		page
	}) => {
		await mount(page, renderer);
		const c2 = await nodeCenter(page, '2');
		await page.mouse.click(c2.x, c2.y);
		await page.evaluate(
			() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
		);
		const before = (await snapshot(page)).nodes.find((n) => n.id === '2')!;
		expect(before.selected).toBe(true);
		// bottom-right corner handle sits on the node corner
		const corner = await page.evaluate(() => {
			const { controller } = (window as any).__diagram;
			const r = controller.getNodeRect('2');
			return controller.flowToScreenPosition({ x: r.x + r.width, y: r.y + r.height });
		});
		const zoom = (await snapshot(page)).viewport.zoom;
		await page.mouse.move(corner.x, corner.y);
		await page.mouse.down();
		await page.mouse.move(corner.x + 20, corner.y + 10, { steps: 3 });
		await page.mouse.move(corner.x + 40, corner.y + 20, { steps: 3 });
		await page.mouse.up();
		const resized = await snapshot(page);
		const node = resized.nodes.find((n) => n.id === '2')! as any;
		expect(node.measured.width).toBeCloseTo(before.measured!.width + 40 / zoom, 3);
		expect(node.measured.height).toBeCloseTo(before.measured!.height + 20 / zoom, 3);
		expect(node.position).toEqual(before.position);
		expect(resized.events.some((e) => e.startsWith('resize:2:'))).toBe(true);

		// the toolbar for the single selected node is rendered above it in screen space; clicking it must not deselect
		const top = await page.evaluate(() => {
			const { controller } = (window as any).__diagram;
			const r = controller.getNodeRect('2');
			return controller.flowToScreenPosition({ x: r.x + r.width / 2, y: r.y });
		});
		await page.mouse.click(top.x, top.y - 10 - 8);
		const clicked = await snapshot(page);
		expect(await page.evaluate(() => (window as any).__diagram.toolbarClicks())).toBe(1);
		expect(clicked.nodes.find((n) => n.id === '2')!.selected).toBe(true);
	});

	test(`${renderer}: translateExtent keeps the viewport inside the allowed region`, async ({
		page
	}) => {
		const box = await mount(page, renderer, '&extent');
		await page.evaluate(() =>
			(window as any).__diagram.controller.setViewport({ x: 0, y: 0, zoom: 1 })
		);
		await page.mouse.move(box.x + 10, box.y + 10);
		await page.mouse.down();
		await page.mouse.move(box.x + 200, box.y + 150, { steps: 6 });
		await page.mouse.up();
		// dragging right/down would reveal negative coordinates: clamped to the extent origin
		expect((await snapshot(page)).viewport).toEqual({ x: 0, y: 0, zoom: 1 });
		await page.evaluate(() =>
			(window as any).__diagram.controller.setViewport({ x: -5000, y: -5000, zoom: 1 })
		);
		const far = (await snapshot(page)).viewport;
		expect(far.x).toBeCloseTo(560 - 800, 3);
		expect(far.y).toBeCloseTo(400 - 600, 3);
	});

	test(`${renderer}: touch tap, one-finger drag and two-finger pinch`, async ({ page }) => {
		await mount(page, renderer);
		const cdp = await page.context().newCDPSession(page);
		type Point = { x: number; y: number };
		const touch = async (type: 'touchStart' | 'touchMove' | 'touchEnd', points: Point[]) =>
			cdp.send('Input.dispatchTouchEvent', {
				type,
				touchPoints: points.map((p, id) => ({ x: p.x, y: p.y, id }))
			});
		const settle = () =>
			page.evaluate(
				() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
			);

		// tap selects the node (synthesised click)
		const c2 = await nodeCenter(page, '2');
		await touch('touchStart', [c2]);
		await touch('touchEnd', []);
		await settle();
		expect((await snapshot(page)).nodes.find((n) => n.id === '2')!.selected).toBe(true);

		// one-finger drag moves it (threshold then movement, in flow units)
		const before = (await snapshot(page)).nodes.find((n) => n.id === '2')!.position;
		const zoom = (await snapshot(page)).viewport.zoom;
		await touch('touchStart', [c2]);
		for (let i = 1; i <= 5; i++) await touch('touchMove', [{ x: c2.x + i * 10, y: c2.y + i * 6 }]);
		await touch('touchEnd', []);
		await settle();
		const after = (await snapshot(page)).nodes.find((n) => n.id === '2')!;
		expect(after.position.x).toBeCloseTo(before.x + 50 / zoom, 3);
		expect(after.position.y).toBeCloseTo(before.y + 30 / zoom, 3);
		expect(after.selected).toBe(true);

		// two-finger pinch (in) on the pane zooms out around the midpoint: 80px -> 40px span halves the zoom
		const box = (await page.getByTestId('diagram').boundingBox())!;
		// Chrome rounds synthetic touch coordinates: keep the midpoint on whole pixels
		const mid = { x: Math.round(box.x + 40), y: Math.round(box.y + 40) };
		const vpBefore = (await snapshot(page)).viewport;
		await touch('touchStart', [
			{ x: mid.x - 40, y: mid.y },
			{ x: mid.x + 40, y: mid.y }
		]);
		await touch('touchMove', [
			{ x: mid.x - 30, y: mid.y },
			{ x: mid.x + 30, y: mid.y }
		]);
		await touch('touchMove', [
			{ x: mid.x - 20, y: mid.y },
			{ x: mid.x + 20, y: mid.y }
		]);
		await touch('touchEnd', []);
		await settle();
		const vpAfter = (await snapshot(page)).viewport;
		expect(vpAfter.zoom).toBeCloseTo(Math.max(0.5, vpBefore.zoom / 2), 3);
		// the midpoint stays fixed: the flow point under it is unchanged
		const flowBefore = {
			x: (mid.x - box.x - vpBefore.x) / vpBefore.zoom,
			y: (mid.y - box.y - vpBefore.y) / vpBefore.zoom
		};
		const flowAfter = {
			x: (mid.x - box.x - vpAfter.x) / vpAfter.zoom,
			y: (mid.y - box.y - vpAfter.y) / vpAfter.zoom
		};
		expect(flowAfter.x).toBeCloseTo(flowBefore.x, 3);
		expect(flowAfter.y).toBeCloseTo(flowBefore.y, 3);
	});

	test(`${renderer}: pan on scroll and snap to grid`, async ({ page }) => {
		const box = await mount(page, renderer, '&panOnScroll&snap');
		const before = (await snapshot(page)).viewport;
		await page.mouse.move(box.x + 10, box.y + 10);
		await page.mouse.wheel(0, 100);
		await expect.poll(async () => (await snapshot(page)).viewport.y).toBeCloseTo(before.y - 50, 3);
		expect((await snapshot(page)).viewport.zoom).toBe(before.zoom);

		const c2 = await nodeCenter(page, '2');
		await page.mouse.move(c2.x, c2.y);
		await page.mouse.down();
		await page.mouse.move(c2.x + 23, c2.y + 11, { steps: 3 });
		await page.mouse.up();
		const node = (await snapshot(page)).nodes.find((n) => n.id === '2')!;
		expect(node.position.x % 15).toBe(0);
		expect(node.position.y % 15).toBe(0);
	});
}

test('touch is captured only over widgets that take drag gestures', async ({ page }) => {
	const cdp = await page.context().newCDPSession(page);
	const touch = (type: 'touchStart' | 'touchEnd', points: { x: number; y: number }[]) =>
		cdp.send('Input.dispatchTouchEvent', {
			type,
			touchPoints: points.map((p, id) => ({ x: p.x, y: p.y, id }))
		});
	const prevented = () => page.evaluate(() => (window as any).__touchPrevented);
	const arm = () =>
		page.evaluate(() => {
			(window as any).__touchPrevented = null;
			window.addEventListener(
				'touchstart',
				(e) => ((window as any).__touchPrevented = e.defaultPrevented),
				{ once: true }
			);
		});

	// the engine grid only has click/hover handlers: the page keeps scrolling and pinch-zooming
	await page.goto('/performance/engine?renderer=svg&scenario=identity');
	await expect.poll(() => page.evaluate(() => !!(window as any).__engineBench)).toBe(true);
	const grid = (await page.getByTestId('engine').boundingBox())!;
	const cell = { x: grid.x + 50, y: grid.y + 36 };
	await arm();
	await touch('touchStart', [cell]);
	await touch('touchEnd', []);
	expect(await prevented()).toBe(false);
	await arm();
	await touch('touchStart', [cell, { x: cell.x + 40, y: cell.y }]);
	await touch('touchEnd', []);
	expect(await prevented()).toBe(false);

	// the diagram pane pans and zooms: one or two fingers on it are captured
	const box = await mount(page, 'svg');
	const pane = { x: box.x + 10, y: box.y + 10 };
	await arm();
	await touch('touchStart', [pane]);
	await touch('touchEnd', []);
	expect(await prevented()).toBe(true);
	await arm();
	await touch('touchStart', [pane, { x: pane.x + 40, y: pane.y }]);
	await touch('touchEnd', []);
	expect(await prevented()).toBe(true);
});

const settleDiagram = (page: Page) =>
	page.evaluate(
		() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
	);
const modifier = (page: Page) =>
	page.evaluate(() => (/Mac/.test(navigator.platform) ? 'Meta' : 'Control'));
const flowPoint = (page: Page, x: number, y: number) =>
	page.evaluate(({ x, y }) => (window as any).__diagram.controller.flowToScreenPosition({ x, y }), {
		x,
		y
	});
async function dragPointer(
	page: Page,
	from: { x: number; y: number },
	to: { x: number; y: number },
	touch = false
) {
	if (touch) {
		const cdp = await page.context().newCDPSession(page);
		const send = (
			type: 'touchStart' | 'touchMove' | 'touchEnd',
			point?: { x: number; y: number }
		) =>
			cdp.send('Input.dispatchTouchEvent', {
				type,
				touchPoints: point ? [{ ...point, id: 0 }] : []
			});
		await send('touchStart', from);
		for (let i = 1; i <= 6; i++)
			await send('touchMove', {
				x: from.x + ((to.x - from.x) * i) / 6,
				y: from.y + ((to.y - from.y) * i) / 6
			});
		await send('touchEnd');
		await cdp.detach();
	} else {
		await page.mouse.move(from.x, from.y);
		await page.mouse.down();
		await page.mouse.move(to.x, to.y, { steps: 6 });
		await page.mouse.up();
	}
	await settleDiagram(page);
}

for (const renderer of ['svg', 'canvas']) {
	test(`${renderer}: viewer click selection works but box selection and drag are disabled`, async ({
		page
	}) => {
		const box = await mount(page, renderer, '&scenario=basic&viewer');
		const center = await nodeCenter(page, '1');
		await page.mouse.click(center.x, center.y);
		expect((await snapshot(page)).nodes.find((n) => n.id === '1')?.selected).toBe(true);
		await dragPointer(page, center, { x: center.x + 60, y: center.y + 20 });
		expect((await snapshot(page)).nodes.find((n) => n.id === '1')?.position).toEqual({
			x: 30,
			y: 70
		});
		const beforePan = (await snapshot(page)).viewport;
		await page.keyboard.down('Shift');
		await dragPointer(page, { x: box.x + 5, y: box.y + 5 }, { x: box.x + 400, y: box.y + 350 });
		await page.keyboard.up('Shift');
		expect((await snapshot(page)).nodes.filter((n) => n.selected).map((n) => n.id)).toEqual(['1']);
		expect((await snapshot(page)).viewport.x).toBeGreaterThan(beforePan.x);
		expect((await snapshot(page)).viewport.y).toBeGreaterThan(beforePan.y);
		await page.mouse.click(box.x + 5, box.y + 5);
		expect((await snapshot(page)).nodes.filter((n) => n.selected)).toHaveLength(0);
	});

	test(`${renderer}: LOD rebuilds only opted-in nodes when a breakpoint is crossed`, async ({
		page
	}) => {
		await mount(page, renderer, '&scenario=lod');
		const before = await page.evaluate(() => ({ ...(window as any).__diagram.builds }));
		await page.evaluate(() => (window as any).__diagram.controller.zoomTo(1.1));
		await settleDiagram(page);
		expect(await page.evaluate(() => ({ ...(window as any).__diagram.builds }))).toEqual(before);
		await page.evaluate(() => (window as any).__diagram.controller.zoomTo(1.3));
		await settleDiagram(page);
		const after = await page.evaluate(() => ({ ...(window as any).__diagram.builds }));
		expect(after['1']).toBeGreaterThan(before['1']);
		expect(after['3']).toBe(before['3']);
	});

	test(`${renderer}: context menus target node, selection, edge and pane and execute Duplicate`, async ({
		page
	}) => {
		const box = await mount(page, renderer, '&scenario=basic');
		const c1 = await nodeCenter(page, '1');
		await page.mouse.click(c1.x, c1.y, { button: 'right' });
		expect(await page.evaluate(() => (window as any).__diagram.controller.contextMenu.target)).toBe(
			'node'
		);
		// Controller state changes before the frame that lays out the menu's hit regions.
		await settleDiagram(page);
		await page.evaluate(() => {
			const state = (window as any).__diagram;
			state.duplicateCalls = 0;
			const duplicate = state.controller.duplicate.bind(state.controller);
			state.controller.duplicate = (...args: unknown[]) => {
				state.duplicateCalls++;
				return duplicate(...args);
			};
		});
		const menu = await page.evaluate(
			() => (window as any).__diagram.controller.contextMenu.screenPosition
		);
		await page.mouse.click(menu.x + 50, menu.y + 15);
		expect(await page.evaluate(() => (window as any).__diagram.duplicateCalls)).toBe(1);
		expect((await snapshot(page)).nodes).toHaveLength(4);
		await page.evaluate(() => (window as any).__diagram.controller.selectNodes(['1', '2']));
		await settleDiagram(page); // remove the old menu and repaint selection above the duplicate
		await page.mouse.click(c1.x, c1.y, { button: 'right' });
		expect(await page.evaluate(() => (window as any).__diagram.controller.contextMenu.ids)).toEqual(
			['1', '2']
		);
		await page.keyboard.press('Escape');
		await settleDiagram(page);
		const edge = await flowPoint(page, 190, 110);
		await page.mouse.click(edge.x, edge.y, { button: 'right' });
		expect(await page.evaluate(() => (window as any).__diagram.controller.contextMenu.target)).toBe(
			'edge'
		);
		await page.keyboard.press('Escape');
		await settleDiagram(page);
		await page.mouse.click(box.x + 10, box.y + 10, { button: 'right' });
		expect(await page.evaluate(() => (window as any).__diagram.controller.contextMenu.target)).toBe(
			'pane'
		);
		await settleDiagram(page);
		await page.mouse.click(box.x + 530, box.y + 380);
		expect(await page.evaluate(() => (window as any).__diagram.controller.contextMenu)).toBeNull();
	});

	test(`${renderer}: touch long-press opens the same context menu`, async ({ page }) => {
		await mount(page, renderer, '&scenario=basic');
		const point = await nodeCenter(page, '1'),
			cdp = await page.context().newCDPSession(page);
		await cdp.send('Input.dispatchTouchEvent', {
			type: 'touchStart',
			touchPoints: [{ ...point, id: 0 }]
		});
		await expect
			.poll(() => page.evaluate(() => (window as any).__diagram.controller.contextMenu?.target))
			.toBe('node');
		await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
		expect(
			await page.evaluate(() => (window as any).__diagram.controller.contextMenu?.target)
		).toBe('node');
		await cdp.detach();
	});

	test(`${renderer}: a drag is one undo/redo transaction and Escape cancels movement`, async ({
		page
	}) => {
		await mount(page, renderer, '&scenario=basic');
		const c = await nodeCenter(page, '1');
		await dragPointer(page, c, { x: c.x + 50, y: c.y + 20 });
		const moved = (await snapshot(page)).nodes[0].position;
		const mod = await modifier(page);
		await page.keyboard.press(`${mod}+z`);
		expect((await snapshot(page)).nodes[0].position).toEqual({ x: 30, y: 70 });
		await page.keyboard.press(`${mod}+Shift+z`);
		expect((await snapshot(page)).nodes[0].position).toEqual(moved);
		const start = await nodeCenter(page, '1');
		await page.mouse.move(start.x, start.y);
		await page.mouse.down();
		await page.mouse.move(start.x + 30, start.y + 10);
		await page.keyboard.press('Escape');
		await page.mouse.up();
		expect((await snapshot(page)).nodes[0].position).toEqual(moved);
	});

	test(`${renderer}: copy paste and duplicate remap a selected subgraph`, async ({ page }) => {
		const box = await mount(page, renderer, '&scenario=basic');
		const mod = await modifier(page);
		await page.evaluate(() => (window as any).__diagram.controller.selectNodes(['1', '2']));
		await page.keyboard.press(`${mod}+c`);
		await page.mouse.move(box.x + 100, box.y + 300);
		await page.keyboard.press(`${mod}+v`);
		await expect.poll(async () => (await snapshot(page)).nodes.length).toBe(5);
		expect((await snapshot(page)).edges).toHaveLength(3);
		await page.keyboard.press(`${mod}+d`);
		expect((await snapshot(page)).nodes).toHaveLength(7);
		await page.keyboard.press(`${mod}+z`);
		expect((await snapshot(page)).nodes).toHaveLength(5);
	});

	test(`${renderer}: keyboard select-all, nudge, zoom, fit and Escape use configured bindings`, async ({
		page
	}) => {
		await mount(page, renderer, '&scenario=basic');
		const mod = await modifier(page);
		await page.keyboard.press(`${mod}+a`);
		expect((await snapshot(page)).nodes.filter((n) => n.selected)).toHaveLength(3);
		await page.keyboard.press('Shift+ArrowRight');
		expect((await snapshot(page)).nodes[0].position.x).toBe(40);
		await page.keyboard.press('Equal');
		expect((await snapshot(page)).viewport.zoom).toBeCloseTo(1.2);
		await page.keyboard.press('Minus');
		expect((await snapshot(page)).viewport.zoom).toBeCloseTo(1);
		await page.keyboard.press('Shift+Digit1');
		await expect.poll(async () => (await snapshot(page)).viewport.zoom).toBeGreaterThan(1);
		await page.keyboard.press('Escape');
		expect((await snapshot(page)).nodes.filter((n) => n.selected)).toHaveLength(0);
	});

	for (const touch of [false, true])
		test(`${renderer}: ${touch ? 'touch' : 'mouse'} drag into a group preserves coordinates and undo`, async ({
			page
		}) => {
			await mount(page, renderer, '&scenario=groups');
			const center = await nodeCenter(page, '1'),
				target = await flowPoint(page, 350, 160);
			await dragPointer(page, center, target, touch);
			expect(
				await page.evaluate(() => (window as any).__diagram.controller.getNode('1').parentId)
			).toBe('group');
			await page.evaluate(() => (window as any).__diagram.controller.history.undo());
			expect(
				await page.evaluate(() => (window as any).__diagram.controller.getNode('1').parentId)
			).toBeUndefined();
		});

	test(`${renderer}: inline text edits commit, cancel and undo through the core input`, async ({
		page
	}) => {
		await mount(page, renderer, '&scenario=basic&text');
		const center = await nodeCenter(page, '1'),
			mod = await modifier(page);
		await page.mouse.dblclick(center.x, center.y);
		const input = page.getByRole('textbox', { name: 'Edit 1' });
		await expect(input).toBeFocused();
		await page.keyboard.press(`${mod}+a`);
		await page.keyboard.type('Renamed');
		await expect(input).toHaveValue('Renamed');
		await page.keyboard.press('Enter');
		await expect(input).toHaveCount(0);
		expect(await page.evaluate(() => (window as any).__diagram.controller.editingId)).toBeNull();
		expect(
			await page.evaluate(() => (window as any).__diagram.controller.getNode('1').data.label)
		).toBe('Renamed');
		await page.mouse.dblclick(center.x, center.y);
		await expect(input).toBeFocused();
		await page.keyboard.press(`${mod}+a`);
		await page.keyboard.type('Cancel me');
		await expect(input).toHaveValue('Cancel me');
		await page.keyboard.press('Escape');
		await expect(input).toHaveCount(0);
		expect(await page.evaluate(() => (window as any).__diagram.controller.editingId)).toBeNull();
		expect(
			await page.evaluate(() => (window as any).__diagram.controller.getNode('1').data.label)
		).toBe('Renamed');
		await page.keyboard.press(`${mod}+z`);
		expect(
			await page.evaluate(() => (window as any).__diagram.controller.getNode('1').data.label)
		).toBe('Start');
		expect(await page.evaluate(() => (window as any).__diagram.controller.history.canUndo)).toBe(
			false
		);
	});

	test(`${renderer}: alignment guides snap a drag and clear on drop`, async ({ page }) => {
		await mount(page, renderer, '&scenario=guides');
		const c = await nodeCenter(page, '1');
		await page.mouse.move(c.x, c.y);
		await page.mouse.down();
		await page.mouse.move(c.x + 217, c.y + 90, { steps: 5 });
		expect(
			await page.evaluate(() => (window as any).__diagram.controller.guides.length)
		).toBeGreaterThan(0);
		expect((await snapshot(page)).nodes[0].position.x).toBe(250);
		await page.mouse.up();
		expect(await page.evaluate(() => (window as any).__diagram.controller.guides)).toEqual([]);
	});

	for (const touch of [false, true])
		test(`${renderer}: ${touch ? 'touch' : 'mouse'} midpoint drag inserts a waypoint and undo removes it`, async ({
			page
		}) => {
			await mount(page, renderer, '&scenario=waypoints');
			const mid = await flowPoint(page, 190, 110),
				target = await flowPoint(page, 190, 220);
			await dragPointer(page, mid, target, touch);
			expect(
				await page.evaluate(() => (window as any).__diagram.controller.getEdge('e1-2').waypoints)
			).toEqual([{ x: 190, y: 220 }]);
			await page.evaluate(() => (window as any).__diagram.controller.history.undo());
			expect(
				await page.evaluate(() => (window as any).__diagram.controller.getEdge('e1-2').waypoints)
			).toBeUndefined();
		});

	test(`${renderer}: waypoint pin double-click removes the bend`, async ({ page }) => {
		await mount(page, renderer, '&scenario=waypoints');
		await page.evaluate(() =>
			(window as any).__diagram.controller.insertWaypoint('e1-2', 0, { x: 180, y: 220 })
		);
		await settleDiagram(page);
		const point = await flowPoint(page, 180, 220);
		await page.mouse.dblclick(point.x, point.y);
		expect(
			await page.evaluate(() => (window as any).__diagram.controller.getEdge('e1-2').waypoints)
		).toEqual([]);
	});

	for (const policy of ['push', 'reject'])
		test(`${renderer}: overlap ${policy} resolves only when the drag ends`, async ({ page }) => {
			await mount(page, renderer, `&scenario=basic&overlap=${policy}`);
			const a = await nodeCenter(page, '1'),
				b = await nodeCenter(page, '2');
			await page.mouse.move(a.x, a.y);
			await page.mouse.down();
			await page.mouse.move(b.x, b.y, { steps: 5 });
			expect((await snapshot(page)).nodes[0].position.x).toBeCloseTo(250);
			await page.mouse.up();
			if (policy === 'reject')
				expect((await snapshot(page)).nodes[0].position).toEqual({ x: 30, y: 70 });
			else
				expect(
					await page.evaluate(() => {
						const f = (window as any).__diagram.controller;
						return f.getIntersectingNodes(f.getNode('1')).length;
					})
				).toBe(0);
		});

	test(`${renderer}: collapse hides a subtree and expansion restores it`, async ({ page }) => {
		await mount(page, renderer, '&scenario=basic');
		expect((await snapshot(page)).edges.map((e) => [e.source, e.target])).toEqual([
			['1', '2'],
			['2', '3']
		]);
		await page.evaluate(() => (window as any).__diagram.controller.collapse('1'));
		await settleDiagram(page);
		expect(
			await page.evaluate(() =>
				(window as any).__diagram.controller.getVisibleNodes().map((n: any) => n.id)
			)
		).toEqual(['1']);
		expect(
			await page.evaluate(() => (window as any).__diagram.nodeState['1'].hiddenChildCount)
		).toBe(2);
		expect(
			await page.evaluate(() => (window as any).__diagram.controller.getVisibleEdges())
		).toEqual([]);
		await page.evaluate(() => (window as any).__diagram.controller.expand('1'));
		expect(
			await page.evaluate(() => (window as any).__diagram.controller.getVisibleNodes().length)
		).toBe(3);
	});

	test(`${renderer}: insertion and delete-with-reconnect preserve the graph and history`, async ({
		page
	}) => {
		await mount(page, renderer, '&scenario=basic');
		await page.evaluate(() =>
			(window as any).__diagram.controller.insertNodeOnEdge('e1-2', {
				id: 'new',
				position: { x: 150, y: 200 },
				data: { label: 'New' }
			})
		);
		expect((await snapshot(page)).nodes).toHaveLength(4);
		expect((await snapshot(page)).edges).toHaveLength(3);
		await page.evaluate(() =>
			(window as any).__diagram.controller.deleteElements(['new'], { reconnect: true })
		);
		expect((await snapshot(page)).edges.some((e) => e.source === '1' && e.target === '2')).toBe(
			true
		);
		await page.evaluate(() => (window as any).__diagram.controller.history.undo());
		expect((await snapshot(page)).nodes).toHaveLength(4);
	});

	test(`${renderer}: align and distribute arrange the selected nodes`, async ({ page }) => {
		await mount(page, renderer, '&scenario=basic');
		await page.evaluate(() => {
			const f = (window as any).__diagram.controller;
			f.alignNodes(['1', '2', '3'], 'top');
			f.distributeNodes(['1', '2', '3'], 'x');
		});
		const positions = (await snapshot(page)).nodes.map((n) => n.position);
		expect(positions.map((p) => p.y)).toEqual([70, 70, 70]);
		expect(positions.map((p) => p.x)).toEqual([30, 140, 250]);
	});

	test(`${renderer}: beforeDelete veto leaves the selected graph intact`, async ({ page }) => {
		await mount(page, renderer, '&scenario=basic&vetoDelete');
		const c = await nodeCenter(page, '1');
		await page.mouse.click(c.x, c.y);
		await page.keyboard.press('Delete');
		expect((await snapshot(page)).nodes).toHaveLength(3);
		expect((await snapshot(page)).edges).toHaveLength(2);
	});

	test(`${renderer}: empty-pane connection drop reports flow coordinates`, async ({ page }) => {
		await mount(page, renderer, '&scenario=basic');
		const from = await handleCenter(page, '1', 'source'),
			to = await flowPoint(page, 150, 280);
		await dragPointer(page, from, to);
		expect((await snapshot(page)).events).toContain('drop:150,280');
	});

	test(`${renderer}: selection rectangle drags the selected nodes together`, async ({ page }) => {
		await mount(page, renderer, '&scenario=basic');
		await page.evaluate(() => (window as any).__diagram.controller.selectNodes(['1', '2', '3']));
		await settleDiagram(page);
		const start = await flowPoint(page, 180, 200);
		await dragPointer(page, start, { x: start.x + 30, y: start.y + 20 });
		expect((await snapshot(page)).nodes.map((n) => n.position)).toEqual([
			{ x: 60, y: 90 },
			{ x: 280, y: 120 },
			{ x: 280, y: 280 }
		]);
	});

	test(`${renderer}: node drag near the pane edge auto-pans`, async ({ page }) => {
		const box = await mount(page, renderer, '&scenario=basic'),
			c = await nodeCenter(page, '1');
		await page.mouse.move(c.x, c.y);
		await page.mouse.down();
		await page.mouse.move(box.x + box.width - 3, c.y, { steps: 5 });
		await expect.poll(async () => (await snapshot(page)).viewport.x).toBeLessThan(0);
		await page.mouse.up();
	});

	test(`${renderer}: click-to-connect creates an edge from two handles`, async ({ page }) => {
		await mount(page, renderer, '&scenario=basic');
		const source = await handleCenter(page, '1', 'source'),
			target = await handleCenter(page, '3', 'target');
		await page.mouse.click(source.x, source.y);
		await page.mouse.click(target.x, target.y);
		expect((await snapshot(page)).edges.some((e) => e.source === '1' && e.target === '3')).toBe(
			true
		);
	});
}

for (const renderer of ['svg', 'canvas']) {
	test(`${renderer}: automatic layout runs on mount and command with undo`, async ({ page }) => {
		await mount(page, renderer, '&scenario=layout');
		await expect.poll(async () => (await snapshot(page)).nodes[0].position.y).toBe(0);
		await page.evaluate(() => {
			const f = (window as any).__diagram.controller;
			f.updateNode('2', { position: { x: 400, y: 100 } });
			return f.layout();
		});
		expect((await snapshot(page)).nodes[1].position.x).toBe(0);
		await page.evaluate(() => (window as any).__diagram.controller.history.undo());
		expect((await snapshot(page)).nodes[1].position.x).toBe(400);
	});

	test(`${renderer}: guide snapping applies to a resize tick`, async ({ page }) => {
		await mount(page, renderer, '&scenario=guides');
		await page.evaluate(() => {
			const f = (window as any).__diagram.controller;
			f.updateNode('1', { resizable: true });
			f.selectNodes(['1']);
		});
		await settleDiagram(page);
		const corners = await nodeCorners(page, '1');
		await page.mouse.move(corners.b.x, corners.b.y);
		await page.mouse.down();
		await page.mouse.move(corners.b.x + 117, corners.b.y + 30, { steps: 5 });
		expect(
			await page.evaluate(() => (window as any).__diagram.controller.guides.length)
		).toBeGreaterThan(0);
		expect(await page.evaluate(() => (window as any).__diagram.controller.getNode('1').width)).toBe(
			220
		);
		await page.mouse.up();
		expect(await page.evaluate(() => (window as any).__diagram.controller.guides)).toEqual([]);
	});

	test(`${renderer}: a cancelled touch drag restores its starting position`, async ({ page }) => {
		await mount(page, renderer, '&scenario=basic');
		const cdp = await page.context().newCDPSession(page),
			c = await nodeCenter(page, '1');
		await cdp.send('Input.dispatchTouchEvent', {
			type: 'touchStart',
			touchPoints: [{ ...c, id: 0 }]
		});
		await cdp.send('Input.dispatchTouchEvent', {
			type: 'touchMove',
			touchPoints: [{ x: c.x + 70, y: c.y + 20, id: 0 }]
		});
		await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
		expect((await snapshot(page)).nodes[0].position).toEqual({ x: 30, y: 70 });
		await cdp.detach();
	});
}

for (const renderer of ['svg', 'canvas']) {
	test(`${renderer}: tree collapse preserves a shared downstream node and its visible path`, async ({
		page
	}) => {
		await mount(page, renderer, '&scenario=basic');
		await page.evaluate(() => {
			const f = (window as any).__diagram.controller;
			f.addNodes({
				id: 'outside',
				position: { x: 400, y: 50 },
				width: 100,
				height: 50,
				data: { label: 'Other root' }
			});
			f.addEdges({ source: 'outside', target: '3' });
			f.collapse('1');
		});
		await settleDiagram(page);
		expect(
			await page.evaluate(() =>
				(window as any).__diagram.controller.getVisibleNodes().map((n: any) => n.id)
			)
		).toEqual(['1', '3', 'outside']);
		expect(
			await page.evaluate(() => (window as any).__diagram.nodeState['1'].hiddenChildCount)
		).toBe(1);
		expect(
			await page.evaluate(() =>
				(window as any).__diagram.controller.getVisibleEdges().map((e: any) => [e.source, e.target])
			)
		).toEqual([['outside', '3']]);
		await page.evaluate(() => (window as any).__diagram.controller.expand('1'));
		expect(
			await page.evaluate(() => (window as any).__diagram.controller.getVisibleNodes().length)
		).toBe(4);
	});

	test(`${renderer}: body collapse hides direct children only`, async ({ page }) => {
		await mount(page, renderer, '&scenario=basic');
		await page.evaluate(() => {
			const f = (window as any).__diagram.controller;
			f.setEdges([]);
			f.setNodes([
				{
					id: 'group',
					type: 'group',
					position: { x: 20, y: 20 },
					width: 300,
					height: 300,
					data: {}
				},
				{
					id: 'child',
					parentId: 'group',
					position: { x: 30, y: 30 },
					width: 100,
					height: 50,
					data: { label: 'Child' }
				},
				{
					id: 'grandchild',
					parentId: 'child',
					position: { x: 30, y: 80 },
					width: 100,
					height: 50,
					data: { label: 'Grandchild' }
				}
			]);
			f.collapse('group');
		});
		await settleDiagram(page);
		expect(
			await page.evaluate(() =>
				(window as any).__diagram.controller.getVisibleNodes().map((n: any) => n.id)
			)
		).toEqual(['group', 'grandchild']);
		expect(
			await page.evaluate(() => (window as any).__diagram.nodeState.group.hiddenChildCount)
		).toBe(1);
		await page.evaluate(() => (window as any).__diagram.controller.expand('group'));
		expect(
			await page.evaluate(() => (window as any).__diagram.controller.getVisibleNodes().length)
		).toBe(3);
	});
}

for (const renderer of ['svg', 'canvas']) {
	test(`${renderer}: layout skips collapsed descendants and includes them after expansion`, async ({
		page
	}) => {
		await mount(page, renderer, '&scenario=layout');
		await page.evaluate(async () => {
			const f = (window as any).__diagram.controller;
			f.collapse('2');
			f.updateNode('3', { position: { x: 777, y: 777 } });
			await f.layout();
		});
		expect((await snapshot(page)).nodes.find((n) => n.id === '3')?.position).toEqual({
			x: 777,
			y: 777
		});
		await page.evaluate(async () => {
			const f = (window as any).__diagram.controller;
			f.expand('2');
			await f.layout();
		});
		expect((await snapshot(page)).nodes.find((n) => n.id === '3')?.position).not.toEqual({
			x: 777,
			y: 777
		});
	});
}

for (const renderer of ['svg', 'canvas']) {
	test(`${renderer}: moving from an edge path to its label preserves hover`, async ({ page }) => {
		await mount(page, renderer);
		const points = await page.evaluate(() => {
			const f = (window as any).__diagram.controller,
				e = f.getEdge('e1-3'),
				path = f.getEdgePath(e, f.getEdgeEndpoints(e));
			return {
				path: f.flowToScreenPosition(path.points[Math.floor(path.points.length / 4)]),
				label: f.flowToScreenPosition({ x: path.labelX, y: path.labelY })
			};
		});
		await page.mouse.move(points.path.x, points.path.y);
		await settleDiagram(page);
		expect(await page.evaluate(() => (window as any).__diagram.controller.hoveredEdgeId)).toBe(
			'e1-3'
		);
		await page.mouse.move(points.label.x, points.label.y);
		await settleDiagram(page);
		expect(await page.evaluate(() => (window as any).__diagram.controller.hoveredEdgeId)).toBe(
			'e1-3'
		);
	});
	test(`${renderer}: moving from a node body to its port preserves hover`, async ({ page }) => {
		await mount(page, renderer);
		const body = await nodeCenter(page, '2'),
			port = await handleCenter(page, '2', 'source');
		await page.mouse.move(body.x, body.y);
		await settleDiagram(page);
		await page.mouse.move(port.x, port.y);
		await settleDiagram(page);
		expect(await page.evaluate(() => (window as any).__diagram.controller.hoveredNodeId)).toBe('2');
	});
}

for (const renderer of ['svg', 'canvas']) {
	test(`${renderer}: a locked-node pane drag does not swallow the next history entry`, async ({
		page
	}) => {
		await mount(page, renderer, '&scenario=basic');
		await page.evaluate(() => {
			const f = (window as any).__diagram.controller;
			f.setInteraction({ drag: { enabled: false } });
			f.history.clear();
		});
		await settleDiagram(page);
		const start = await nodeCenter(page, '1');
		await dragPointer(page, start, { x: start.x + 50, y: start.y + 20 });
		await page.evaluate(() =>
			(window as any).__diagram.controller.updateNodeData('1', { label: 'Edited after pan' })
		);
		expect(await page.evaluate(() => (window as any).__diagram.controller.history.canUndo)).toBe(
			true
		);
		await page.evaluate(() => (window as any).__diagram.controller.history.undo());
		expect(
			await page.evaluate(() => (window as any).__diagram.controller.getNode('1').data.label)
		).toBe('Start');
	});
}

for (const renderer of ['svg', 'canvas']) {
	test(`${renderer}: nested groups paint below child edges and child drag stays local`, async ({
		page
	}) => {
		await mount(page, renderer, '&scenario=nested-order');
		const order = ['outer', 'inner', 'nested-link', 'a', 'b'];
		expect(await page.evaluate(() => (window as any).__diagram.sceneOrder())).toEqual(order);
		if (renderer === 'svg') {
			const labels = ['Outer frame', 'Inner frame', 'Nested transition', 'Child A', 'Child B'];
			const actual = await page.locator('svg').evaluate(
				(svg, labels) =>
					Array.from(svg.querySelectorAll('text'))
						.map((el) => el.textContent)
						.filter((text) => labels.includes(text ?? '')),
				labels
			);
			expect(actual).toEqual(labels);
			expect(
				await page.locator('svg').evaluate((svg) => {
					const text = (value: string) =>
						Array.from(svg.querySelectorAll('text')).find((el) => el.textContent === value)!;
					const edge = svg.querySelector('path[stroke="#7654ab"]')!;
					const before = (a: Element, b: Element) =>
						!!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
					return (
						!!edge &&
						before(text('Inner frame'), edge) &&
						before(edge, text('Child A')) &&
						before(edge, text('Child B'))
					);
				})
			).toBe(true);
		}
		const start = await nodeCenter(page, 'a');
		await page.mouse.move(start.x, start.y);
		await page.mouse.click(start.x, start.y);
		await settleDiagram(page);
		const before = await page.evaluate(() => ({ ...(window as any).__diagram.builds }));
		await dragPointer(page, start, { x: start.x + 35, y: start.y + 20 });
		const after = await page.evaluate(() => ({ ...(window as any).__diagram.builds }));
		expect(after.a).toBeGreaterThan(before.a);
		for (const id of ['outer', 'inner', 'b']) expect(after[id]).toBe(before[id]);
	});
}
