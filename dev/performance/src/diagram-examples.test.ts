import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getSceneOrder } from '../../../packages/diagram/src/headless/flow-diagram/controller';
import { readFileSync } from 'node:fs';
import {
	Constraints,
	SizedBox,
	StatefulWidget,
	StatelessWidget,
	type BuildContext,
	type Widget
} from 'flitterjs';
import {
	type FlowDiagramController,
	type FlowDiagramProps,
	type FlowNode,
	type NodeBodyCustomArgs
} from '../../../packages/diagram/src/engine';

const modules = import.meta.glob('../../../docs/src/app/diagram/_examples/*.ts', {
	eager: true
}) as Record<string, { default: (theme: 'light' | 'dark') => Widget }>;
const slugs = [
	'family-tree',
	'genetic-pedigree',
	'decision-flowchart',
	'edge-routing',
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
beforeEach(() => {
	vi.useFakeTimers();
});
afterEach(() => {
	mounted.splice(0).forEach((state) => state.dispose());
	vi.useRealTimers();
});
const context = {
	scheduler: { addPostFrameCallbacks() {}, ensureVisualUpdate() {} }
} as unknown as BuildContext;
function findFlow(widget: any): FlowDiagramProps<any> | null {
	if (typeof widget.builder === 'function')
		return findFlow(widget.builder(context, Constraints.tightFor({ width: 940, height: 540 })));
	if (widget.props?.custom && widget.props?.data) return widget.props;
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
	const flow = props.controller as FlowDiagramController;
	flow.configure(props);
	flow.setPaneSize(1100, 540);
	if (props.layout) await flow.layout();
	props.on?.init?.(flow);
	return { state, props, flow };
}
function args(flow: FlowDiagramController, node: FlowNode): NodeBodyCustomArgs {
	return {
		node,
		label: SizedBox.shrink(),
		handles: flow
			.getHandleSpecs(node)
			.filter((h) => h.placement === 'inline')
			.map((h) => ({
				id: h.id ?? null,
				type: h.type,
				handle: SizedBox({ width: 16, height: 16 })
			})),
		isSelected: !!node.selected,
		isDragging: false,
		isHovered: false,
		isDraggable: flow.isNodeDraggable(node),
		isSelectable: flow.isNodeSelectable(node),
		isConnectable: flow.isNodeConnectable(node),
		positionAbsolute: flow.getNodePositionAbsolute(node),
		zIndex: 0,
		isConnectionTarget: false,
		isResizable: flow.isNodeResizable(node),
		isResizing: false,
		isEditing: false,
		isDropTarget: false,
		isOverlapping: false,
		isCollapsed: !!node.collapsed,
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
	it(`${slug}: source uses only the installed preset and public engine`, () => {
		const path = new URL(`../../../docs/src/app/diagram/_examples/${slug}.ts`, import.meta.url);
		const source = readFileSync(path, 'utf8');
		for (const match of source.matchAll(/from\s+["']([^"']+)["']/g))
			expect(['flitterjs', '@flitterjs/diagram', '@/components/diagram/flow-diagram']).toContain(
				match[1]
			);
	});
	for (const theme of ['light', 'dark'] as const)
		it(`${slug}: ${theme} builds all node, handle, toolbar and edge parts`, async () => {
			const { state, props, flow } = await mount(slug, theme);
			expect((flow.config as any).colorMode).toBe(theme);
			expect(flow.nodes.length).toBeGreaterThanOrEqual(4);
			for (const node of flow.getVisibleNodes()) {
				const build = flow.custom.node;
				assertWidgets(build(args(flow, node), flow as any));
				const toolbar = flow.custom.nodeToolbar({ node, isSelected: true }, flow as any);
				if (toolbar) assertWidgets(toolbar);
				for (const handle of flow.getNodeHandles(node))
					assertWidgets(
						flow.custom.handle(
							{
								node,
								handle,
								isConnectable: true,
								isConnecting: false,
								isConnectionCandidate: false,
								isValidCandidate: null,
								isConnectionInProgress: false
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
					const build = flow.custom.edge;
					assertWidgets(
						build(
							{
								edge,
								path,
								origin: { x: 0, y: 0 },
								size: { width: 1100, height: 540 },
								endpoints: ep,
								isSelected: !!edge.selected,
								isHovered: false,
								isAnimated: !!edge.animated,
								sourceNode: flow.getNode(edge.source)!,
								targetNode: flow.getNode(edge.target)!,
								markerStart: null,
								markerEnd: null,
								interactionWidth: 20,
								isReconnecting: false,
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
							isSelected: false,
							isHovered: true,
							x: path.labelX,
							y: path.labelY
						},
						flow as any
					);
					if (label) assertWidgets(label);
				}
			}
			const rebuilt = findFlow(state.build(context))!;
      expect(rebuilt.controller).toBe(flow);
      expect(rebuilt.data.nodes).toBe(props.data.nodes); // app state rebuilds preserve graph input and controller
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
	it('keeps graph edits undoable after a sample run', async () => {
		const { state, flow } = await mount('automation-workflow');
		state.setMode('edit');
		flow.configure(findFlow(state.build())!);
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
		expect(flow.nodes).toHaveLength(5);
		expect(flow.edges).toHaveLength(4);
		expect(flow.nodes.every((n) => !n.data.done)).toBe(true);
	});
	it('reviews the selected branch of the edited workflow without enabling structural gestures', async () => {
		const { state, flow } = await mount('automation-workflow');
		expect(flow.isNodeDraggable(flow.getNode('webhook')!)).toBe(false);
		expect(flow.isNodeConnectable(flow.getNode('qualified')!)).toBe(false);
		state.decide('yes');
		expect(flow.getNode('slack')!.data.done).toBe(true);
		expect(flow.getNode('nurture')!.data.skipped).toBe(true);
		state.clearResults();
		state.decide('no');
		expect(flow.getNode('nurture')!.data.done).toBe(true);
		expect(flow.getNode('slack')!.data.skipped).toBe(true);

		state.setMode('edit');
		flow.configure(findFlow(state.build())!);
		expect(flow.isNodeDraggable(flow.getNode('webhook')!)).toBe(true);
		const originalIds = new Set(flow.nodes.map(node => node.id));
		state.insert('yes');
		const inserted = flow.nodes.find(node => !originalIds.has(node.id))!;
		expect(inserted).toBeTruthy();
		state.setMode('review');
		flow.configure(findFlow(state.build())!);
		state.decide('yes');
		expect(flow.getNode(inserted.id)!.data.done).toBe(true);
		expect(flow.getNode('slack')!.data.done).toBe(true);
		expect(flow.getNode('nurture')!.data.done).toBe(false);
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
			{ edge: flow.edges[0], label: ' ', isHovered: false, isSelected: false, x: 0, y: 0 },
			flow
		)
	).toMatchObject({ constraints: { minWidth: 0, maxWidth: 0, minHeight: 0, maxHeight: 0 } });
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

function texts(widget: any): { data: string; style: { fontSize: number } }[] {
	if (widget.runtimeType === '_Text') return [widget];
	if (typeof widget.builder === 'function')
		return texts(widget.builder(context, Constraints.tightFor({ width: 940, height: 540 })));
	if (widget instanceof StatelessWidget) return texts(widget.build(context));
	return (widget.children ?? (widget.child ? [widget.child] : [])).flatMap(texts);
}

it('deleting or deselecting a deployment clears the inspector and its action', async () => {
	const { flow, state } = await mount('deployment-canvas');
	expect(texts(state.build()).some((t) => t.data === 'Redeploy')).toBe(true);
	await flow.deleteElements(['api']);
	expect(state.selected).toBeNull();
	expect(texts(state.build()).some((t) => t.data === 'Redeploy')).toBe(false);
	flow.selectNodes(['worker']);
	expect(state.selected).toBe('worker');
	flow.clearSelection();
	expect(state.selected).toBeNull();
});

for (const slug of slugs) {
	it(`${slug}: initial view contains the graph (or the tall flow trigger) before enforcing readable text`, async () => {
		const { flow, props, state } = await mount(slug);
		for (const width of [940, 350]) {
			flow.setPaneSize(
				slug === 'deployment-canvas' && width === 940 ? width - 229 : width,
				width === 940 ? 540 : 320
			);
			if (slug === 'linear-steps') await state.fitStart();
			else
				await flow.fitView(
					typeof props.viewport?.fitView === 'object' ? props.viewport.fitView : {}
				);
			const visible = flow.getVisibleNodes();
			const required =
				slug === 'linear-steps' ? visible.filter((node) => node.id === 'trigger') : visible;
			expect(required.length).toBeGreaterThan(0);
			for (const node of required) {
				const rect = flow.getNodeRect(node)!;
				const at = flow.flowToPanePosition(rect);
				expect(at.x, `${node.id}: left`).toBeGreaterThanOrEqual(8);
				expect(at.y, `${node.id}: top`).toBeGreaterThanOrEqual(slug === 'linear-steps' ? 112 : 8);
				expect(at.x + rect.width * flow.zoom, `${node.id}: right`).toBeLessThanOrEqual(
					flow.paneSize.width - 8
				);
				expect(at.y + rect.height * flow.zoom, `${node.id}: bottom`).toBeLessThanOrEqual(
					flow.paneSize.height - 8
				);
			}
			const bounds = flow.getNodesBounds(required);
			const bestFit = Math.min(
				1,
				(flow.paneSize.width - 16) / bounds.width,
				(flow.paneSize.height - 16) / bounds.height
			);
			const checkText = (fontSize: number) => {
				expect(fontSize).toBeGreaterThanOrEqual(13);
				// At narrow widths the whole graph takes priority over the 10px target.
				if (fontSize * bestFit >= 10 || (slug === 'knowledge-graph' && width === 940))
					expect(fontSize * flow.zoom).toBeGreaterThanOrEqual(10);
			};
			for (const node of flow.getVisibleNodes()) {
				const build = flow.custom.node;
				for (const text of texts(build(args(flow, node), flow as any))) {
					checkText(text.style.fontSize);
				}
			}
			for (const edge of flow.getVisibleEdges().filter((e) => e.label)) {
				const label = flow.custom.edgeLabel(
					{ edge, label: edge.label!, isHovered: false, isSelected: false, x: 0, y: 0 },
					flow as any
				);
				expect(label).toBeTruthy();
				for (const text of texts(label)) checkText(text.style.fontSize);
			}
		}
	});
}

it('state-machine SUBMIT and RETRY labels have separate anchors', async () => {
	const { flow } = await mount('state-machine');
	const path = (id: string) => {
		const e = flow.getEdge(id)!;
		return flow.getEdgePath(e, flow.getEdgeEndpoints(e)!);
	};
	expect(Math.abs(path('submit').labelY - path('retry').labelY)).toBeGreaterThan(60);
});
it('scenario branch labels stay away from the other branch paths', async () => {
	const { flow } = await mount('scenario-router');
	for (const labelEdge of flow.edges.filter((e) => e.source === 'router')) {
		const path = flow.getEdgePath(labelEdge, flow.getEdgeEndpoints(labelEdge)!);
		for (const other of flow.edges.filter((e) => e.id !== labelEdge.id)) {
			const line = flow.getEdgePath(other, flow.getEdgeEndpoints(other)!);
			const intersects = line.points.some(
				(p) => Math.abs(p.x - path.labelX) < 78 && Math.abs(p.y - path.labelY) < 24
			);
			expect(intersects, `${other.id} crossing ${labelEdge.id}`).toBe(false);
		}
	}
});

it('the tall tree anchors its trigger below the header automatically after layout', async () => {
	const { flow } = await mount('linear-steps');
	const first = flow.getNodeRect('trigger')!;
	expect(flow.flowToPanePosition(first).y).toBe(112);
	expect(flow.zoom).toBe(0.85);
});


describe('distinct diagram applications', () => {
	it('adds a child to an existing couple and preserves both parents through undo', async () => {
		const { state, flow } = await mount('family-tree');
		const before = new Set(flow.nodes.map(node => node.id));
		state.addChild(flow.getNode('noah'));
		const child = flow.nodes.find(node => !before.has(node.id))!;
		expect(child.type).toBe('person');
		expect(flow.getIncomers(child).map(node => node.id)).toEqual(['noah-family']);
		expect(flow.getIncomers({ id: 'noah-family' }).map(node => node.id).sort()).toEqual(['mia', 'noah']);
		flow.history.undo();
		expect(flow.getNode(child.id)).toBeUndefined();
		state.toggleBranch(flow.getNode('thomas'));
		expect(flow.isNodeHidden(flow.getNode('noah')!)).toBe(true);
		expect(flow.isNodeHidden(flow.getNode('eva')!)).toBe(false);
		state.toggleBranch(flow.getNode('eva'));
		expect(flow.isNodeHidden(flow.getNode('noah')!)).toBe(false);
	});
	it('edits pedigree traits independently from deceased marks and undoes each change', async () => {
		const { state, flow, props } = await mount('genetic-pedigree');
		const click = () => props.on!.nodeClick!({} as MouseEvent, flow.getNode('I-1')!);
		click();
		expect(flow.getNode('I-1')!.data.affected).toBe(true);
		state.mode = 'deceased'; click();
		expect(flow.getNode('I-1')!.data.deceased).toBe(true);
		flow.history.undo();
		expect(flow.getNode('I-1')!.data.deceased).toBe(false);
		expect(flow.getNode('I-1')!.data.affected).toBe(true);
		flow.history.undo();
		expect(flow.getNode('I-1')!.data.affected).toBe(false);
		state.mode = 'select'; click();
		expect(flow.getNode('I-1')!.data.affected).toBe(false);
	});
	it('appends an editable decision shape and its connection as one undoable operation', async () => {
		const { state, flow } = await mount('decision-flowchart');
		const before = new Set(flow.nodes.map(node => node.id));
		state.append('decision');
		const decision = flow.nodes.find(node => !before.has(node.id))!;
		expect(decision).toMatchObject({ type: 'decision', height: 112 });
		expect(flow.getIncomers(decision).map(node => node.id)).toEqual(['inspect']);
		flow.startEditing(decision.id);
		expect(flow.editingId).toBe(decision.id);
		flow.stopEditing({ commit: false });
		flow.history.undo();
		expect(flow.nodes).toHaveLength(7);
		expect(flow.edges).toHaveLength(6);
	});
	it('changes cable geometry without losing editable bends and validates endpoint types', async () => {
		const { state, flow, props } = await mount('edge-routing');
		const bends = flow.getEdge('video')!.waypoints;
		state.route('bezier');
		expect(flow.edges.every(edge => edge.type === 'bezier')).toBe(true);
		expect(flow.getEdge('video')!.waypoints).toEqual(bends);
		flow.history.undo();
		expect(flow.edges.every(edge => edge.type === 'step')).toBe(true);
		state.clearBends();
		expect(flow.edges.every(edge => edge.waypoints?.length === 0)).toBe(true);
		flow.history.undo();
		expect(flow.getEdge('video')!.waypoints).toEqual(bends);
		const validate = (props.interaction as any).connect.validate;
		expect(validate({ source: 'camera', target: 'encoder' })).toBe(true);
		expect(validate({ source: 'camera', target: 'recorder' })).toBe(false);
	});
});
