import { describe, expect, it, vi } from 'vitest';
import {
	FlowDiagramController,
	type FlowDiagramProps,
	type FlowNode
} from '../../../packages/diagram/src/engine';
import { getSceneOrder } from '../../../packages/diagram/src/headless/flow-diagram/controller';
import { defaultStyleConfig } from '../../../packages/diagram/registry/templates/diagrams/flow-diagram/styles/default';

import { baseDefaults } from '../../../packages/diagram/registry/templates/diagrams/flow-diagram/base';
const defaultCustom = {
	...baseDefaults,
	...defaultStyleConfig.custom
} as import('../../../packages/diagram/src/engine').FlowDiagramCustom<any>;

const node = (id: string, x = 0, y = 0): FlowNode => ({
	id,
	data: { label: id },
	position: { x, y },
	width: 100,
	height: 50
});
function flow(
	props: Omit<Partial<FlowDiagramProps<any>>, 'data'> & {
		data?: Partial<FlowDiagramProps['data']>;
	} = {}
) {
	const f = new FlowDiagramController();
	f.configure({
		data: {
			nodes: [node('a'), node('b', 200)],
			edges: [{ id: 'ab', source: 'a', target: 'b' }],
			...props.data
		},

		custom: defaultCustom,
		config: defaultStyleConfig.createConfig(),
		...(({ data, ...rest }) => rest)(props)
	});
	return f;
}
const pointer = (x = 0, y = 0) =>
	({ button: 0, clientX: x, clientY: y, preventDefault() {}, stopPropagation() {} }) as MouseEvent;

describe('P2 follow-ups and menus', () => {
	it('viewer allows click selection, disables box select and mutation', () => {
		const f = flow({ interaction: 'viewer' });
		f.handleNodeClick('a', pointer());
		expect(f.getSelectedNodes().map((n) => n.id)).toEqual(['a']);
		expect(f.handleSelectionDragStart({ ...pointer(), shiftKey: true })).toBe(false);
		expect(f.isNodeDraggable(f.nodes[0])).toBe(false);
	});
	it('only rebuilds opted-in LOD nodes on threshold crossings', async () => {
		const f = flow({
			data: { nodes: [{ ...node('a'), type: 'lod' }, node('b')] },
			nodeTypes: { lod: { build: defaultCustom.node, lod: [0.75, 1.5] } }
		});
		const a = vi.fn(),
			b = vi.fn();
		f.nodeSignal('a').addListener(a);
		f.nodeSignal('b').addListener(b);
		await f.zoomTo(1.2);
		expect(a).not.toHaveBeenCalled();
		await f.zoomTo(1.6);
		expect(a).toHaveBeenCalledTimes(1);
		await f.zoomTo(1.8);
		expect(a).toHaveBeenCalledTimes(1);
		await f.zoomTo(1.4);
		expect(a).toHaveBeenCalledTimes(2);
		expect(b).not.toHaveBeenCalled();
		expect(f.zoom).toBe(1.4);
	});
	it('menus select unselected nodes and target an existing selection', () => {
		const onMenu = vi.fn();
		const f = flow({ on: { contextMenu: onMenu } });
		f.openContextMenu({ kind: 'node', id: 'a' }, { x: 30, y: 40 });
		expect(f.contextMenu).toMatchObject({ target: 'node', ids: ['a'], position: { x: 30, y: 40 } });
		f.selectNodes(['a', 'b']);
		f.openContextMenu({ kind: 'node', id: 'a' }, { x: 10, y: 10 });
		expect(f.contextMenu?.target).toBe('selection');
		expect(f.contextMenu?.ids).toEqual(['a', 'b']);
		f.handleViewportInteractionStart();
		expect(f.contextMenu).toBeNull();
		expect(onMenu).toHaveBeenCalledTimes(2);
	});
});

