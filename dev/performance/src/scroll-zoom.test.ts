import { describe, expect, it, vi } from 'vitest';
import {
	Axis,
	Constraints,
	Container,
	Matrix4,
	Offset,
	ScrollController,
	Size,
	TransformationController,
	ClampingScrollPhysics,
	NeverScrollableScrollPhysics
} from 'flitter-core';
import BaseScrollViewport from '../../../packages/core/src/component/base/BaseScrollViewport';
import RenderObject from '../../../packages/core/src/renderobject/RenderObject';

class Content extends RenderObject {
	constructor(
		public width: number,
		public height: number
	) {
		super({ isPainter: false });
	}
	protected override preformLayout(): void {
		this.size = this.constraints.constrain(new Size({ width: this.width, height: this.height }));
	}
}

function viewport(axis = Axis.vertical, reverse = false) {
	const controller = new ScrollController();
	const props = { child: Container({}), controller, scrollDirection: axis, reverse };
	const render = new BaseScrollViewport(props).createRenderObject();
	const content = new Content(600, 800);
	const owner = {
		needsLayoutRenderObjects: [],
		requestVisualUpdate() {},
		markNeedsPaint() {},
		markNeedsPaintTransformUpdate() {},
		didChangePaintTransform() {},
		disposeRenderObject() {}
	} as any;
	render.renderOwner = content.renderOwner = owner;
	render.ownerElement = { children: [{ renderObject: content }], depth: 0 } as any;
	content.ownerElement = { children: [], depth: 1 } as any;
	content.parent = render;
	const layout = () => {
		render.update(props);
		render.layout(Constraints.tight({ width: 200, height: 150 }));
	};
	layout();
	return { render, content, controller, layout };
}

describe('scroll viewport', () => {
	it.each([Axis.vertical, Axis.horizontal])(
		'lays out axis %s unbounded and clamps after content shrinks',
		(axis) => {
			const { render, content, controller, layout } = viewport(axis);
			expect(render.size).toEqual(new Size({ width: 200, height: 150 }));
			expect(
				axis === Axis.vertical ? content.constraints.maxHeight : content.constraints.maxWidth
			).toBe(Infinity);
			expect(controller.maxScrollExtent).toBe(axis === Axis.vertical ? 650 : 400);
			controller.jumpTo(10000);
			layout();
			expect(axis === Axis.vertical ? content.offset.y : content.offset.x).toBe(
				-controller.maxScrollExtent
			);
			content.width = content.height = 40;
			(content as any).markNeedsLayout();
			layout();
			expect(controller.maxScrollExtent).toBe(0);
			expect(controller.offset).toBe(0);
		}
	);

	it('starts reverse scroll at the trailing edge', () => {
		const { content, controller, layout } = viewport(Axis.vertical, true);
		expect(content.offset.y).toBe(-650);
		controller.jumpTo(100);
		layout();
		expect(content.offset.y).toBe(-550);
	});

	it('rejects an unbounded viewport with a useful error', () => {
		const { render } = viewport();
		expect(() => render.layout(new Constraints())).toThrow('bounded constraints');
	});
});

describe('controllers and physics', () => {
	it('notifies on metrics and position changes and animates to a clamped target', async () => {
		const controller = new ScrollController({ initialScrollOffset: 50 });
		const listener = vi.fn();
		controller.addListener(listener);
		controller.updateMetrics({ maxScrollExtent: 100, viewportDimension: 40 });
		await controller.animateTo(300, { duration: 0 });
		expect(controller.offset).toBe(100);
		expect(listener).toHaveBeenCalledTimes(2);
		controller.dispose();
		expect(() => controller.jumpTo(0)).toThrow('disposed');
	});

	it('converts coordinates through a transform and releases listeners', () => {
		const matrix = Matrix4.translationValues(20, -30, 0);
		matrix.multiplyMatrix(Matrix4.diagonal3Values(2, 2, 1));
		const controller = new TransformationController(matrix);
		const scene = new Offset({ x: 7, y: 11 });
		expect(controller.toViewport(scene)).toEqual(new Offset({ x: 34, y: -8 }));
		expect(controller.toScene(controller.toViewport(scene))).toEqual(scene);
		const listener = vi.fn();
		controller.addListener(listener);
		controller.value = Matrix4.identity();
		expect(listener).toHaveBeenCalledOnce();
		controller.dispose();
		expect(() => {
			controller.value = matrix;
		}).toThrow('disposed');
		expect(() => new TransformationController(Matrix4.zero()).toScene(scene)).toThrow('singular');
	});

	it('clamps physics and disables user scrolling without disabling controller changes', () => {
		const controller = new ScrollController();
		controller.updateMetrics({ maxScrollExtent: 100, viewportDimension: 40 });
		expect(new ClampingScrollPhysics().applyBoundaryConditions(controller, 130)).toBe(30);
		expect(new NeverScrollableScrollPhysics().shouldAcceptUserOffset()).toBe(false);
		expect(
			new NeverScrollableScrollPhysics().createBallisticSimulation(controller, 100)
		).toBeNull();
		controller.jumpTo(40);
		expect(controller.offset).toBe(40);
	});
});
