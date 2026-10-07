import { describe, expect, it } from 'vitest';
import { Text, TextOverflow, TextPainter, TextSpan } from 'flitter-core';
import type { BuildContext } from '../../../packages/core/src/element';
import BaseRichText, { RenderParagraph } from '../../../packages/core/src/component/base/BaseRichText';

describe('Text maxLines public API (#79)', () => {
	it.each(['plain', 'rich'] as const)('forwards %s text line limits through RichText', (kind) => {
		const props = { key: 'limited-text', maxLines: 1, overflow: TextOverflow.ellipsis };
		const widget = kind === 'plain'
			? Text('a\nb\nc\nd', props)
			: Text.rich(new TextSpan({ text: 'a\nb\nc\nd' }), props);
		const richText = widget.build({} as BuildContext) as any;
		const base = richText.build().child as BaseRichText;
		const paragraph = base.createRenderObject() as RenderParagraph;
		expect(widget.key).toBe('limited-text');
		expect(paragraph.maxLines).toBe(1);
		expect(paragraph.textPainter.ellipsis).toBe('\u2026');
		paragraph.textPainter.layout();
		expect(paragraph.textPainter.paragraph!.source.map((span) => span.content).join('')).toBe('a\nb\nc\nd');
	});

	it('clears a previous line limit when the property is removed', () => {
		const text = new TextSpan({ text: 'a\nb' });
		const paragraph = new BaseRichText({ text, maxLines: 1 }).createRenderObject() as RenderParagraph;
		new BaseRichText({ text }).updateRenderObject(paragraph);
		expect(paragraph.maxLines).toBeUndefined();
	});

	it('preserves the line limit owned by an external TextPainter', () => {
		const text = new TextSpan({ text: 'a\nb' });
		const textPainter = new TextPainter({ text, maxLines: 2 });
		const widget = new BaseRichText({ text, textPainter });
		const paragraph = widget.createRenderObject() as RenderParagraph;
		widget.updateRenderObject(paragraph);
		expect(paragraph.maxLines).toBe(2);
	});
});