describe('history', () => {
	it('marks programmatic edits and restores both arrays with redo', () => {
		const f = flow();
		f.updateNodeData('a', { label: 'changed' });
		expect(f.history.canUndo).toBe(true);
		f.history.undo();
		expect(f.nodes[0].data.label).toBe('a');
		f.history.redo();
		expect(f.nodes[0].data.label).toBe('changed');
		f.history.clear();
		expect(f.history.canUndo).toBe(false);
	});
	it('supports explicit marks, merge, ignore and limits', () => {
		const f = flow({ interaction: { history: { limit: 2 } } });
		f.run(() => f.updateNodeData('a', { label: 'ignored' }), { history: 'ignore' });
		expect(f.history.canUndo).toBe(false);
		f.history.mark('edit');
		f.updateNodeData('a', { label: 'one' });
		f.run(() => f.updateNodeData('b', { label: 'merged' }), { history: 'merge' });
		f.history.undo();
		expect(f.nodes.map((n) => n.data.label)).toEqual(['ignored', 'b']);
		f.updateNodeData('a', { label: '1' });
		f.updateNodeData('a', { label: '2' });
		f.updateNodeData('a', { label: '3' });
		f.history.undo();
		f.history.undo();
		expect(f.nodes[0].data.label).toBe('1');
		expect(f.history.canUndo).toBe(false);
	});
	it('one drag is one entry; a click or snapped no-op drag creates no entry', () => {
		const f = flow();
		f.handleNodeDragStart('a', pointer());
		f.handleNodeDragEnd('a', pointer());
		expect(f.history.canUndo).toBe(false);
		f.handleNodeDragStart('a', pointer());
		f.handleNodeDragMove('a', pointer(20, 20));
		f.handleNodeDragMove('a', pointer(30, 30));
		f.handleNodeDragEnd('a', pointer(30, 30));
		f.history.undo();
		expect(f.nodes[0].position).toEqual({ x: 0, y: 0 });
		expect(f.history.canUndo).toBe(false);
		const snap = flow({ interaction: { drag: { snap: { grid: [100, 100] } } } });
		snap.handleNodeDragStart('a', pointer());
		snap.handleNodeDragMove('a', pointer(2, 2));
		snap.handleNodeDragEnd('a', pointer(2, 2));
		expect(snap.history.canUndo).toBe(false);
	});
});

describe('clipboard', () => {
	it('copies descendants and only internal edges; remaps parents and endpoints', () => {
		const f = flow({
			data: {
				nodes: [
					{ ...node('group', 100, 100), type: 'group' },
					{ ...node('child', 20, 20), parentId: 'group' },
					node('other', 500)
				],
				edges: [
					{ id: 'inside', source: 'group', target: 'child' },
					{ id: 'outside', source: 'child', target: 'other' }
				]
			}
		});
		const content = f.getContent(['group']);
		expect(content.nodes).toHaveLength(2);
		expect(content.edges.map((e) => e.id)).toEqual(['inside']);
		const copy = f.putContent(content, { at: { x: 300, y: 400 } });
		expect(copy.nodes[0].position).toEqual({ x: 300, y: 400 });
		expect(copy.nodes[1].position).toEqual({ x: 20, y: 20 });
		expect(copy.nodes[1].parentId).toBe(copy.nodes[0].id);
		expect(copy.edges[0].source).toBe(copy.nodes[0].id);
		expect(copy.edges[0].target).toBe(copy.nodes[1].id);
		expect(copy.nodes[0].id).not.toBe('group');
		f.history.undo();
		expect(f.nodes).toHaveLength(3);
	});
	it('pastes at the pointer inside the pane and offsets outside it', async () => {
		const f = flow();
		f.selectNodes(['a']);
		await f.copy();
		f.setPointerInside(true);
		f.handlePanePointerMove(pointer(350, 100));
		const at = await f.paste();
		expect(at.nodes[0].position).toEqual({ x: 350, y: 100 });
		f.setPointerInside(false);
		const offset = await f.paste();
		expect(offset.nodes[0].position).toEqual({ x: 20, y: 20 });
	});
});

const key = (name: string, extra: Partial<KeyboardEvent> = {}) =>
	({
		key: name,
		code: name,
		ctrlKey: false,
		metaKey: false,
		shiftKey: false,
		altKey: false,
		repeat: false,
		target: null,
		preventDefault() {},
		...extra
	}) as KeyboardEvent;
