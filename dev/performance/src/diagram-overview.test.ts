import { afterEach, describe, expect, it } from 'vitest';
import { Constraints, type BuildContext, type StatefulWidget } from 'flitterjs';
import type { FlowDiagramProps } from '../../../packages/diagram/src/engine';
import CustomizationDemo, {
	CustomizationModel,
	defaultCustomization
} from '../../../docs/src/app/diagram/_overview/customization';

const context = {
	scheduler: { addPostFrameCallbacks() {}, ensureVisualUpdate() {} }
} as unknown as BuildContext;
const mounted: { dispose(): void }[] = [];
afterEach(() => mounted.splice(0).forEach((state) => state.dispose()));

function findFlow(widget: any): FlowDiagramProps<any> {
	if (widget.props?.custom && widget.props?.data) return widget.props;
	if (widget.builder)
		return findFlow(widget.builder(context, Constraints.tightFor({ width: 900, height: 520 })));
	for (const child of widget.children ?? (widget.child ? [widget.child] : [])) {
		const flow = findFlow(child);
		if (flow) return flow;
	}
	return null!;
}
function mount() {
	const model = new CustomizationModel();
	const widget = CustomizationDemo('light', model) as StatefulWidget;
	const state = widget.createState() as any;
	state.widget = widget;
	state.element = { markNeedsBuild() {} };
	state.initState(context);
	mounted.push(state);
	const rebuild = () => {
		const props = findFlow(state.build());
		state.flow.configure(props);
		return props;
	};
	const props = rebuild();
	state.flow.setPaneSize(900, 520);
	return { model, flow: props.controller!, props, rebuild };
}

describe('overview widget replacement', () => {
	it('preserves moved nodes, added connections, selection and undo when replacing visuals', () => {
		const { model, flow, props, rebuild } = mount();
		const originalPosition = { ...flow.getNode('orders')!.position };
		flow.updateNode('orders', { position: { x: 40, y: 170 } });
		flow.addEdges({ id: 'added', source: 'ship', target: 'notify' });
		flow.selectNodes(['orders']);

		for (const node of ['circle', 'chart', 'card'] as const) {
			model.change('node', node);
			model.change('edge', 'pulse');
			model.change('controls', 'rail');
			const next = rebuild();
			expect(next.controller).toBe(flow);
			expect(next.data.nodes).toBe(props.data.nodes);
			expect(flow.getNode('orders')!.position).toEqual({ x: 40, y: 170 });
			expect(flow.getNode('orders')!.selected).toBe(true);
			expect(flow.edges.map((edge) => edge.id)).toContain('added');
			expect(flow.isNodeDraggable(flow.getNode('orders')!)).toBe(true);
		}
		flow.history.undo();
		expect(flow.edges.map((edge) => edge.id)).not.toContain('added');
		expect(flow.getNode('orders')!.position).toEqual({ x: 40, y: 170 });
		flow.history.undo();
		expect(flow.getNode('orders')!.position).toEqual(originalPosition);
	});

	it('updates the rendered connection geometry with its replacement widgets', () => {
		const { model, flow, rebuild } = mount();
		const edge = flow.edges.find((edge) => edge.id === 'validate-ship')!;
		const original = flow.getEdgeEndpoints(edge)!;
		model.change('node', 'circle');
		model.change('edge', 'line');
		rebuild();
		const circle = flow.getEdgeEndpoints(edge)!;
		expect(circle.sourceX).not.toBe(original.sourceX);
		expect(circle.sourceY).not.toBe(original.sourceY);
		const line = flow.getEdgePath(edge, circle);
		expect(line.commands.map((command) => command.type)).toEqual(['M', 'L']);
		model.change('edge', 'curve');
		rebuild();
		expect(flow.getEdgePath(edge, circle).commands.map((command) => command.type)).toEqual([
			'M',
			'C'
		]);
	});

	it('does not reset the current choice while the docs rerender and unsubscribes cleanly', () => {
		const model = new CustomizationModel();
		let notifications = 0;
		const unsubscribe = model.subscribe(() => notifications++);
		model.change('node', 'chart');
		const snapshot = model.getSnapshot();
		model.change('node', 'chart');
		expect(model.getSnapshot()).toBe(snapshot);
		expect(notifications).toBe(1);
		unsubscribe();
		model.reset();
		expect(model.getSnapshot()).toEqual(defaultCustomization);
		expect(notifications).toBe(1);
	});
});
