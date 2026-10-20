import { afterEach, describe, expect, it, vi } from 'vitest';
import TextPainter from '../../../packages/core/src/type/_types/text-painter';
import { TextSpan, TextStyle, TextAlign, TextDirection } from 'flitterjs';
import { getTextWidth } from '../../../packages/core/src/utils/getTextSize';

// A fresh font family per test keeps the window-bound width cache from serving
// widths measured by another test's mock.
let family = 0;
const nextFont = () => `fractional-${++family}`;

// Advances like a real proportional font: never whole pixels, and a space is
// narrower than a letter. "visitors" measures 64.08px, " " measures 3.34px.
const advance = (text: string) =>
	[...text].reduce((sum, ch) => sum + (ch === ' ' ? 3.34 : 8.01), 0);

function stubCanvas() {
	const measureText = vi.fn((text: string) => ({ width: advance(text) }));
	vi.stubGlobal('window', {});
	vi.stubGlobal('document', {
		createElement: () => ({ getContext: () => ({ font: '', measureText }) })
	});
	return measureText;
}

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('fractional text widths', () => {
	it('getTextWidth returns the browser advance without rounding', () => {
		stubCanvas();
		expect(getTextWidth({ text: 'visitors', font: `12px ${nextFont()}` })).toBe(advance('visitors'));
		expect(getTextWidth({ text: ' ', font: `12px ${nextFont()}` })).toBe(3.34);
	});

	it('the fallback estimate is not rounded either', () => {
		const width = getTextWidth({ text: 'by', font: '12px sans-serif' });
		expect(Number.isInteger(width)).toBe(false);
	});

	it('places each segment at the cumulative fractional width of the segments before it', () => {
		stubCanvas();
		const painter = new TextPainter({
			text: new TextSpan({
				text: 'Monthly visitors by city',
				style: new TextStyle({ fontSize: 14, fontFamily: nextFont() })
			}),
			textAlign: TextAlign.start,
			textDirection: TextDirection.ltr
		});
		painter.layout();

		const boxes = painter.paragraph!.lines.flatMap((line) => line.spanBoxes);
		expect(boxes.map((box) => box.content)).toEqual([
			'Monthly',
			' ',
			'visitors',
			' ',
			'by',
			' ',
			'city'
		]);
		let x = 0;
		for (const box of boxes) {
			expect(box.size.width).toBe(advance(box.content));
			expect(box.offset.x).toBe(x);
			x += box.size.width;
		}
		// "by" starts 3.34px after "visitors" ends, not a rounded-up 4px.
		expect(boxes[4].offset.x - (boxes[2].offset.x + boxes[2].size.width)).toBeCloseTo(3.34, 10);

		// Only the box the paragraph occupies snaps to whole pixels.
		expect(painter.width).toBe(Math.ceil(x));
	});

	it('a width-only resize keeps the rounded box width and the fractional positions', () => {
		stubCanvas();
		const painter = new TextPainter({
			text: new TextSpan({
				text: 'alpha beta',
				style: new TextStyle({ fontSize: 12, fontFamily: nextFont() })
			}),
			textAlign: TextAlign.center,
			textDirection: TextDirection.ltr
		});
		painter.layout({ maxWidth: 500 });
		const total = advance('alpha beta');
		expect(painter.width).toBe(Math.ceil(total));
		painter.layout({ maxWidth: 400 });
		expect(painter.width).toBe(Math.ceil(total));
		const boxes = painter.paragraph!.lines[0].spanBoxes;
		const left = (Math.ceil(total) - total) / 2;
		expect(boxes.map((box) => box.offset.x)).toEqual([
			left,
			left + advance('alpha'),
			left + advance('alpha') + advance(' ')
		]);
	});
});
