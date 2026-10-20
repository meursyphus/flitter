import { describe, expect, it } from 'vitest';
import { BorderRadius, Path, Rect } from 'flitterjs';

function arcRadii(d: string) {
	return [...d.matchAll(/A\s*([\d.]+)\s+([\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
}

describe('rounded rect radii', () => {
	it('shrinks radii that overflow a side, like Flutter scaleRadii', () => {
		const rect = Rect.fromLTWH({ left: 0, top: 0, width: 80, height: 16 });
		const d = new Path().addRRect(BorderRadius.circular(999).toRRect(rect)).getD();
		expect(arcRadii(d)).toEqual([[8, 8], [8, 8], [8, 8], [8, 8]]);
	});

	it('keeps radii that fit', () => {
		const rect = Rect.fromLTWH({ left: 0, top: 0, width: 80, height: 40 });
		const d = new Path().addRRect(BorderRadius.circular(10).toRRect(rect)).getD();
		expect(arcRadii(d)).toEqual([[10, 10], [10, 10], [10, 10], [10, 10]]);
	});
});