describe('keyboard baseline', () => {
	it('selects, nudges by cells, merges repeats and supports Shift x10 and escape', () => {
		const f = flow({
			interaction: { keys: { selectAll: 'Control+a' }, drag: { snap: { grid: [15, 20] } } }
		});
		f.handleKeyDown(key('a', { ctrlKey: true }));
		expect(f.getSelectedNodes()).toHaveLength(2);
		f.handleKeyDown(key('ArrowRight'));
		f.handleKeyDown(key('ArrowRight', { repeat: true }));
		expect(f.nodes[0].position.x).toBe(30);
		f.history.undo();
		expect(f.nodes[0].position.x).toBe(0);
		f.handleKeyDown(key('ArrowDown', { shiftKey: true }));
		expect(f.nodes[0].position.y).toBe(200);
		f.handleKeyDown(key('Escape'));
		expect(f.getSelectedNodes()).toHaveLength(0);
	});
	it('honours disabled bindings and input targets, and cancels a drag', () => {
		const f = flow({ interaction: { keys: { selectAll: null } } });
		f.handleKeyDown(key('a', { ctrlKey: true }));
		expect(f.getSelectedNodes()).toHaveLength(0);
		f.selectNodes(['a']);
		f.handleKeyDown(key('Delete', { target: { tagName: 'INPUT' } as any }));
		expect(f.nodes).toHaveLength(2);
		f.handleNodeDragStart('a', pointer());
		f.handleNodeDragMove('a', pointer(40, 20));
		f.handleKeyDown(key('Escape'));
		expect(f.nodes[0].position).toEqual({ x: 0, y: 0 });
		expect(f.history.canUndo).toBe(false);
	});
});

describe('groups and overlap', () => {
	it('reparents in absolute coordinates and rejects cycles', () => {
		const f = flow({
			data: { nodes: [{ ...node('g', 100, 100), type: 'group' }, node('a', 150, 130)], edges: [] }
		});
		f.setParent('a', 'g');
		expect(f.getNode('a')?.position).toEqual({ x: 50, y: 30 });
		f.setParent('g', 'a');
		expect(f.getNode('g')?.parentId).toBeUndefined();
		f.setParent('a', null);
		expect(f.getNode('a')?.position).toEqual({ x: 150, y: 130 });
	});
	it('chooses the deepest drop group and detaches outside it', () => {
		const f = flow({
			data: {
				nodes: [{ ...node('g', 100, 100), type: 'group', width: 300, height: 300 }, node('a')],
				edges: []
			}
		});
		f.handleNodeDragStart('a', pointer());
		f.handleNodeDragMove('a', pointer(150, 150));
		expect(f.dropTargetId).toBe('g');
		f.handleNodeDragEnd('a', pointer(150, 150));
		expect(f.getNode('a')?.parentId).toBe('g');
		expect(f.getNode('a')?.position).toEqual({ x: 50, y: 50 });
		f.history.undo();
		expect(f.getNode('a')?.parentId).toBeUndefined();
		expect(f.getNode('a')?.position).toEqual({ x: 0, y: 0 });
	});
	it('pushes overlaps only on request and rejects an overlapping drop', () => {
		const f = flow({ data: { nodes: [node('a'), node('b', 25, 10)], edges: [] } });
		f.resolveOverlaps(['a']);
		expect(f.getIntersectingNodes(f.nodes[0])).toHaveLength(0);
		f.history.undo();
		expect(f.nodes[0].position.x).toBe(0);
		const reject = flow({ interaction: { drag: { overlap: 'reject' } } });
		reject.handleNodeDragStart('a', pointer());
		reject.handleNodeDragMove('a', pointer(200, 0));
		reject.handleNodeDragEnd('a', pointer(200, 0));
		expect(reject.nodes[0].position).toEqual({ x: 0, y: 0 });
		expect(reject.history.canUndo).toBe(false);
	});
});

