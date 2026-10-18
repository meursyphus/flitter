import { buildAction } from '../../../packages/diagram/src/headless/flow-diagram/diagram';
import { describe, expect, it, vi } from 'vitest';
import {
	Constraints,
	GestureDetector,
	HitTestResult,
	Offset,
	Positioned,
	Size,
	Stack,
	StackFit,
	StatelessWidget,
	type BuildContext,
	StatefulWidget,
	type TextField,
	type Widget
} from 'flitter-core';
import RenderObject from '../../../packages/core/src/renderobject/RenderObject';
import type RenderObjectWidget from '../../../packages/core/src/widget/RenderObjectWidget';
import {
	FlowDiagramController,
	FlowSceneGroup,
	FlowSceneItem,
	type FlowDiagramContext,
	type FlowNode,
	type NodeCustomArgs
} from '../../../packages/diagram/src/engine';
import {
	defaultStyleConfig,
	defaultContextMenu,
	EditableLabel,
	type DefaultFlowConfig
} from '../../../packages/diagram/registry/templates/diagrams/flow-diagram/styles/default';
import { collapseSets } from '../../../packages/diagram/src/shared/interactions';

import { baseDefaults } from '../../../packages/diagram/registry/templates/diagrams/flow-diagram/base';
const defaultCustom = {
	...baseDefaults,
	...defaultStyleConfig.custom
} as import('../../../packages/diagram/src/engine').FlowDiagramCustom<any>;

const node = (id: string, extra: Partial<FlowNode> = {}): FlowNode => ({
	id,
	position: { x: 0, y: 0 },
	data: { label: 'Start' },
	...extra
});
function flow(nodes = [node('a'), node('b')], edges = [{ id: 'ab', source: 'a', target: 'b' }]) {
	const f = new FlowDiagramController() as FlowDiagramContext<DefaultFlowConfig>;
	f.configure({
		data: { nodes, edges },
		custom: defaultCustom,
		config: defaultStyleConfig.createConfig()
	});
	return f;
}
const key = (key: string, extra = {}) =>
	({
		key,
		ctrlKey: false,
		metaKey: false,
		shiftKey: false,
		altKey: false,
		preventDefault() {},
		...extra
	}) as KeyboardEvent;
const pointer = (x = 0, y = 0) =>
	({ button: 0, clientX: x, clientY: y, stopPropagation() {} }) as MouseEvent;

it.each(['viewer', { pane: { drag: 'select' }, select: { box: false } }] as const)(
	'disabled box selection leaves Shift available to pan: %j',
	(interaction) => {
		const f = flow();
		f.configure({
			data: { nodes: f.nodes, edges: f.edges },

			config: f.config,
			custom: defaultCustom,
			interaction
		});
		f.selectNodes(['a']);
		f.handleKeyDown(key('Shift', { shiftKey: true }));
		expect(f.panEnabled).toBe(true);
		expect(f.handleSelectionDragStart(pointer())).toBe(false);
		f.handleViewportInteractionStart();
		f.handleViewportInteractionUpdate({ focalPointDelta: { x: 30, y: 20 }, scale: 1 });
		f.handleViewportInteractionEnd();
		f.handlePaneClick(pointer(30, 20));
		expect(f.getSelectedNodes().map((n) => n.id)).toEqual(['a']);
		f.handlePanePointerDown(pointer());
		f.handlePaneClick(pointer());
		expect(f.getSelectedNodes()).toEqual([]);
	}
);

