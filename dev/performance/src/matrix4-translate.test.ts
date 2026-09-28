import { describe, expect, it } from "vitest";
import Matrix4 from "../../../packages/core/src/type/_types/_matrix4";

/*
  Matrix4.translate() has a fast path for identity/translation-only affine
  matrices (the dominant case in the paint-transform work). These tests pin that
  it is numerically identical to the general 4x4 multiply for that matrix shape,
  and that it is correctly NOT taken for matrices with scale/rotation.
*/
function generalTranslate(
	storage: readonly number[],
	tx: number,
	ty: number,
	tz: number,
	tw = 1,
): [number, number, number, number] {
	const m = storage;
	return [
		m[0] * tx + m[4] * ty + m[8] * tz + m[12] * tw,
		m[1] * tx + m[5] * ty + m[9] * tz + m[13] * tw,
		m[2] * tx + m[6] * ty + m[10] * tz + m[14] * tw,
		m[3] * tx + m[7] * ty + m[11] * tz + m[15] * tw,
	];
}

describe("Matrix4.translate fast path", () => {
	it("identity.translate sets the translation column", () => {
		const m = Matrix4.identity().translate(3, 4, 5);
		expect([m.storage[12], m.storage[13], m.storage[14], m.storage[15]]).toEqual([3, 4, 5, 1]);
	});

	it("accumulates onto an existing translation", () => {
		const m = Matrix4.translationValues(10, 20, 0).translate(3, 4, 0);
		expect([m.storage[12], m.storage[13]]).toEqual([13, 24]);
	});

	it("does NOT take the fast path for a scale matrix", () => {
		// scale x2/y3 must scale the translation (2*5, 3*7) — proving the fast
		// path is correctly gated off for non-identity upper-3x3 matrices.
		const m = Matrix4.diagonal3Values(2, 3, 1).translate(5, 7, 0);
		expect([m.storage[12], m.storage[13]]).toEqual([10, 21]);
	});

	it("is numerically identical to the general multiply for translation-only matrices", () => {
		const seeds = [
			[0, 0, 0],
			[1, 2, 3],
			[-5, 10, 0],
			[100, -200, 7],
		];
		for (const [px, py, pz] of seeds) {
			for (const [tx, ty, tz] of seeds) {
				const base = Matrix4.translationValues(px, py, pz);
				const expected = generalTranslate(base.storage, tx, ty, tz);
				const got = base.translate(tx, ty, tz);
				expect([got.storage[12], got.storage[13], got.storage[14], got.storage[15]]).toEqual(
					expected,
				);
			}
		}
	});
});