describe('inline edit', () => {
	it('groups edits into history, blocks gestures and commits or cancels', () => {
		const end = vi.fn(),
			f = flow({ interaction: { edit: { text: true } }, on: { editEnd: end } });
		f.startEditing('a');
		expect(f.editingId).toBe('a');
		expect(f.isNodeDraggable(f.nodes[0])).toBe(false);
		f.updateNodeData('a', { label: 'new' });
		f.updateNodeData('a', { label: 'newer' });
		f.handleKeyDown(key('Escape'));
		expect(f.nodes[0].data.label).toBe('a');
		expect(f.history.canUndo).toBe(false);
		expect(end.mock.calls[0][0].committed).toBe(false);
		f.startEditing('a');
		f.updateNodeData('a', { label: 'saved' });
		f.handleKeyDown(key('Enter'));
		expect(f.editingId).toBeNull();
		f.history.undo();
		expect(f.nodes[0].data.label).toBe('a');
	});
	it('supports per-type opt-in and an edit permission veto', () => {
		const f = flow({ nodeTypes: { default: { build: defaultCustom.node, editable: true } } });
		f.startEditing('a');
		expect(f.editingId).toBe('a');
		f.handlePanePointerDown(pointer());
		expect(f.editingId).toBeNull();
		const denied = flow({
			interaction: { edit: { text: true } },
			can: (gesture) => gesture !== 'edit'
		});
		denied.startEditing('a');
		expect(denied.editingId).toBeNull();
	});
});

describe('snap guides', () => {
	it('snaps in flow space and publishes guides without notifying unrelated nodes', () => {
		const f = flow({
			data: { nodes: [node('a'), node('b', 200, 100)], edges: [] },

			interaction: { drag: { snap: { guides: true, radius: 5 } } }
		});
		const guide = vi.fn(),
			other = vi.fn();
		f.guidesSignal.addListener(guide);
		f.nodeSignal('b').addListener(other);
		f.handleNodeDragStart('a', pointer());
		f.handleNodeDragMove('a', pointer(197, 70));
		expect(f.nodes[0].position.x).toBe(200);
		expect(f.guides.some((line) => line.axis === 'x')).toBe(true);
		expect(guide).toHaveBeenCalled();
		expect(other).not.toHaveBeenCalled();
		f.handleNodeDragEnd('a', pointer(197, 70));
		expect(f.guides).toEqual([]);
	});
});

describe('waypoint gestures', () => {
	it('inserts and moves a midpoint in one undo entry; cancellation restores it', () => {
		const f = flow({ interaction: { edit: { waypoints: true } } });
		f.handleReshapeStart('ab', 'midpoint', 0, pointer(100, 80));
		f.handleReshapeMove(pointer(150, 100));
		f.handleReshapeEnd();
		expect(f.edges[0].waypoints).toEqual([{ x: 150, y: 100 }]);
		f.history.undo();
		expect(f.edges[0].waypoints).toBeUndefined();
		f.history.redo();
		f.handleReshapeStart('ab', 'waypoint', 0, pointer(150, 100));
		f.handleReshapeMove(pointer(300, 100));
		f.cancelReshape();
		expect(f.edges[0].waypoints).toEqual([{ x: 150, y: 100 }]);
	});
});

describe('graph helpers', () => {
	it('collapses outgoing subtrees, handles cycles, and preserves explicitly hidden nodes', () => {
		const f = flow({
			data: {
				nodes: [node('a'), node('b'), { ...node('c'), hidden: true }],
				edges: [
					{ id: 'ab', source: 'a', target: 'b' },
					{ id: 'ba', source: 'b', target: 'a' }
				]
			}
		});
		f.collapse('a');
		expect(f.getVisibleNodes().map((n) => n.id)).toEqual(['a']);
		expect(f.hiddenChildCount('a')).toBe(1);
		expect(f.getVisibleEdges()).toHaveLength(0);
		f.expand('a');
		expect(f.getVisibleNodes().map((n) => n.id)).toEqual(['a', 'b']);
		expect(f.getNeighbours('a').nodes.map((n) => n.id)).toEqual(['b']);
		expect(f.getNeighbours('a').edges).toHaveLength(2);
	});
	it('collapses group children and nested collapsed states survive expansion', () => {
		const f = flow({
			data: {
				nodes: [
					{ ...node('g'), type: 'group' },
					{ ...node('a'), parentId: 'g' },
					{ ...node('b'), parentId: 'a' }
				],
				edges: []
			}
		});
		f.collapse('a');
		f.collapse('g');
		f.expand('g');
		expect(f.getVisibleNodes().map((n) => n.id)).toEqual(['g', 'a']);
	});
	it('splits an edge then deletes the middle node with reconnection, undoably', async () => {
		const f = flow();
		f.insertNodeOnEdge('ab', node('middle', 100));
		expect(f.edges.map((e) => [e.source, e.target])).toEqual([
			['a', 'middle'],
			['middle', 'b']
		]);
		await f.deleteElements(['middle'], { reconnect: true });
		expect(f.edges.map((e) => [e.source, e.target])).toEqual([['a', 'b']]);
		f.history.undo();
		expect(f.nodes.some((n) => n.id === 'middle')).toBe(true);
		expect(f.edges).toHaveLength(2);
	});
	it('aligns and distributes in absolute coordinates', () => {
		const f = flow({
			data: { nodes: [node('a', 0, 0), node('b', 40, 100), node('c', 400, 200)], edges: [] }
		});
		f.alignNodes(['a', 'b', 'c'], 'top');
		expect(f.nodes.map((n) => n.position.y)).toEqual([0, 0, 0]);
		f.distributeNodes(['a', 'b', 'c'], 'x');
		expect(f.nodes.map((n) => n.position.x)).toEqual([0, 200, 400]);
		f.history.undo();
		expect(f.nodes[1].position.x).toBe(40);
	});
});

