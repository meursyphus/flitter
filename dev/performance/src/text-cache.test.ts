import { describe, expect, it } from "vitest";
import TextPainter from "../../../packages/core/src/type/_types/text-painter";
import TextSpan from "../../../packages/core/src/type/_types/text-span";
import TextStyle from "../../../packages/core/src/type/_types/text-style";

function span(text: string): TextSpan {
	return new TextSpan({
		text,
		style: new TextStyle({ fontSize: 14, fontFamily: "sans-serif" }),
	});
}

/*
  These tests pin Flitter's Flutter-aligned "compute once" text layout cache:
  a TextPainter must reuse its laid-out paragraph when none of the layout inputs
  changed, and rebuild it when any of them does. This is what makes repeated
  relayouts (animation frames, parent-driven relayouts with stable text) cheap.
*/
describe("TextPainter layout cache (compute once)", () => {
	it("reuses the laid-out paragraph when inputs are unchanged", () => {
		const painter = new TextPainter({ text: span("hello world") });

		painter.layout({ minWidth: 0, maxWidth: 200 });
		const first = painter.paragraph;
		expect(first).toBeDefined();

		painter.layout({ minWidth: 0, maxWidth: 200 });
		expect(painter.paragraph).toBe(first);
	});

	it("rebuilds the paragraph when the width constraint changes", () => {
		const painter = new TextPainter({ text: span("hello world") });

		painter.layout({ minWidth: 0, maxWidth: 200 });
		const first = painter.paragraph;

		painter.layout({ minWidth: 0, maxWidth: 50 });
		expect(painter.paragraph).not.toBe(first);
	});

	it("rebuilds the paragraph when the text changes", () => {
		const painter = new TextPainter({ text: span("hello") });

		painter.layout({ maxWidth: 200 });
		const first = painter.paragraph;

		painter.text = span("different");
		painter.layout({ maxWidth: 200 });
		expect(painter.paragraph).not.toBe(first);
	});

	it("rebuilds the paragraph after markNeedsLayout()", () => {
		const painter = new TextPainter({ text: span("hello") });

		painter.layout({ maxWidth: 200 });
		const first = painter.paragraph;

		painter.markNeedsLayout();
		painter.layout({ maxWidth: 200 });
		expect(painter.paragraph).not.toBe(first);
	});

	it("produces the same measured size on a cache hit as the original layout", () => {
		const painter = new TextPainter({ text: span("hello world") });

		painter.layout({ maxWidth: 200 });
		const width = painter.width;
		const height = painter.height;

		painter.layout({ maxWidth: 200 });
		expect(painter.width).toBe(width);
		expect(painter.height).toBe(height);
	});
});