// Exercise the real overlay/layout/detector tree without a browser. Only font
// measurement is replaced; the menu, containers, flex layout and hit tests are real.
class TextBox extends RenderObject {
	constructor() {
		super({ isPainter: false });
	}
	protected override preformLayout() {
		this.size = this.constraints.constrain(new Size({ width: 70, height: 14 }));
	}
}
function render(widget: Widget, parent?: RenderObject, depth = 0): RenderObject {
	if (widget instanceof StatefulWidget) {
		const state = widget.createState();
		state.widget = widget;
		state.element = { markNeedsBuild() {} } as any;
		state.initState({} as BuildContext);
		return render(state.build({} as BuildContext), parent, depth);
	}
	if (widget.runtimeType !== '_Text' && widget instanceof StatelessWidget)
		return render(widget.build({} as BuildContext), parent, depth);
	const object =
		widget.runtimeType === '_Text'
			? new TextBox()
			: (widget as RenderObjectWidget).createRenderObject();
	const children =
		widget.runtimeType === '_Text'
			? []
			: ((widget as RenderObjectWidget).children ?? []).map((child) =>
					render(child, object, depth + 1)
				);
	object.parent = parent;
	object.ownerElement = {
		children: children.map((renderObject) => ({ renderObject })),
		depth
	} as any;
	object.renderOwner = {
		needsLayoutRenderObjects: [],
		requestVisualUpdate() {},
		markNeedsPaint() {},
		markNeedsPaintTransformUpdate() {},
		didChangePaintTransform() {},
		notifyZOrderChanged() {},
		disposeRenderObject() {}
	} as any;
	return object;
}

it('the default Duplicate item is hit at its screen-space position after layout', () => {
	const f = flow();
	f.openContextMenu({ kind: 'node', id: 'a' }, { x: 80, y: 95 });
	const duplicate = vi.spyOn(f, 'duplicate');
	const widget = Stack({
		fit: StackFit.expand,
		children: [
			Positioned.fill({
				child: new FlowSceneGroup({
					children: [
						new FlowSceneItem({
							x: 80,
							y: 95,
							child: GestureDetector({
								onClick: (event) => event.stopPropagation(),
								child: defaultContextMenu({ ...f.contextMenu!, action: buildAction }, f)
							})
						})
					]
				})
			})
		]
	});
	const root = render(widget);
	root.layout(Constraints.tightFor({ width: 560, height: 400 }));
	const hits = new HitTestResult();
	expect(root.hitTest(hits, new Offset({ x: 130, y: 110 }))).toBe(true);
	let stopped = false;
	for (const { target } of hits.path) {
		if ((target as any).isRenderGestureDetector)
			(target as any).invokeCallback('onClick', {
				stopPropagation() {
					stopped = true;
				}
			});
		if (stopped) break;
	}
	expect(duplicate).toHaveBeenCalledTimes(1);
	expect(duplicate).toHaveBeenCalledWith(['a']);
	expect(f.nodes).toHaveLength(3);
});

it('default menu Delete separates node and edge ids', async () => {
	const f = flow(),
		deleted = vi.spyOn(f, 'deleteElements');
	const widget = defaultContextMenu(
		{
			target: 'selection',
			action: buildAction,
			ids: ['a', 'ab'],
			position: { x: 0, y: 0 },
			screenPosition: { x: 0, y: 0 }
		},
		f
	);
	const root = render(widget);
	root.layout(new Constraints());
	const hits = new HitTestResult();
	expect(root.hitTest(hits, new Offset({ x: 40, y: 70 }))).toBe(true);
	let stopped = false;
	for (const { target } of hits.path) {
		if ((target as any).isRenderGestureDetector)
			(target as any).invokeCallback('onClick', {
				stopPropagation() {
					stopped = true;
				}
			});
		if (stopped) break;
	}
	expect(deleted).toHaveBeenCalledWith({ nodes: [{ id: 'a' }], edges: [{ id: 'ab' }] });
	await deleted.mock.results[0].value;
});

function editor(f: FlowDiagramContext<DefaultFlowConfig>) {
	const args: NodeCustomArgs = {
		node: f.getNode('a')!,
		isEditing: true,
		isSelected: true,
		isDragging: false,
		isHovered: false,
		isDraggable: false,
		isSelectable: false,
		isConnectable: false,
		positionAbsolute: { x: 0, y: 0 },
		zIndex: 0,
		isConnectionTarget: false,
		isResizable: false,
		isResizing: false,
		isDropTarget: false,
		isOverlapping: false,
		isCollapsed: false,
		hiddenChildCount: 0,
		isNeighbour: false
	};
	const widget = EditableLabel(args, f) as StatefulWidget,
		state = widget.createState();
	state.widget = widget;
	state.initState({} as BuildContext);
	const field = state.build({} as BuildContext) as ReturnType<typeof TextField>;
	const focus = field.focusNode!;
	focus.attach(
		() => focus.updateFocus(true),
		() => {
			focus.updateFocus(false);
			field.onBlurred?.();
		}
	);
	focus.requestFocus();
	const type = (text: string) => {
		for (let i = 1; i <= text.length; i++) {
			field.controller!.text = text.slice(0, i);
			field.onChanged?.(text.slice(0, i));
		}
	};
	return { state, field, type, focus };
}

