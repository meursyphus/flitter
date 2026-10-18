import { describe, expect, it } from 'vitest';
import { SizedBox } from 'flitter-core';
import HeadlessFlowDiagram from '../../../packages/diagram/src/headless/flow-diagram';
import {
	FlowDiagramController,
	type FlowDiagramCustom
} from '../../../packages/diagram/src/engine';
import FlowDiagram from '../../../packages/diagram/registry/templates/diagrams/flow-diagram';
import { baseDefaults } from '../../../packages/diagram/registry/templates/diagrams/flow-diagram/base';
import { defaultStyleConfig } from '../../../packages/diagram/registry/templates/diagrams/flow-diagram/styles/default';

const data = { nodes: [{ id: 'a', position: { x: 0, y: 0 }, data: {} }], edges: [] };

describe('chart-shaped diagram composition', () => {
	it('creates and updates the provider controller without replacing its per-id signals', () => {
		const custom = { ...baseDefaults, ...defaultStyleConfig.custom } as FlowDiagramCustom<any>;
		const first = HeadlessFlowDiagram({ data, custom }) as any;
		const controller = first.create() as FlowDiagramController;
		const signal = controller.nodeSignal('a');
		const nextData = {
			...data,
			nodes: data.nodes.map((node) => ({ ...node, position: { x: 50, y: 20 } }))
		};
		const second = HeadlessFlowDiagram({
			data: nextData,
			custom,
			config: { marker: 'updated' }
		}) as any;
		second.update(controller);
		expect(controller.nodeSignal('a')).toBe(signal);
		expect(controller.getNode('a')?.position).toEqual({ x: 50, y: 20 });
		expect(controller.config).toEqual({ marker: 'updated' });
		controller.dispose();
	});

	it('uses an externally supplied controller and remounts when that controller changes', () => {
		const a = new FlowDiagramController(),
			b = new FlowDiagramController();
		const first = FlowDiagram({ data, controller: a }) as any;
		const update = FlowDiagram({ data, controller: a }) as any;
		const replacement = FlowDiagram({ data, controller: b }) as any;
		expect(first.create()).toBe(a);
		expect(update.key).toBe(first.key);
		expect(replacement.key).not.toBe(first.key);
		a.dispose();
		b.dispose();
	});

	it('merges structural defaults, style visuals, user slots and nested config like a chart', () => {
		const node = () => SizedBox.shrink();
		const layout = () => SizedBox.shrink();
		const provider = FlowDiagram({
			data,
			config: { controls: { visible: false } },
			custom: { node, layout }
		}) as any;
		const controller = provider.create() as FlowDiagramController;
		expect(controller.custom.node).toBe(node);
		expect(controller.custom.layout).toBe(layout);
		expect(controller.custom.nodeBox).toBe(baseDefaults.nodeBox);
		expect(controller.custom.edgeBox).toBe(baseDefaults.edgeBox);
		expect(controller.custom.controls).toBe(defaultStyleConfig.custom.controls);
		expect(controller.config).toMatchObject({
			controls: { visible: false, buttonSize: 26 },
			minimap: { visible: true }
		});
		expect(
			controller.getHandleSpecs({ ...data.nodes[0], type: 'input' }).map((h) => h.type)
		).toEqual(['source']);
		expect(controller.getHandleSpecs({ ...data.nodes[0], type: 'group' })).toEqual([]);
		controller.dispose();
	});
});
