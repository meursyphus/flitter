import { describe, expect, it } from "vitest";
import { Matrix4, Rect } from "flitter-core";
import { inverseTransformBounds } from "../../../packages/core/src/component/base/BaseTransform";

/*
  A compositing Transform records its child picture before the layer
  transform applies, so the recording must cover the parent's visible region
  mapped back into child coordinates (otherwise a zoomed-out scene is culled
  to the untransformed viewport). These pin that mapping.
*/
const view = Rect.fromLTWH({ left: 0, top: 0, width: 400, height: 300 });
const ltrb = (rect: Rect) => [rect.left, rect.top, rect.right, rect.bottom];

describe("inverseTransformBounds", () => {
	it("returns the viewport for an identity transform", () => {
		expect(ltrb(inverseTransformBounds(Matrix4.identity(), view))).toEqual([0, 0, 400, 300]);
	});

	it("shifts the viewport back through a pure translation", () => {
		const translated = inverseTransformBounds(Matrix4.translationValues(50, -20, 0), view);
		expect(ltrb(translated)).toEqual([-50, 20, 350, 320]);
	});

	it("grows the region for a zoom-out and applies the offset", () => {
		// viewport-space = translate(100, 60) * scale(0.5) * child-space
		const matrix = Matrix4.translationValues(100, 60, 0);
		matrix.multiplyMatrix(Matrix4.diagonal3Values(0.5, 0.5, 1));
		const region = inverseTransformBounds(matrix, view);
		expect(ltrb(region)).toEqual([-200, -120, 600, 480]);
	});

	it("takes the bounding box of a rotated viewport", () => {
		const rotation = Matrix4.identity();
		rotation.rotateZ(Math.PI / 2);
		const region = inverseTransformBounds(rotation, view);
		expect(region.left).toBeCloseTo(0);
		expect(region.top).toBeCloseTo(-400);
		expect(region.right).toBeCloseTo(300);
		expect(region.bottom).toBeCloseTo(0);
	});

	it("aligns to physical pixels so backing canvases can be recycled", () => {
		const matrix = Matrix4.translationValues(10.3, 5.7, 0);
		matrix.multiplyMatrix(Matrix4.diagonal3Values(0.75, 0.75, 1));
		const region = inverseTransformBounds(matrix, view, 2);
		for (const value of ltrb(region)) expect(Number.isInteger(value * 2)).toBe(true);
		const inner = inverseTransformBounds(matrix, view, 1);
		expect(region.left).toBeLessThanOrEqual(inner.left + 0.5);
		expect(region.right).toBeGreaterThanOrEqual(inner.right - 0.5);
	});

	it("falls back to the viewport for a singular matrix", () => {
		expect(ltrb(inverseTransformBounds(Matrix4.zero(), view))).toEqual([0, 0, 400, 300]);
	});

	it("clamps extreme zoom-outs to a pixel budget around the centre", () => {
		const region = inverseTransformBounds(Matrix4.diagonal3Values(0.01, 0.01, 1), view, 2);
		expect(region.width * region.height * 4).toBeLessThanOrEqual(64_000_000 + 1e6);
		expect(region.left + region.width / 2).toBeCloseTo(20000, 0);
		expect(region.top + region.height / 2).toBeCloseTo(15000, 0);
	});
});
