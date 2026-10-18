import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getSceneOrder } from '../../../packages/diagram/src/headless/flow/controller';
import { readFileSync } from 'node:fs';
import { StatefulWidget, StatelessWidget, type BuildContext, type Widget } from 'flitter-core';
import {
	type FlowController,
	type FlowProps,
	type FlowNode,
	type NodeBuilderArgs
} from '../../../packages/diagram/src/engine';

const modules = import.meta.glob('../../../docs/src/app/diagram/_examples/*.ts', {
	eager: true
}) as Record<string, { default: (theme: 'light' | 'dark') => Widget }>;
const slugs = [
	'deployment-canvas',
	'schema-visualizer',
	'automation-workflow',
	'linear-steps',
	'scenario-router',
	'pipeline-run',
	'dataflow-graph',
	'process-diagram',
	'whiteboard',
	'org-chart',
	'knowledge-graph',
	'state-machine'
];
const mounted: { dispose(): void }[] = [];
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
	mounted.splice(0).forEach((state) => state.dispose());
	vi.useRealTimers();
});
const context = {
	scheduler: { addPostFrameCallbacks() {}, ensureVisualUpdate() {} }
} as unknown as BuildContext;
function findFlow(widget: any): FlowProps<any> | null {
	if (widget.props?.custom && widget.props?.nodes) return widget.props;
	for (const child of widget.children ?? (widget.child ? [widget.child] : [])) {
		const found = findFlow(child);
		if (found) return found;
	}
	return null;
}
async function mount(slug: string, theme: 'light' | 'dark' = 'light') {
	const entry = Object.entries(modules).find(([path]) => path.endsWith(`/${slug}.ts`))!;
	const widget = entry[1].default(theme) as StatefulWidget;
	const state = widget.createState() as any;
	state.widget = widget;
	state.element = { markNeedsBuild() {} };
	state.initState(context);
	mounted.push(state);
	const props = findFlow(state.build(context))!;
	expect(props).toBeTruthy();
	const flow = props.controller as FlowController;
	flow.configure(props);
	flow.setPaneSize(1100, 540);
	if (props.layout) await flow.layout();
	props.on?.init?.(flow);
	return { state, props, flow };
}
function args(flow: FlowController, node: FlowNode): NodeBuilderArgs {
	return {
		node,
		selected: !!node.selected,
		dragging: false,
		hovered: false,
		draggable: flow.isNodeDraggable(node),
		selectable: flow.isNodeSelectable(node),
		connectable: flow.isNodeConnectable(node),
		positionAbsolute: flow.getNodePositionAbsolute(node),
		zIndex: 0,
		isConnectionTarget: false,
		resizable: flow.isNodeResizable(node),
		resizing: false,
		editing: false,
		isDropTarget: false,
		isOverlapping: false,
		collapsed: !!node.collapsed,
		hiddenChildCount: flow.hiddenChildCount(node.id),
		isNeighbour: flow.isNodeNeighbour(node.id)
	};
}
function assertWidgets(widget: any, depth = 0): void {
	expect(widget).toBeTruthy();
	expect(depth).toBeLessThan(40);
	if (widget instanceof StatelessWidget) return assertWidgets(widget.build(context), depth + 1);
	// Paint and TextField states need a mounted browser, but all pure builders can be expanded here.
	for (const child of widget.children ?? (widget.child ? [widget.child] : []))
		assertWidgets(child, depth + 1);
}

