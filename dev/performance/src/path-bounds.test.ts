import { describe, expect, it } from 'vitest';
import { Path, Rect } from 'flitter-core';

describe('conservative rectangle path bounds', () => {
	it('unions known rectangles and does not retain mutable input rectangles', () => {
		const rect = Rect.fromLTWH({ left: 10, top: 20, width: 30, height: 40 });
		const path = new Path()
			.addRect(rect)
			.addRect(Rect.fromLTWH({ left: -5, top: 0, width: 20, height: 25 }));
		rect.right = 10000;
		expect(path.getBounds()).toEqual(Rect.fromLTRB({ left: -5, top: 0, right: 40, bottom: 60 }));
		path.getBounds()!.left = -10000;
		expect(path.getBounds()!.left).toBe(-5);
	});

	it('drops the estimate for arbitrary appended geometry instead of clipping new paint', () => {
		const path = new Path().addRect(Rect.fromLTWH({ left: 0, top: 0, width: 10, height: 10 }));
		path.lineTo({ x: 1000, y: 1000 });
		expect(path.getBounds()).toBeUndefined();
		path.addRect(Rect.fromLTWH({ left: 0, top: 0, width: 20, height: 20 }));
		expect(path.getBounds()).toBeUndefined();
	});
});
