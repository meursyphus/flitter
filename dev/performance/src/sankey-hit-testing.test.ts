import { describe, expect, it } from 'vitest';
import { isPointInRibbon } from '../../../packages/chart/src/headless/sankey-chart/geometry';

const ribbon = {
	startTop: { x: 0.1, y: 0.2 },
	startBottom: { x: 0.1, y: 0.35 },
	endTop: { x: 0.9, y: 0.7 },
	endBottom: { x: 0.9, y: 0.85 }
};

describe('Sankey ribbon hit region', () => {
	it('accepts the curved band and rejects unused space in its bounding box', () => {
		const size = { width: 1000, height: 600 };
		expect(isPointInRibbon({ x: 500, y: 315 }, ribbon, size)).toBe(true);
		expect(isPointInRibbon({ x: 500, y: 269 }, ribbon, size)).toBe(false);
		expect(isPointInRibbon({ x: 500, y: 361 }, ribbon, size)).toBe(false);
		expect(isPointInRibbon({ x: 150, y: 450 }, ribbon, size)).toBe(false);
		expect(isPointInRibbon({ x: 850, y: 150 }, ribbon, size)).toBe(false);
	});
	it('keeps the hit region correct after resizing and for thin ribbons', () => {
		const thin = {
			...ribbon,
			startBottom: { x: 0.1, y: 0.2001 },
			endBottom: { x: 0.9, y: 0.7001 }
		};
		for (const size of [
			{ width: 360, height: 220 },
			{ width: 1200, height: 700 }
		]) {
			expect(isPointInRibbon({ x: size.width * 0.5, y: size.height * 0.45005 }, thin, size)).toBe(
				true
			);
			expect(isPointInRibbon({ x: size.width * 0.5, y: size.height * 0.4502 }, thin, size)).toBe(
				false
			);
			expect(isPointInRibbon({ x: size.width * 0.05, y: size.height * 0.45 }, thin, size)).toBe(
				false
			);
		}
	});
});