for (const slug of slugs) {
	it(`${slug}: self-contained source is at most 250 lines`, () => {
		const path = new URL(`../../../docs/src/app/diagram/_examples/${slug}.ts`, import.meta.url);
		const source = readFileSync(path, 'utf8');
		expect(source.trimEnd().split('\n').length).toBeLessThanOrEqual(250);
		for (const match of source.matchAll(/from\s+["']([^"']+)["']/g))
			expect(['flitter-ui', 'flitter-ui/diagram', '@/components/diagram/flow-diagram']).toContain(
				match[1]
			);
	});
	for (const theme of ['light', 'dark'] as const)
		it(`${slug}: ${theme} builds all node, handle, toolbar and edge parts`, async () => {
			const { state, props, flow } = await mount(slug, theme);
			expect((flow.config as any).colorMode).toBe(theme);
			expect(flow.nodes.length).toBeGreaterThanOrEqual(4);
			for (const node of flow.getVisibleNodes()) {
				const definition = props.nodeTypes?.[node.type ?? 'default'] ?? props.nodeTypes?.default;
				const build =
					typeof definition === 'function' ? definition : (definition?.build ?? flow.custom.node);
				assertWidgets(build(args(flow, node), flow as any));
				const toolbar =
					typeof definition === 'object' &&
					definition.toolbar?.({ node, selected: true }, flow as any);
				if (toolbar) assertWidgets(toolbar);
				for (const handle of flow.getNodeHandles(node))
					assertWidgets(
						flow.custom.handle(
							{
								node,
								handle,
								connectable: true,
								isConnecting: false,
								isConnectionCandidate: false,
								isValidCandidate: null,
								connectionInProgress: false
							},
							flow as any
						)
					);
				const rect = flow.getNodeRect(node)!;
				expect([rect.x, rect.y, rect.width, rect.height].every(Number.isFinite)).toBe(true);
			}
			for (const edge of flow.edges) {
				const ep = flow.getEdgeEndpoints(edge);
				if (ep) {
					const path = flow.getEdgePath(edge, ep);
					expect(path.points.length).toBeGreaterThan(1);
					expect(path.points.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y))).toBe(true);
					const definition = props.edgeTypes?.[edge.type ?? 'default'];
					const build =
						typeof definition === 'function' ? definition : (definition?.build ?? flow.custom.edge);
					assertWidgets(
						build(
							{
								edge,
								path,
								origin: { x: 0, y: 0 },
								size: { width: 1100, height: 540 },
								endpoints: ep,
								selected: !!edge.selected,
								hovered: false,
								animated: !!edge.animated,
								sourceNode: flow.getNode(edge.source)!,
								targetNode: flow.getNode(edge.target)!,
								markerStart: null,
								markerEnd: null,
								interactionWidth: 20,
								reconnecting: false,
								waypoints: edge.waypoints ?? [],
								activeHandle: null,
								isNeighbour: flow.isEdgeNeighbour(edge)
							},
							flow as any
						)
					);
					const label = flow.custom.edgeLabel(
						{
							edge,
							label: edge.label ?? ' ',
							selected: false,
							hovered: true,
							x: path.labelX,
							y: path.labelY
						},
						flow as any
					);
					if (label) assertWidgets(label);
				}
			}
			expect(findFlow(state.build(context))).toBe(props); // panel updates preserve the scene instance
		});
}