describe('interaction regressions', () => {
	it('history preserves meaningful selected fields inside user data', () => {
		const f = flow();
		f.updateNodeData('a', { selected: true });
		expect(f.history.canUndo).toBe(true);
		f.history.undo();
		expect(f.nodes[0].data.selected).toBeUndefined();
	});
	it('cancels touch movement even when history is disabled', () => {
		const f = flow({ interaction: { history: { enabled: false } } });
		f.handleNodeDragStart('a', pointer());
		f.handleNodeDragMove('a', pointer(40, 30));
		f.handleNodeDragEnd('a', { ...pointer(40, 30), cancelled: true } as MouseEvent);
		expect(f.nodes[0].position).toEqual({ x: 0, y: 0 });
		expect(f.history.canUndo).toBe(false);
	});
	it('a midpoint click does not insert a waypoint', () => {
		const f = flow({ interaction: { edit: { waypoints: true } } });
		f.handleReshapeStart('ab', 'midpoint', 0, pointer(100, 100));
		f.handleReshapeEnd();
		expect(f.edges[0].waypoints).toBeUndefined();
		expect(f.history.canUndo).toBe(false);
	});
	it('pan-on-scroll works when pane drag is selection', () => {
		const f = flow({ interaction: { pane: { drag: 'select', scroll: 'pan' } } });
		f.handlePaneWheel({
			deltaMode: 0,
			deltaX: 0,
			deltaY: 100,
			preventDefault() {},
			stopPropagation() {}
		} as WheelEvent);
		expect(f.viewport.y).toBe(-50);
	});
});

it('disabling an active gesture clears its state and restores the mark', () => {
	const f = flow({ interaction: { edit: { waypoints: true } } });
	f.handleReshapeStart('ab', 'midpoint', 0, pointer(100, 100));
	f.handleReshapeMove(pointer(120, 100));
	f.setInteraction({ edit: { waypoints: false } });
	expect(f.activeEdgeHandle).toBeNull();
	expect(f.edges[0].waypoints).toBeUndefined();
	f.handleNodeDragStart('a', pointer());
	f.handleNodeDragMove('a', pointer(30, 30));
	f.setInteraction({ drag: { enabled: false } });
	expect(f.nodes[0].position).toEqual({ x: 0, y: 0 });
	expect(f.isDraggingNodes).toBe(false);
});

it('paste anchors the complete subgraph bounds, including children outside a group', () => {
	const f = flow({
		data: {
			nodes: [
				{ ...node('g', 100, 100), type: 'group' },
				{ ...node('a', -30, -20), parentId: 'g' }
			],
			edges: []
		}
	});
	const copied = f.putContent(f.getContent(['g']), { at: { x: 300, y: 400 } });
	expect(f.getNodePositionAbsolute(copied.nodes[1])).toEqual({ x: 300, y: 400 });
	expect(copied.nodes[0].position).toEqual({ x: 330, y: 420 });
});

it('overlap rejection still restores the drag origin when history is disabled', () => {
	const f = flow({ interaction: { history: { enabled: false }, drag: { overlap: 'reject' } } });
	f.handleNodeDragStart('a', pointer());
	f.handleNodeDragMove('a', pointer(200, 0));
	f.handleNodeDragEnd('a', pointer(200, 0));
	expect(f.nodes[0].position).toEqual({ x: 0, y: 0 });
	expect(f.history.canUndo).toBe(false);
});

