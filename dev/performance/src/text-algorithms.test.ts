import { afterEach, describe, expect, it, vi } from 'vitest';
import TextPainter, { Paragraph } from '../../../packages/core/src/type/_types/text-painter';
import { TextSpan, TextStyle, TextAlign, TextDirection, Offset } from 'flitter-core';
import { getTextWidth } from '../../../packages/core/src/utils/getTextSize';
import { PerformanceTracer } from '../../../packages/core/src/framework/performance-tracing';

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

const richSpan = (color: string) =>
	new TextSpan({
		text: 'alpha beta\ngamma ',
		style: new TextStyle({ color, fontSize: 12 }),
		children: [
			new TextSpan({
				text: 'delta epsilon',
				style: new TextStyle({ color: '#123456', fontSize: 18, height: 1.5 })
			})
		]
	});
const geometry = (painter: TextPainter) =>
	painter.paragraph!.lines.map((line) => ({
		width: line.width,
		height: line.height,
		boxes: line.spanBoxes.map((box) => ({
			content: box.content,
			offset: { ...box.offset },
			size: { ...box.size }
		}))
	}));

describe('text algorithms', () => {
	it.each([40, 120, 1000])(
		'color updates preserve geometry without running line breaking at width %s',
		(width) => {
			const painter = new TextPainter({
				text: richSpan('#ff0000'),
				textAlign: TextAlign.center,
				textDirection: TextDirection.ltr
			});
			painter.layout({ maxWidth: width });
			const before = geometry(painter);
			const paragraph = painter.paragraph;
			const layout = vi.spyOn(Paragraph.prototype, 'layout');
			const fillText = vi.fn();
			const ctx = { fillText } as unknown as CanvasRenderingContext2D;
			painter.text = richSpan('#00ff00');
			painter.layout({ maxWidth: width });
			painter.paintOnCanvas(ctx, Offset.Constants.zero);
			expect(layout).not.toHaveBeenCalled();
			expect(painter.paragraph).toBe(paragraph);
			expect(geometry(painter)).toEqual(before);
			expect(
				painter.paragraph!.lines.flatMap((line) => line.spanBoxes).map((box) => box.color)
			).toContain('#00ff00');
			expect(
				painter.paragraph!.lines.flatMap((line) => line.spanBoxes).map((box) => box.color)
			).toContain('#123456');
			expect(fillText).toHaveBeenCalled();
		}
	);

	it('long lines accumulate metrics in linear work instead of reducing the line per word', () => {
		const painter = new TextPainter({ text: new TextSpan({ text: 'word '.repeat(2000) }) });
		let reducedItems = 0;
		const originalReduce = Array.prototype.reduce;
		const reduce = vi.spyOn(Array.prototype, 'reduce').mockImplementation(function (
			this: unknown[],
			...args: unknown[]
		) {
			reducedItems += this.length;
			return Reflect.apply(originalReduce, this, args);
		});
		painter.layout({ minWidth: 1_000_000, maxWidth: 1_000_000 });
		// The former algorithm reduced a growing span-box array twice per token.
		// Count the total input items to reductions; this is machine-independent.
		reduce.mockRestore();
		expect(reducedItems).toBeLessThan(20_000);
		const line = painter.paragraph!.lines[0];
		expect(line.width).toBe(line.spanBoxes.reduce((n, box) => n + box.size.width, 0));
		expect(line.height).toBe(
			Math.max(...line.spanBoxes.map((box) => box.size.height * box.height))
		);
	});

	it('keeps hot measured labels through cache capacity and clears metrics on font load', () => {
		const measureText = vi.fn((text: string) => ({ width: text.length * 8 }));
		const fonts = new EventTarget();
		vi.stubGlobal('window', {});
		vi.stubGlobal('document', {
			createElement: () => ({ getContext: () => ({ font: '', measureText }) }),
			fonts
		});
		const width = (text: string) => getTextWidth({ text, font: '12px sans-serif' });
		width('hot label');
		for (let i = 0; i < 9000; i++) {
			width(`live ${i}`);
			width('hot label');
		}
		expect(measureText.mock.calls.filter(([text]) => text === 'hot label')).toHaveLength(1);
		const cache = (window as unknown as Record<symbol, Map<string, number>>)[
			Symbol.for('flitter.textWidthMeasurementCache')
		];
		expect(cache.size).toBe(8192);
		fonts.dispatchEvent(new Event('loadingdone'));
		expect(cache.size).toBe(0);
		width('hot label');
		expect(measureText.mock.calls.filter(([text]) => text === 'hot label')).toHaveLength(2);
	});

	it('keeps measures while releasing private per-frame marks, including when a phase throws', () => {
		const tracer = new PerformanceTracer();
		tracer.setEnabled(true);
		performance.clearMarks();
		performance.clearMeasures();
		for (let i = 0; i < 100; i++) tracer.measure('algorithm-test', () => i);
		expect(() =>
			tracer.measure('algorithm-error', () => {
				throw new Error('phase');
			})
		).toThrow('phase');
		expect(performance.getEntriesByType('mark')).toHaveLength(0);
		expect(performance.getEntriesByName('flitter:algorithm-test')).toHaveLength(100);
		expect(performance.getEntriesByName('flitter:algorithm-error')).toHaveLength(1);
		performance.clearMeasures();
	});
});