describe('gallery recipes', () => {
	it('groups selected services and folds nested storage', async () => {
		const { state, flow } = await mount('deployment-canvas');
		flow.selectNodes(['api', 'worker']);
		state.newGroup({ x: 0, y: 0 });
		expect(flow.getNode('api')?.parentId).toBe(flow.getNode('worker')?.parentId);
		state.fold('storage');
		expect(flow.isNodeHidden(flow.getNode('db')!)).toBe(true);
		state.fold('storage');
		expect(flow.isNodeHidden(flow.getNode('db')!)).toBe(false);
	});
	it('allows compatible FK column types only', async () => {
		const { state } = await mount('schema-visualizer');
		expect(
			state.compatible({
				source: 'orders',
				sourceHandle: 'customer_id',
				target: 'customers',
				targetHandle: 'id'
			})
		).toBe(true);
		expect(
			state.compatible({
				source: 'orders',
				sourceHandle: 'total',
				target: 'customers',
				targetHandle: 'id'
			})
		).toBe(false);
	});
	it('adds an action on connection drop and undoes a complete simulated run', async () => {
		const { state, flow } = await mount('automation-workflow');
		flow.handleConnectionStart('webhook', null, 'source', {
			button: 0,
			clientX: 200,
			clientY: 120
		} as MouseEvent);
		flow.handleConnectionEnd({ clientX: 450, clientY: 400 } as MouseEvent);
		expect(state.search).not.toBeNull();
		state.addAction(0);
		expect(flow.nodes).toHaveLength(6);
		expect(flow.edges).toHaveLength(5);
		state.run();
		await vi.advanceTimersByTimeAsync(3500);
		expect(flow.nodes.every((n) => n.data.done)).toBe(true);
		flow.history.undo();
		expect(flow.nodes.every((n) => !n.data.done)).toBe(true);
	});
	it('inserts a fixed-layout step and folds a path', async () => {
		const { state, flow } = await mount('linear-steps');
		expect(flow.isNodeDraggable(flow.nodes[0])).toBe(false);
		state.insert(flow.edges[0]);
		await Promise.resolve();
		expect(flow.nodes).toHaveLength(8);
		state.reorder(false);
		expect(flow.getOutgoers({ id: 'format' }).some((n) => n.id === state.selected)).toBe(true);
		flow.collapse('vip');
		expect(flow.isNodeHidden(flow.getNode('notify')!)).toBe(true);
	});
	it('inserts a router without deleting orphan modules when ordering', async () => {
		const { state, flow } = await mount('scenario-router');
		state.insertRouter('priority');
		expect(flow.nodes).toHaveLength(6);
		flow.addNodes({ id: 'orphan', position: { x: 0, y: 0 }, width: 160, height: 135, data: {} });
		await state.order();
		expect(flow.getNode('orphan')).toBeTruthy();
	});
	it('runs jobs in viewer mode and restores expanded stage geometry', async () => {
		const { state, flow } = await mount('pipeline-run');
		await flow.fitView({ padding: 0.12, maxZoom: 1 });
		expect(flow.zoom).toBeGreaterThanOrEqual(0.8);
		for (const job of flow.nodes.filter((n) => n.type === 'job')) {
			expect(job.width).toBeGreaterThanOrEqual(150);
			expect(job.height).toBeGreaterThanOrEqual(44);
		}
		expect(flow.getNode('staging')!.position.x).toBe(flow.getNode('smoke')!.position.x);
		expect(flow.isNodeDraggable(flow.getNode('lint')!)).toBe(false);
		const width = flow.getNode('build')!.width;
		state.fold('build');
		state.fold('build');
		expect(flow.getNode('build')!.width).toBe(width);
		state.simulate();
		await vi.advanceTimersByTimeAsync(5000);
		expect(
			flow.nodes.filter((n) => n.type === 'job').every((n) => n.data.status === 'success')
		).toBe(true);
	});
	it('pastes a processor with its external input links and folds only its body', async () => {
		const { state, flow } = await mount('dataflow-graph');
		state.pasteWithLinks();
		expect(flow.nodes).toHaveLength(6);
		expect(flow.edges).toHaveLength(7);
		state.compact(flow.getNode('sampler'));
		expect(flow.getVisibleNodes()).toHaveLength(6);
		expect(flow.getNode('sampler')!.height).toBe(44);
		state.reroute();
		expect(flow.nodes.some((n) => n.type === 'reroute')).toBe(true);
	});
	it('appends a process task inside the same lane', async () => {
		const { state, flow } = await mount('process-diagram');
		state.append(flow.getNode('review'), 'task');
		expect(flow.nodes.at(-1)?.parentId).toBe('sales');
		expect(flow.edges.at(-1)?.source).toBe('review');
	});
	it('quick-adds a connected whiteboard shape', async () => {
		const { state, flow } = await mount('whiteboard');
		state.add();
		expect(flow.nodes).toHaveLength(5);
		expect(flow.edges).toHaveLength(3);
		flow.history.undo();
		expect(flow.nodes).toHaveLength(4);
	});
	it('reparents a reporting subtree and searches its root path', async () => {
		const { state, flow, props } = await mount('org-chart');
		flow.updateNode('sam', { position: flow.getNode('amina')!.position });
		props.on!.dragEnd!({} as MouseEvent, flow.getNode('sam')!, [flow.getNode('sam')!]);
		expect(flow.getIncomers({ id: 'sam' })[0].id).toBe('amina');
		state.find('sam');
		expect(state.path.has('maya')).toBe(true);
	});
	it('filters graph depth and preserves pinned positions through reflow', async () => {
		const { state, flow } = await mount('knowledge-graph');
		state.filter(1);
		const shallow = flow.getVisibleNodes().length;
		state.filter(3);
		expect(flow.getVisibleNodes().length).toBeGreaterThan(shallow);
		flow.updateNodeData('incident', { pinned: true });
		const position = flow.getNode('incident')!.position;
		await state.reflow();
		expect(flow.getNode('incident')!.position).toEqual(position);
	});
	it('clicking a plus handle creates a nested state and transition', async () => {
		const { flow } = await mount('state-machine');
		flow.handleHandleClick('authorizing', 'add', 'source', {
			clientX: 0,
			clientY: 0
		} as MouseEvent);
		expect(flow.nodes).toHaveLength(9);
		expect(flow.nodes.at(-1)?.parentId).toBe('payment');
		expect(flow.edges.at(-1)?.source).toBe('authorizing');
	});
});