it('layout leaves collapsed descendants in place until they are expanded', async () => {
	const { layeredLayout } = await import('../../../packages/diagram/src/engine');
	const f = flow({
		data: {
			nodes: [node('a'), node('b', 200), node('c', 777)],
			edges: [
				{ id: 'ab', source: 'a', target: 'b' },
				{ id: 'bc', source: 'b', target: 'c' }
			]
		}
	});
	f.collapse('b');
	await f.layout(layeredLayout, { direction: 'LR', fitView: false });
	expect(f.getNode('c')?.position.x).toBe(777);
	f.expand('b');
	await f.layout(layeredLayout, { direction: 'LR', fitView: false });
	expect(f.getNode('c')?.position.x).not.toBe(777);
});

it('hover survives transitions between parts of one node or edge', () => {
	const f = flow();
	f.hoverNode('a', pointer());
	f.hoverEdge('ab', pointer());
	const nodeChange = vi.fn(),
		edgeChange = vi.fn();
	f.nodeSignal('a').addListener(nodeChange);
	f.edgeSignal('ab').addListener(edgeChange);
	const move = pointer(20, 20);
	f.hoverNode('a', move);
	f.unhoverNode('a', move);
	f.hoverEdge('ab', move);
	f.unhoverEdge('ab', move);
	expect(f.hoveredNodeId).toBe('a');
	expect(f.hoveredEdgeId).toBe('ab');
	expect(nodeChange).not.toHaveBeenCalled();
	expect(edgeChange).not.toHaveBeenCalled();
	f.unhoverNode('a', pointer(500, 500));
	f.unhoverEdge('ab', pointer(500, 500));
	expect(f.hoveredNodeId).toBeNull();
	expect(f.hoveredEdgeId).toBeNull();
});

it.each(['pan', 'select'])(
	'a locked node press delegated to %s does not swallow subsequent history',
	(mode) => {
		const f = flow({ interaction: { drag: { enabled: false } } });
		f.handleNodeDragStart('a', pointer());
		if (mode === 'pan') {
			f.handleViewportInteractionStart();
			f.handleViewportInteractionEnd();
		} else {
			f.handleSelectionDragStart({ ...pointer(), shiftKey: true });
			f.handleSelectionDragEnd(pointer());
		}
		f.updateNodeData('a', { label: 'Edited after pane gesture' });
		expect(f.history.canUndo).toBe(true);
		f.history.undo();
		expect(f.getNode('a')?.data.label).toBe('a');
	}
);

describe('nested scene paint order', () => {
	it('resolves parent z once and interleaves edges below their endpoint nodes', () => {
		const f = flow({
			data: {
				nodes: [
					{ ...node('child-a'), parentId: 'inner' },
					{ ...node('child-b', 200), parentId: 'inner' },
					{ ...node('inner'), parentId: 'outer', type: 'group' },
					{ ...node('outer'), type: 'group', zIndex: 4 }
				],
				edges: [{ id: 'link', source: 'child-a', target: 'child-b' }]
			}
		});
		const order = () =>
			getSceneOrder(f).map((item) => (item.kind === 'node' ? item.node.id : item.edge.id));
		expect(f.nodes.map((n) => f.getNodeZIndex(n))).toEqual([6, 6, 5, 4]);
		expect(order()).toEqual(['outer', 'inner', 'link', 'child-a', 'child-b']);
		f.selectNodes(['child-a']);
		expect(f.getNodeZIndex(f.getNode('child-a')!)).toBe(1000);
		expect(order()).toEqual(['outer', 'inner', 'child-b', 'link', 'child-a']);
		f.selectEdges(['link']);
		expect(order().at(-1)).toBe('link');
		f.updateNode('outer', { zIndex: 2000 });
		expect(f.getNodeZIndex(f.getNode('child-a')!)).toBe(2002);
		expect(f.getNodeZIndex(f.getNode('child-b')!)).toBe(2002);
		f.setParent('child-b', null);
		expect(f.getNodeZIndex(f.getNode('child-b')!)).toBe(0);
		f.dispose();
	});
});
