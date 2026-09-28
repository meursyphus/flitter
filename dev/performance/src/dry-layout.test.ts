import { describe, expect, it } from 'vitest';
import {
	Alignment,
	Axis,
	Constraints,
	CrossAxisAlignment,
	EdgeInsets,
	MainAxisAlignment,
	MainAxisSize,
	Size,
	VerticalDirection
} from 'flitter-core';
import RenderObject from '../../../packages/core/src/renderobject/RenderObject';
import BaseAlign from '../../../packages/core/src/component/base/BaseAlign';
import BaseConstrainedBox from '../../../packages/core/src/component/base/BaseConstrainedBox';
import BaseFlex from '../../../packages/core/src/component/base/BaseFlex';
import BasePadding from '../../../packages/core/src/component/base/BasePadding';

function createRenderOwnerStub() {
	return {
		needsLayoutRenderObjects: [] as RenderObject[],
		requestVisualUpdate() {},
		markNeedsPaint() {},
		markNeedsPaintTransformUpdate() {},
		didChangePaintTransform() {},
		notifyZOrderChanged() {},
		disposeRenderObject() {}
	} as any;
}

function attachRenderTree(
	renderObject: RenderObject,
	children: RenderObject[] = [],
	renderOwner = createRenderOwnerStub(),
	depth = 0
) {
	renderObject.renderOwner = renderOwner;
	renderObject.ownerElement = {
		children: children.map((child) => ({ renderObject: child })),
		depth
	} as any;

	children.forEach((child) => {
		child.parent = renderObject;
		attachRenderTree(child, [], renderOwner, depth + 1);
	});

	return renderObject;
}

function expectSize(size: Size, width: number, height: number) {
	expect(size.width).toBe(width);
	expect(size.height).toBe(height);
}

function expectOffset(offset: { x: number; y: number }, x: number, y: number) {
	expect(offset.x).toBe(x);
	expect(offset.y).toBe(y);
}

class FixedRenderObject extends RenderObject {
	dryLayoutCalls = 0;
	layoutCalls = 0;
	readonly baseSize: Size;

	constructor({ width, height }: { width: number; height: number }) {
		super({ isPainter: false });
		this.baseSize = new Size({ width, height });
	}

	protected override computeDryLayout(constraints: Constraints): Size {
		this.dryLayoutCalls += 1;
		return constraints.constrain(this.baseSize);
	}

	protected override preformLayout(): void {
		this.layoutCalls += 1;
		this.size = this.constraints.constrain(this.baseSize);
	}
}

class TrackingSizedByParentRenderObject extends RenderObject {
	dryLayoutCalls = 0;
	order: string[] = [];

	constructor() {
		super({ isPainter: false });
	}

	protected override get sizedByParent(): boolean {
		return true;
	}

	protected override computeDryLayout(constraints: Constraints): Size {
		this.dryLayoutCalls += 1;
		return constraints.constrain(new Size({ width: 40, height: 20 }));
	}

	protected override performResize(): void {
		this.order.push('resize');
		super.performResize();
	}

	protected override preformLayout(): void {
		this.order.push('layout');
	}
}

describe('dry layout', () => {
	it('caches getDryLayout results and invalidates them on markNeedsLayout', () => {
		const renderObject = attachRenderTree(new TrackingSizedByParentRenderObject());
		const constraints = Constraints.loose({ width: 120, height: 80 });

		const first = renderObject.getDryLayout(constraints);
		const second = renderObject.getDryLayout(constraints);

		expect(first).toBe(second);
		expect(renderObject.dryLayoutCalls).toBe(1);

		(renderObject as any).markNeedsLayout();
		renderObject.getDryLayout(constraints);

		expect(renderObject.dryLayoutCalls).toBe(2);
	});

	it('runs performResize before performLayout for sizedByParent render objects', () => {
		const renderObject = attachRenderTree(new TrackingSizedByParentRenderObject());

		renderObject.layout(Constraints.loose({ width: 120, height: 80 }));

		expect(renderObject.order).toEqual(['resize', 'layout']);
		expectSize(renderObject.size, 40, 20);
	});

	it('keeps ConstrainedBox dry layout side-effect free and matches wet layout', () => {
		const child = new FixedRenderObject({ width: 12, height: 10 });
		const renderObject = attachRenderTree(
			new BaseConstrainedBox({
				constraints: Constraints.tightFor({ width: 80, height: 40 })
			}).createRenderObject(),
			[child]
		);
		const constraints = Constraints.loose({ width: 200, height: 200 });

		const drySize = renderObject.getDryLayout(constraints);

		expectSize(drySize, 80, 40);
		expect(child.layoutCalls).toBe(0);
		expect(child.dryLayoutCalls).toBe(1);

		renderObject.layout(constraints);

		expectSize(renderObject.size, 80, 40);
		expect(child.layoutCalls).toBe(1);
	});

	it('computes padding dry layout from child dry size plus insets', () => {
		const child = new FixedRenderObject({ width: 30, height: 20 });
		const renderObject = attachRenderTree(
			new BasePadding({
				padding: EdgeInsets.symmetric({ horizontal: 4, vertical: 2 })
			}).createRenderObject(),
			[child]
		);
		const constraints = Constraints.loose({ width: 200, height: 200 });

		const drySize = renderObject.getDryLayout(constraints);

		expectSize(drySize, 38, 24);
		expect(child.layoutCalls).toBe(0);
		expect(child.dryLayoutCalls).toBe(1);

		renderObject.layout(constraints);

		expectSize(renderObject.size, 38, 24);
		expectOffset(child.offset, 4, 2);
	});

	it('treats bounded Align without factors as sizedByParent', () => {
		const child = new FixedRenderObject({ width: 40, height: 20 });
		const renderObject = attachRenderTree(
			new BaseAlign({
				alignment: Alignment.center
			}).createRenderObject(),
			[child]
		);
		const constraints = Constraints.tightFor({ width: 100, height: 80 });

		const drySize = renderObject.getDryLayout(constraints);

		expectSize(drySize, 100, 80);
		expect(child.layoutCalls).toBe(0);
		expect(child.dryLayoutCalls).toBe(1);

		renderObject.layout(constraints);

		expectSize(renderObject.size, 100, 80);
		expectOffset(child.offset, 30, 30);
	});

	it('matches Flex dry layout with wet layout without laying out children', () => {
		const firstChild = new FixedRenderObject({ width: 20, height: 10 });
		const secondChild = new FixedRenderObject({ width: 30, height: 40 });
		const renderObject = attachRenderTree(
			new BaseFlex({
				children: [],
				direction: Axis.horizontal,
				mainAxisAlignment: MainAxisAlignment.start,
				crossAxisAlignment: CrossAxisAlignment.center,
				verticalDirection: VerticalDirection.down,
				mainAxisSize: MainAxisSize.min
			}).createRenderObject(),
			[firstChild, secondChild]
		);
		const constraints = Constraints.loose({ width: 200, height: 200 });

		const drySize = renderObject.getDryLayout(constraints);

		expectSize(drySize, 50, 40);
		expect(firstChild.layoutCalls).toBe(0);
		expect(secondChild.layoutCalls).toBe(0);
		expect(firstChild.dryLayoutCalls).toBeGreaterThan(0);
		expect(secondChild.dryLayoutCalls).toBeGreaterThan(0);

		renderObject.layout(constraints);

		expectSize(renderObject.size, 50, 40);
	});

	it('only reports tight constraints when both axes are tight', () => {
		expect(Constraints.tightFor({ width: 20 }).isTight).toBe(false);
		expect(Constraints.tightFor({ width: 20, height: 10 }).isTight).toBe(true);
	});
});