it('commit, reopen, cancel and undo are one edit, even with delayed input/blur callbacks', () => {
	const f = flow();
	f.setInteraction({ edit: { text: true }, keys: { undo: 'Control+z' } });
	f.startEditing('a');
	const first = editor(f);
	expect(first.field.controller!.selection).toEqual({ start: 0, end: 5 });
	first.type('Renamed');
	expect((first.state.build({} as BuildContext) as ReturnType<typeof TextField>).controller).toBe(
		first.field.controller
	);
	first.field.onSubmitted?.('Renamed');
	expect(first.focus.hasFocus).toBe(false);
	expect(f.editingId).toBeNull();
	first.field.onChanged?.('late input');
	expect(f.nodes[0].data.label).toBe('Renamed');
	f.startEditing('a');
	const second = editor(f);
	first.field.onBlurred?.();
	expect(f.editingId).toBe('a'); // old editor teardown must not close the new session
	second.type('Cancel me');
	f.handleKeyDown(key('Escape'));
	expect(second.focus.hasFocus).toBe(false);
	expect(f.nodes[0].data.label).toBe('Renamed');
	second.field.onChanged?.('C');
	second.field.onBlurred?.();
	f.handleKeyDown(key('z', { ctrlKey: true }));
	expect(f.nodes[0].data.label).toBe('Start');
	expect(f.history.canUndo).toBe(false);
	first.state.dispose();
	second.state.dispose();
});

describe('collapse reachability', () => {
	it('walks the complete chain and counts every hidden descendant', () => {
		const f = flow(
			[node('a'), node('b'), node('c')],
			[
				{ id: 'ab', source: 'a', target: 'b' },
				{ id: 'bc', source: 'b', target: 'c' }
			]
		);
		f.collapse('a');
		expect(f.getVisibleNodes().map((n) => n.id)).toEqual(['a']);
		expect(f.hiddenChildCount('a')).toBe(2);
		expect(f.getVisibleEdges()).toEqual([]);
		f.expand('a');
		expect(f.getVisibleNodes()).toHaveLength(3);
	});
	it('preserves a shared downstream branch reached from a visible outsider', () => {
		const nodes = ['a', 'b', 'c', 'd', 'outside'].map((id) => node(id, { collapsed: id === 'a' }));
		const edges = [
			{ source: 'a', target: 'b' },
			{ source: 'b', target: 'c' },
			{ source: 'c', target: 'd' },
			{ source: 'outside', target: 'c' }
		];
		expect([...collapseSets(nodes, edges).get('a')!]).toEqual(['b']);
		expect([
			...collapseSets(
				nodes.map((n) => (n.id === 'outside' ? { ...n, hidden: true } : n)),
				edges
			).get('a')!
		]).toEqual(['b', 'c', 'd']);
	});
	it('a cycle inside a hidden subtree cannot make itself visible', () => {
		const nodes = [node('a', { collapsed: true }), node('b'), node('c')];
		expect([
			...collapseSets(nodes, [
				{ source: 'a', target: 'b' },
				{ source: 'b', target: 'c' },
				{ source: 'c', target: 'b' }
			]).get('a')!
		]).toEqual(['b', 'c']);
	});
	it('body collapse hides direct children only, preserving nested collapse state', () => {
		const nodes = [
			node('g', { collapsed: true }),
			node('child', { parentId: 'g' }),
			node('grandchild', { parentId: 'child' })
		];
		expect([...collapseSets(nodes, []).get('g')!]).toEqual(['child']);
		nodes[1].collapsed = true;
		const sets = collapseSets(nodes, []);
		expect([...sets.get('g')!]).toEqual(['child']);
		expect([...sets.get('child')!]).toEqual(['grandchild']);
	});
});