it('knowledge links are straight circle-rim paths with no markers', async () => {
	const { flow } = await mount('knowledge-graph');
	for (const edge of flow.getVisibleEdges()) {
		const path = flow.getEdgePath(edge, flow.getEdgeEndpoints(edge)!);
		expect(path.commands.map((c) => c.type)).toEqual(['M', 'L']);
		const a = flow.getNodeRect(edge.source)!,
			b = flow.getNodeRect(edge.target)!;
		expect(
			Math.hypot(path.points[0].x - a.x - a.width / 2, path.points[0].y - a.y - 24)
		).toBeCloseTo(24);
		expect(
			Math.hypot(path.points.at(-1)!.x - b.x - b.width / 2, path.points.at(-1)!.y - b.y - 24)
		).toBeCloseTo(24);
		expect(edge.markerEnd).toBeUndefined();
	}
});
it('workflow edge controls occupy no space until hovered', async () => {
	const { props, flow } = await mount('automation-workflow');
	expect(
		props.custom.edgeLabel(
			{ edge: flow.edges[0], label: ' ', hovered: false, selected: false, x: 0, y: 0 },
			flow
		)
	).toBeNull();
});

it('deployment references clear both group fills and storage folds to a count chip', async () => {
	const { state, flow } = await mount('deployment-canvas');
	flow.setEdges((edges) => edges.map((edge) => ({ ...edge, hidden: false })));
	const order = getSceneOrder(flow).map((item) =>
		item.kind === 'node' ? item.node.id : item.edge.id
	);
	for (const edge of flow.edges) {
		expect(order.indexOf(edge.id)).toBeGreaterThan(order.indexOf('production'));
		expect(order.indexOf(edge.id)).toBeGreaterThan(order.indexOf('storage'));
	}
	state.fold('storage');
	expect(flow.getNode('storage')).toMatchObject({ collapsed: true, width: 225, height: 50 });
	expect(flow.hiddenChildCount('storage')).toBe(2);
});
it('state-machine event labels clear frame headers and the initial edge stays unlabelled', async () => {
	const { flow } = await mount('state-machine');
	expect(flow.getEdge('initial-draft')!.label).toBe('');
	expect(flow.edges.filter((edge) => edge.label).map((edge) => edge.label)).toEqual([
		'SUBMIT',
		'AUTHORIZED',
		'DECLINED',
		'RETRY',
		'CAPTURED'
	]);
	for (const edge of flow.edges.filter((edge) => edge.label)) {
		const path = flow.getEdgePath(edge, flow.getEdgeEndpoints(edge)!);
		for (const group of flow.nodes.filter((node) => node.type === 'compound')) {
			const rect = flow.getNodeRect(group)!;
			expect(
				path.labelX >= rect.x &&
					path.labelX <= rect.x + rect.width &&
					path.labelY >= rect.y &&
					path.labelY <= rect.y + 50
			).toBe(false);
		}
	}
});
