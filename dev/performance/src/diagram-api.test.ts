import { describe, expect, it, vi } from 'vitest';
import {
	FlowDiagramController,
	type FlowDiagramProps,
	type FlowNode,
	type FlowEdge,
	type Connection
} from '../../../packages/diagram/src/engine';
import { defaultStyleConfig } from '../../../packages/diagram/registry/templates/diagrams/flow-diagram/styles/default';

import {
	baseDefaults,
	defaultHandles
} from '../../../packages/diagram/registry/templates/diagrams/flow-diagram/base';
const defaultCustom = {
	...baseDefaults,
	...defaultStyleConfig.custom
} as import('../../../packages/diagram/src/engine').FlowDiagramCustom<any>;

const nodes: FlowNode[] = [
	{ id: 'a', data: {}, position: { x: 0, y: 0 }, width: 100, height: 50 },
	{ id: 'b', data: {}, position: { x: 200, y: 0 }, width: 100, height: 50 },
	{ id: 'c', data: {}, position: { x: 400, y: 0 }, width: 100, height: 50 },
	{ id: 'other', data: {}, position: { x: 600, y: 0 }, width: 100, height: 50 }
];
const edges: FlowEdge[] = [
	{ id: 'ab', source: 'a', target: 'b' },
	{ id: 'bc', source: 'b', target: 'c' }
];
function setup(
	props: Omit<Partial<FlowDiagramProps<any>>, 'data'> & {
		data?: Partial<FlowDiagramProps['data']>;
	} = {}
) {
	const flow = new FlowDiagramController();
	flow.configure({
		data: { nodes, edges, ...props.data },
		custom: defaultCustom,
		getHandles: defaultHandles,
		config: defaultStyleConfig.createConfig(),
		...(({ data, ...rest }) => rest)(props)
	});
	return flow;
}
function pointer(x = 0, y = 0): MouseEvent {
	return {
		button: 0,
		clientX: x,
		clientY: y,
		preventDefault() {},
		stopPropagation() {}
	} as MouseEvent;
}

