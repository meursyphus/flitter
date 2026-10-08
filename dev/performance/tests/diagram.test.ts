import { test, expect, type Page } from '@playwright/test';

type Snapshot = {
	nodes: { id: string; position: { x: number; y: number }; measured?: { width: number; height: number }; selected: boolean }[];
	edges: { id: string; source: string; target: string; selected: boolean }[];
	viewport: { x: number; y: number; zoom: number };
	events: string[];
};

const snapshot = (page: Page): Promise<Snapshot> =>
	page.evaluate(() => {
		const { controller, events } = (window as any).__diagram;
		return {
			nodes: controller.getNodes().map((n: any) => ({ id: n.id, position: n.position, measured: n.measured, selected: !!n.selected })),
			edges: controller.getEdges().map((e: any) => ({ id: e.id, source: e.source, target: e.target, selected: !!e.selected })),
			viewport: controller.getViewport(),
			events: [...events]
		};
	});

const nodeCenter = (page: Page, id: string) =>
	page.evaluate((nodeId) => {
		const { controller } = (window as any).__diagram;
		const rect = controller.getNodeRect(nodeId);
		return controller.flowToScreenPosition({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 });
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
	page.evaluate(([nodeId, handleType]) => {
		const { controller } = (window as any).__diagram;
		const handle = controller.getNodeHandles(nodeId).find((h: any) => h.type === handleType);
		return controller.flowToScreenPosition({ x: handle.x, y: handle.y });
	}, [id, type] as const);

async function mount(page: Page, renderer: string, parameters = '') {
	await page.goto(`/interaction/diagram?renderer=${renderer}${parameters}`);
	await expect.poll(() => page.evaluate(() => !!(window as any).__diagram)).toBe(true);
	await expect.poll(async () => (await snapshot(page)).nodes.every((n) => n.measured != null)).toBe(true);
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
		expect((await snapshot(page)).nodes.map((n) => `${n.id}:${n.selected}`)).toEqual(['1:true', '2:false', '3:false']);

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
		await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));

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

	test(`${renderer}: content beyond the untransformed viewport survives zooming out`, async ({ page }) => {
		test.skip(renderer !== 'canvas', 'pixel check for the canvas picture-recording bounds');
		await mount(page, renderer);
		// Push node 3 far to the right: in flow coordinates the edge to it now runs
		// past the pane width, which a picture sized to the pane would cull.
		await page.evaluate(() => {
			const { controller } = (window as any).__diagram;
			controller.updateNode('3', { position: { x: 900, y: 180 } });
			void controller.setViewport({ x: 20, y: 20, zoom: 0.5 });
		});
		await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
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

	test(`${renderer}: dragging one node rebuilds only that node`, async ({ page }) => {
		const box = await mount(page, renderer);
		const builds = () => page.evaluate(() => ({ ...(window as any).__diagram.builds }));
		const settle = () =>
			page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
		const before = await builds();
		const c2 = await nodeCenter(page, '2');
		await page.mouse.move(c2.x, c2.y);
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

	test(`${renderer}: reconnecting an edge endpoint moves it to another handle`, async ({ page }) => {
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
		await page.mouse.move((targetEnd.x + newTarget.x) / 2, (targetEnd.y + newTarget.y) / 2, { steps: 4 });
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

	test(`${renderer}: resizing a selected node from its corner and a node toolbar`, async ({ page }) => {
		await mount(page, renderer);
		const c2 = await nodeCenter(page, '2');
		await page.mouse.click(c2.x, c2.y);
		await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
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

	test(`${renderer}: translateExtent keeps the viewport inside the allowed region`, async ({ page }) => {
		const box = await mount(page, renderer, '&extent');
		await page.evaluate(() => (window as any).__diagram.controller.setViewport({ x: 0, y: 0, zoom: 1 }));
		await page.mouse.move(box.x + 10, box.y + 10);
		await page.mouse.down();
		await page.mouse.move(box.x + 200, box.y + 150, { steps: 6 });
		await page.mouse.up();
		// dragging right/down would reveal negative coordinates: clamped to the extent origin
		expect((await snapshot(page)).viewport).toEqual({ x: 0, y: 0, zoom: 1 });
		await page.evaluate(() => (window as any).__diagram.controller.setViewport({ x: -5000, y: -5000, zoom: 1 }));
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
			page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));

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
		await touch('touchStart', [{ x: mid.x - 40, y: mid.y }, { x: mid.x + 40, y: mid.y }]);
		await touch('touchMove', [{ x: mid.x - 30, y: mid.y }, { x: mid.x + 30, y: mid.y }]);
		await touch('touchMove', [{ x: mid.x - 20, y: mid.y }, { x: mid.x + 20, y: mid.y }]);
		await touch('touchEnd', []);
		await settle();
		const vpAfter = (await snapshot(page)).viewport;
		expect(vpAfter.zoom).toBeCloseTo(Math.max(0.5, vpBefore.zoom / 2), 3);
		// the midpoint stays fixed: the flow point under it is unchanged
		const flowBefore = { x: (mid.x - box.x - vpBefore.x) / vpBefore.zoom, y: (mid.y - box.y - vpBefore.y) / vpBefore.zoom };
		const flowAfter = { x: (mid.x - box.x - vpAfter.x) / vpAfter.zoom, y: (mid.y - box.y - vpAfter.y) / vpAfter.zoom };
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
		cdp.send('Input.dispatchTouchEvent', { type, touchPoints: points.map((p, id) => ({ x: p.x, y: p.y, id })) });
	const prevented = () => page.evaluate(() => (window as any).__touchPrevented);
	const arm = () =>
		page.evaluate(() => {
			(window as any).__touchPrevented = null;
			window.addEventListener('touchstart', (e) => ((window as any).__touchPrevented = e.defaultPrevented), { once: true });
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
