import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TextAlign, TextDirection, TextSpan, TextStyle } from 'flitter-core';
import TextPainter, { Paragraph } from '../../../packages/core/src/type/_types/text-painter';
import { RenderParagraph } from '../../../packages/core/src/component/base/BaseRichText';
import TextOverflow from '../../../packages/core/src/type/_types/text-overflow';

const measureText = vi.fn((text: string) => ({ width: Array.from(text).length * 10 }));
beforeEach(() => {
	measureText.mockClear();
	vi.stubGlobal('window', {});
	vi.stubGlobal('document', {
		createElement: () => ({ getContext: () => ({ font: '', measureText }) }),
		fonts: new EventTarget()
	});
});
afterEach(() => {
	vi.unstubAllGlobals();
});
const make = (text: string, options: { maxLines?: number; ellipsis?: string } = {}) =>
	new TextPainter({
		text: new TextSpan({ text, style: new TextStyle({ fontSize: 10 }) }),
		...options
	});
const contents = (painter: TextPainter) =>
	painter.paragraph!.lines.map((line) => line.spanBoxes.map((b) => b.content).join(''));

describe('prepared text layout', () => {
	it('retains prepared widths on wrapping resizes, even after the shared LRU is evicted', () => {
		const painter = make('alpha beta gamma delta');
		painter.layout({ minWidth: 100, maxWidth: 100 });
		const paragraph = painter.paragraph;
		const cache = (window as unknown as Record<symbol, Map<string, number>>)[
			Symbol.for('flitter.textWidthMeasurementCache')
		];
		cache.clear();
		measureText.mockClear();
		painter.layout({ minWidth: 60, maxWidth: 60 });
		expect(painter.paragraph).toBe(paragraph);
		expect(measureText).not.toHaveBeenCalled();
		expect(painter.paragraph!.lines.length).toBeGreaterThan(2);
	});

	it('truncates at maxLines and never measures the hidden tail', () => {
		const painter = make('alpha beta gamma delta epsilon', { maxLines: 1 });
		painter.layout({ maxWidth: 60 });
		expect(painter.paragraph!.lines).toHaveLength(1);
		expect(painter.paragraph!.didExceedMaxLines).toBe(true);
		expect(measureText.mock.calls.map(([text]) => text)).not.toContain('gamma');
		expect(contents(painter)).toEqual(['alpha ']);
	});

	it('ellipsizes by grapheme and restores the full text when widened', () => {
		const painter = make('hello world', { maxLines: 1, ellipsis: '…' });
		painter.layout({ maxWidth: 50 });
		expect(contents(painter)).toEqual(['hell…']);
		expect(painter.paragraph!.lines[0].width).toBeLessThanOrEqual(50);
		painter.layout({ maxWidth: 200 });
		expect(contents(painter)).toEqual(['hello world']);
		expect(painter.paragraph!.didExceedMaxLines).toBe(false);
	});

	it('preserves empty and trailing hard-break lines', () => {
		const painter = make('\na\n\nb\n');
		painter.layout({ maxWidth: 200 });
		expect(contents(painter)).toEqual(['', 'a', '', 'b', '']);
		expect(painter.paragraph!.lines.every((line) => line.height > 0)).toBe(true);
	});

	it('does not introduce a word break at a styled span boundary', () => {
		const painter = new TextPainter({
			text: new TextSpan({ text: 'he', children: [new TextSpan({ text: 'llo' })] })
		});
		painter.layout({ maxWidth: 30 });
		expect(contents(painter)).toEqual(['hello']);
	});

	it('breaks CJK per grapheme while keeping forbidden punctuation off line edges', () => {
		const painter = make('「你好」世界。');
		painter.layout({ maxWidth: 40 });
		const lines = contents(painter);
		expect(lines.length).toBeGreaterThan(1);
		expect(
			lines.every(
				(line) => !line.startsWith('」') && !line.startsWith('。') && !line.endsWith('「')
			)
		).toBe(true);
		expect(lines.join('')).toBe('「你好」世界。');
	});

	it('renders soft hyphens only when the discretionary break is used', () => {
		const painter = make('ab\u00adcdef');
		painter.layout({ maxWidth: 40 });
		expect(contents(painter)).toEqual(['ab-', 'cdef']);
		painter.layout({ maxWidth: 100 });
		expect(contents(painter)).toEqual(['abcdef']);
	});

	it('exposes UTF-16 character ranges and cached caret geometry for a single span', () => {
		const painter = make('A😀e\u0301');
		painter.layout({ maxWidth: 200 });
		const lines = painter.paragraph!.getCharacterLines();
		expect(lines[0].spanBoxes.map((b) => [b.content, b.textStart, b.textEnd])).toEqual([
			['A', 0, 1],
			['😀', 1, 3],
			['e\u0301', 3, 5]
		]);
		measureText.mockClear();
		expect(painter.paragraph!.getCharacterLines()).toBe(lines);
		expect(measureText).not.toHaveBeenCalled();
		expect(lines[0].spanBoxes.at(-1)!.offset.x + lines[0].spanBoxes.at(-1)!.size.width).toBe(
			painter.longestLine
		);
	});

	it('handles an ellipsis wider than the available width', () => {
		const painter = make('hello', { maxLines: 1, ellipsis: '…' });
		painter.layout({ maxWidth: 1 });
		expect(painter.paragraph!.lines[0].width).toBe(0);
		expect(painter.height).toBeGreaterThan(0);
	});

	it('updates ellipsis when the render object overflow changes', () => {
		const render = new RenderParagraph({ text: new TextSpan({ text: 'hello' }), maxLines: 1 });
		render.overflow = TextOverflow.ellipsis;
		expect(render.textPainter.ellipsis).toBe('…');
		render.overflow = TextOverflow.clip;
		expect(render.textPainter.ellipsis).toBeUndefined();
	});

	it('expires prepared paragraphs after web fonts finish loading', () => {
		const painter = make('alpha beta');
		painter.layout({ maxWidth: 100 });
		const before = painter.paragraph;
		measureText.mockClear();
		document.fonts.dispatchEvent(new Event('loadingdone'));
		painter.layout({ maxWidth: 100 });
		expect(painter.paragraph).not.toBe(before);
		expect(measureText).toHaveBeenCalled();
	});

	it('bounds caret preparation for long unbroken pasted text', () => {
		const painter = make('a'.repeat(2000));
		painter.layout();
		measureText.mockClear();
		const boxes = painter.paragraph!.getCharacterLines()[0].spanBoxes;
		expect(boxes).toHaveLength(2000);
		expect(measureText.mock.calls.length).toBeLessThan(5);
		expect(boxes.at(-1)!.offset.x + boxes.at(-1)!.size.width).toBe(painter.longestLine);
	});

	it('rejects invalid line limits', () => {
		expect(
			() =>
				new Paragraph(null, {
					textAlign: TextAlign.left,
					textDirection: TextDirection.ltr,
					maxLines: 0
				})
		).toThrow();
	});
});