describe('grouped diagram API', () => {
	it('normalizes editor defaults and merges nested interaction settings', () => {
		const f = setup();
		expect(f.interaction.drag).toEqual({
			enabled: true,
			threshold: 1,
			snap: { grid: false, guides: false, radius: 5 },
			overlap: 'allow',
			dropIntoGroup: true
		});
		expect(f.options).toMatchObject({
			connectionRadius: 20,
			reconnectRadius: 10,
			snapGrid: [15, 15],
			snapToGrid: false,
			edgeInteractionWidth: 20,
			deleteKeyCode: ['Backspace', 'Delete']
		});
		f.setInteraction({
			drag: { snap: { guides: true } },
			history: { limit: 9 },
			edit: { text: true },
			keys: { undo: null }
		});
		expect(f.interaction.drag.snap).toEqual({ grid: false, guides: true, radius: 5 });
		expect(f.interaction.history).toEqual({ enabled: true, limit: 9 });
		expect(f.interaction.edit.text).toBe(true);
		expect(f.interaction.keys.undo).toBeNull();
		f.dispose();
	});
	it('viewer prevents mutation even for explicitly draggable/resizable items', async () => {
		const node = { ...nodes[0], draggable: true, resizable: true };
		const f = setup({ data: { nodes: [node, nodes[1]] }, interaction: 'viewer' });
		expect(f.panEnabled).toBe(true);
		expect(f.zoomEnabled).toBe(true);
		expect(f.isNodeDraggable(node)).toBe(false);
		expect(f.isNodeResizable(node)).toBe(false);
		expect(f.isNodeSelectable(node)).toBe(true);
		expect(f.isNodeConnectable(node)).toBe(false);
		expect(f.isEdgeReconnectable(edges[0])).toBe(false);
		expect(f.interaction.history.enabled).toBe(false);
		expect(f.interaction.clipboard.enabled).toBe(false);
		expect(await f.deleteElements({ nodes: [node] })).toEqual({
			deletedNodes: [],
			deletedEdges: []
		});
		f.dispose();
	});
	it('whiteboard merges nested overrides and updates existing gesture options', () => {
		const f = setup({ interaction: { preset: 'whiteboard', drag: { threshold: 7 } } });
		expect(f.interaction.pane.drag).toBe('select');
		expect(f.interaction.drag.snap.grid).toBe(false);
		expect(f.interaction.edit).toEqual({ text: true, waypoints: false, resize: true });
		expect(f.options.selectionOnDrag).toBe(true);
		expect(f.options.nodeDragThreshold).toBe(7);
		f.setInteraction({ drag: { snap: { grid: [10, 20] } } });
		expect(f.options.snapGrid).toEqual([10, 20]);
		expect(f.options.snapToGrid).toBe(true);
		f.dispose();
	});
	it('can wins over per-item flags, presets and global defaults', async () => {
		const node = {
			...nodes[0],
			draggable: false,
			selectable: false,
			connectable: false,
			resizable: false,
			deletable: false
		};
		const edge = { ...edges[0], reconnectable: false, selectable: false, deletable: false };
		const allow = setup({
			data: { nodes: [node, nodes[1]], edges: [edge] },

			interaction: 'viewer',
			can: () => true
		});
		expect(allow.isNodeDraggable(node)).toBe(true);
		expect(allow.isNodeSelectable(node)).toBe(true);
		expect(allow.isNodeConnectable(node)).toBe(true);
		expect(allow.isNodeResizable(node)).toBe(true);
		expect(allow.isEdgeSelectable(edge)).toBe(true);
		expect(allow.isEdgeReconnectable(edge)).toBe(true);
		expect((await allow.deleteElements({ nodes: [node] })).deletedNodes).toHaveLength(1);
		const deny = setup({ can: () => false });
		expect(deny.panEnabled).toBe(false);
		expect(deny.zoomEnabled).toBe(false);
		deny.selectNodes(['a']);
		expect(deny.getSelectedNodes()).toEqual([]);
		expect(deny.isEdgeSelectable(edges[0])).toBe(false);
		expect((await deny.deleteElements({ nodes: [nodes[0]] })).deletedNodes).toEqual([]);
		allow.dispose();
		deny.dispose();
	});
	it('maps viewport and delete lifecycle events and preserves delete veto', async () => {
		const viewportChange = vi.fn(),
			deleted = vi.fn(),
			beforeDelete = vi.fn(() => false);
		const f = setup({
			viewport: { initial: { x: 10, y: 20, zoom: 1.5 }, minZoom: 1, maxZoom: 2 },
			on: { viewportChange, delete: deleted, beforeDelete }
		});
		expect(f.viewport).toEqual({ x: 10, y: 20, zoom: 1.5 });
		f.handleViewportInteractionStart();
		await f.setViewport({ x: 20, y: 30, zoom: 1 });
		f.handleViewportInteractionEnd();
		expect(viewportChange.mock.calls.map(([e]) => e.phase)).toEqual([
			'move',
			'start',
			'move',
			'end'
		]);
		await f.deleteElements({ nodes: [nodes[0]] });
		expect(beforeDelete).toHaveBeenCalledOnce();
		expect(deleted).not.toHaveBeenCalled();
		f.dispose();
	});
	it('merges drag and click connect lifecycle and reports unsnapped flow drop coordinates', () => {
		const connectStart = vi.fn(),
			connectEnd = vi.fn();
		const f = setup({
			viewport: { initial: { x: 10, y: 20, zoom: 2 } },
			on: { connectStart, connectEnd }
		});
		f.handleConnectionStart('a', null, 'source', pointer(110, 120));
		expect(connectStart.mock.calls[0][0].mode).toBe('drag');
		f.handleConnectionEnd(pointer(310, 420));
		expect(connectEnd.mock.calls[0][0]).toMatchObject({
			state: { inProgress: false, mode: 'drag' },
			dropPosition: { x: 150, y: 200 }
		});
		f.handleHandleClick('a', null, 'source', pointer());
		expect(connectStart.mock.calls[1][0].mode).toBe('click');
		f.dispose();
	});
	it.each([false, { source: 'a', target: 'c' }])(
		'beforeConnect vetoes or patches a connection: %j',
		(patch) => {
			const beforeConnect = vi.fn((connection: Connection) =>
				typeof patch === 'object' ? { ...connection, ...patch } : false
			);
			const connectEnd = vi.fn();
			const f = setup({ data: { edges: [] }, on: { beforeConnect, connectEnd } });
			f.handleConnectionStart('a', null, 'source', pointer(50, 50));
			f.handleConnectionMove(pointer(250, 0));
			f.handleConnectionEnd(pointer(250, 0));
			expect(beforeConnect).toHaveBeenCalledOnce();
			expect(connectEnd).toHaveBeenCalledOnce();
			expect(f.edges.map((e) => e.target)).toEqual(patch === false ? [] : ['c']);
			f.dispose();
		}
	);
	it('hover and selection notify only affected neighbours; viewport changes notify no node signals', async () => {
		const f = setup();
		const counters = Object.fromEntries(nodes.map((n) => [n.id, vi.fn()]));
		for (const n of nodes) f.nodeSignal(n.id).addListener(counters[n.id]);
		const ab = vi.fn(),
			bc = vi.fn();
		f.edgeSignal('ab').addListener(ab);
		f.edgeSignal('bc').addListener(bc);
		f.hoverNode('a', pointer());
		expect(f.isNodeNeighbour('b')).toBe(true);
		expect(f.isNodeNeighbour('c')).toBe(false);
		expect(f.isEdgeNeighbour(edges[0])).toBe(true);
		expect(f.isEdgeNeighbour(edges[1])).toBe(false);
		expect(counters.a).toHaveBeenCalledOnce();
		expect(counters.b).toHaveBeenCalledOnce();
		expect(counters.c).not.toHaveBeenCalled();
		expect(counters.other).not.toHaveBeenCalled();
		expect(ab).toHaveBeenCalledOnce();
		expect(bc).not.toHaveBeenCalled();
		f.unhoverNode('a', pointer());
		expect(f.isNodeNeighbour('b')).toBe(false);
		f.selectNodes(['c']);
		expect(f.isNodeNeighbour('b')).toBe(true);
		for (const fn of Object.values(counters)) fn.mockClear();
		await f.setViewport({ x: 10, y: 10, zoom: 1.5 });
		for (const fn of Object.values(counters)) expect(fn).not.toHaveBeenCalled();
		f.dispose();
	});
	it('drag ticks notify only the dragged node', () => {
		const f = setup();
		f.selectNodes(['a']);
		f.handleNodeDragStart('a', pointer(40, 20));
		f.handleNodeDragMove('a', pointer(50, 30));
		const counters = nodes.map((n) => {
			const fn = vi.fn();
			f.nodeSignal(n.id).addListener(fn);
			return fn;
		});
		f.handleNodeDragMove('a', pointer(60, 40));
		expect(counters[0]).toHaveBeenCalledOnce();
		for (const fn of counters.slice(1)) expect(fn).not.toHaveBeenCalled();
		f.dispose();
	});
});
