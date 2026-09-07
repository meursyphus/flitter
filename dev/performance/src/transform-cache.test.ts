import { afterEach, describe, expect, it, vi } from 'vitest';
import { Matrix4, Offset, Size, HitTestResult } from 'flitter-core';
import Transform from '../../../packages/core/src/component/base/BaseTransform';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('transform caches', () => {
	it('reuses inverse matrices until transform or alignment geometry changes', () => {
		const widget = Transform.scale({ scale: 2 });
		const render = widget.createRenderObject() as Parameters<Transform['updateRenderObject']>[0];
		const hitTest = vi.fn((_result: HitTestResult, _position: Offset) => true);
		const owner = {
			markNeedsPaint: vi.fn(),
			markNeedsPaintTransformUpdate: vi.fn(),
			needsLayoutRenderObjects: [],
			requestVisualUpdate: vi.fn()
		};
		render.renderOwner = owner as unknown as typeof render.renderOwner;
		render.ownerElement = {
			children: [{ renderObject: { offset: Offset.Constants.zero, hitTest } }]
		} as unknown as typeof render.ownerElement;
		render.size = new Size({ width: 100, height: 100 });
		render.needsLayout = false;
		const inverse = vi.spyOn(Matrix4.prototype, 'copyInverse');
		for (let i = 0; i < 100; i++)
			render.hitTestChildren(new HitTestResult(), new Offset({ x: 50, y: 50 }));
		expect(inverse).toHaveBeenCalledTimes(1);
		expect(hitTest.mock.calls[0][1]).toEqual(new Offset({ x: 50, y: 50 }));
		Transform.scale({ scale: 3 }).updateRenderObject(render);
		expect(render.needsLayout).toBe(false);
		render.hitTestChildren(new HitTestResult(), new Offset({ x: 50, y: 50 }));
		expect(inverse).toHaveBeenCalledTimes(2);
		render.size = new Size({ width: 200, height: 200 });
		render.hitTestChildren(new HitTestResult(), new Offset({ x: 100, y: 100 }));
		expect(inverse).toHaveBeenCalledTimes(3);
		expect(hitTest.mock.calls.at(-1)![1].x).toBeCloseTo(100);
		expect(hitTest.mock.calls.at(-1)![1].y).toBeCloseTo(100);
	});

	it('handles singular matrices and pure translations without stale inverses', () => {
		const widget = Transform.scale({ scale: 0 });
		const render = widget.createRenderObject() as Parameters<Transform['updateRenderObject']>[0];
		const hitTest = vi.fn((_result: HitTestResult, _position: Offset) => true);
		render.renderOwner = {
			markNeedsPaint() {},
			markNeedsPaintTransformUpdate() {}
		} as unknown as typeof render.renderOwner;
		render.ownerElement = {
			children: [{ renderObject: { offset: Offset.Constants.zero, hitTest } }]
		} as unknown as typeof render.ownerElement;
		render.size = new Size({ width: 100, height: 100 });
		expect(render.hitTestChildren(new HitTestResult(), Offset.Constants.zero)).toBe(false);
		Transform.translate({ offset: new Offset({ x: 10, y: 20 }) }).updateRenderObject(render);
		expect(render.hitTestChildren(new HitTestResult(), new Offset({ x: 15, y: 25 }))).toBe(true);
		expect(hitTest.mock.calls[0][1]).toEqual(new Offset({ x: 5, y: 5 }));
	});
});