describe('segmentation fallback', () => {
	it('keeps grapheme clusters and CJK breaks without Intl.Segmenter', async () => {
		vi.resetModules();
		const original = Intl.Segmenter;
		try {
			Object.defineProperty(Intl, 'Segmenter', { value: undefined, configurable: true });
			const fallback = await import('../../../packages/core/src/type/_types/text-segments');
			expect(fallback.graphemes('👩‍💻e\u0301🇰🇷').map((g) => g.segment)).toEqual([
				'👩‍💻',
				'e\u0301',
				'🇰🇷'
			]);
			expect(fallback.segmentText('你好').map((s) => s.content)).toEqual(['你', '好']);
		} finally {
			Object.defineProperty(Intl, 'Segmenter', { value: original, configurable: true });
		}
	});
});

import TextField from '../../../packages/core/src/component/TextField';

function findPainter(value: unknown, seen = new Set<object>()): TextPainter | undefined {
	if (value instanceof TextPainter) return value;
	if (!value || typeof value !== 'object' || seen.has(value)) return;
	seen.add(value);
	for (const child of Object.values(value)) {
		const painter = findPainter(child, seen);
		if (painter) return painter;
	}
}

it('uses one TextField span and reuses cached prefix measurements on a repeated edit', () => {
	const widget = TextField('A😀 hello');
	const state = widget.createState();
	const callbacks: (() => void)[] = [];
	state.widget = widget;
	state.element = {
		markNeedsBuild() {},
		scheduler: {
			ensureVisualUpdate() {},
			addPostFrameCallbacks(callback: () => void) {
				callbacks.push(callback);
			}
		}
	} as unknown as typeof state.element;
	state.initState();
	const painter = findPainter(state.build())!;
	expect((painter.text as TextSpan).children).toHaveLength(0);
	painter.layout({ maxWidth: 200 });
	callbacks.splice(0).forEach((callback) => callback());
	expect(
		painter
			.paragraph!.getCharacterLines()[0]
			.spanBoxes.map((box) => [box.content, box.textStart, box.textEnd])
	).toContainEqual(['😀', 1, 3]);
	measureText.mockClear();
	state.widget = TextField('A😀 hello');
	state.didUpdateWidget(TextField('previous'));
	const next = findPainter(state.build())!;
	next.layout({ maxWidth: 200 });
	callbacks.splice(0).forEach((callback) => callback());
	expect(measureText).not.toHaveBeenCalled();
});

it.each([undefined, 1, 2])(
	'cached resizes match fresh Unicode/ellipsis layouts (maxLines=%s)',
	(maxLines) => {
		const text = '「你好」 first\n\nsecond ab\u00adcdef 😀!';
		const painter = make(text, { maxLines, ellipsis: '…' });
		for (const width of [90, 50, 300, 60, 500]) {
			painter.layout({ minWidth: width, maxWidth: width });
			const fresh = make(text, { maxLines, ellipsis: '…' });
			fresh.layout({ minWidth: width, maxWidth: width });
			expect(contents(painter)).toEqual(contents(fresh));
			expect(JSON.stringify(painter.paragraph!.lines)).toBe(JSON.stringify(fresh.paragraph!.lines));
		}
	}
);
