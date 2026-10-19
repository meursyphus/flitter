import { describe, expect, it } from 'vitest';
import { Matrix4, Offset, Size, SizedBox, type RenderObject } from 'flitterjs';
import { FlowNodeItem } from '../../../packages/diagram/src/engine';
import { diagramLayoutSnapshot } from '../../../docs/src/components/diagram-layout-snapshot';

function group(children: RenderObject[], key?: string, transform = Matrix4.identity()) {
	return {
		offset: Offset.zero(),
		size: new Size({ width: 350, height: 320 }),
		ownerElement: { widget: { key } },
		applyPaintTransform: (parent: Matrix4) =>
			(() => {
				const result = parent.clone();
				result.multiplyMatrix(transform);
				return result;
			})(),
		visitChildren: (visit: (child: RenderObject) => void) => children.forEach(visit)
	} as unknown as RenderObject;
}

describe('gallery layout snapshots', () => {
	it('reports full node bounds, even when a node extends beyond the stage clip', () => {
		const node = new FlowNodeItem({
			body: SizedBox.shrink(),
			attachments: [],
			placements: [],
			x: 0,
			y: 0,
			measureId: 'first'
		}).createRenderObject();
		node.renderOwner = { markNeedsPaintTransformUpdate() {} } as any;
		node.offset = new Offset({ x: 40, y: 80 });
		node.size = new Size({ width: 250, height: 96 });
		node.ownerElement = { widget: {}, children: [] } as any;
		const root = group(
			[node],
			undefined,
			Matrix4.identity().translated(300, -100).scaled(0.8, 0.8, 1)
		);
		const snapshot = diagramLayoutSnapshot(root);
		expect(snapshot.nodes).toEqual([
			{ id: 'first', x: 332, y: -36, width: 200, height: expect.closeTo(76.8), scale: 0.8 }
		]);
		// Browser assertions see the actual overflow, not the clipped SVG glyph rectangle.
		expect(snapshot.nodes[0].x + snapshot.nodes[0].width).toBeGreaterThan(350);
		expect(snapshot.nodes[0].y).toBeLessThan(0);
	});
	it('reports whole hint/status panels and omits collapsed hints', () => {
		const hint = group([], 'diagram-hint'),
			status = group([], 'diagram-status'),
			hidden = group([], 'diagram-hint');
		hint.size = new Size({ width: 220, height: 24 });
		status.size = new Size({ width: 220, height: 50 });
		status.offset = new Offset({ x: 0, y: 32 });
		hidden.size = Size.zero;
		const snapshot = diagramLayoutSnapshot(group([hint, status, hidden]));
		expect(snapshot.panels).toHaveLength(2);
		expect(snapshot.panels[0].y + snapshot.panels[0].height).toBeLessThan(snapshot.panels[1].y);
	});
});
