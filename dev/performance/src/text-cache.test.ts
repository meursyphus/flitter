import { describe, expect, it, vi } from "vitest";
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

	it("reuses the paragraph and recomputes line breaks when the width changes", () => {
		const painter = new TextPainter({ text: span("hello world") });

		painter.layout({ minWidth: 0, maxWidth: 200 });
		const first = painter.paragraph;

		painter.layout({ minWidth: 0, maxWidth: 50 });
		expect(painter.paragraph).toBe(first);
		expect(painter.paragraph!.lines.length).toBeGreaterThan(1);
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

import { RenderParagraph } from "../../../packages/core/src/component/base/BaseRichText";
import { Paragraph } from "../../../packages/core/src/type/_types/text-painter";
import { TextAlign } from "flitter-core";

describe("paragraph cache correctness", () => {
  it("widens unwrapped text without line breaking, updating alignment", () => {
    const painter = new TextPainter({ text: span("hello"), textAlign: TextAlign.right });
    painter.layout({ minWidth: 100, maxWidth: 100 });
    const paragraph = painter.paragraph!;
    const x = paragraph.lines[0].spanBoxes[0].offset.x;
    const layout = vi.spyOn(paragraph, "layout");
    painter.layout({ minWidth: 150, maxWidth: 150 });
    expect(painter.paragraph).toBe(paragraph);
    expect(layout).not.toHaveBeenCalled();
    expect(paragraph.lines[0].spanBoxes[0].offset.x).toBe(x + 50);
  });

  it("caches intrinsic dimensions by width without changing the painted paragraph", () => {
    const render = new RenderParagraph({ text: span("hello world hello world") });
    render.textPainter.layout({ maxWidth: 80 });
    const painted = render.textPainter.paragraph!;
    const before = JSON.stringify(painted.lines);
    const layout = vi.spyOn(Paragraph.prototype, "layout");
    try {
      const narrow = render.getIntrinsicHeight(40);
      const calls = layout.mock.calls.length;
      expect(render.getIntrinsicHeight(40)).toBe(narrow);
      expect(layout.mock.calls).toHaveLength(calls);
      expect(render.getIntrinsicHeight(200)).toBeLessThan(narrow);
      expect(render.textPainter.paragraph).toBe(painted);
      expect(JSON.stringify(painted.lines)).toBe(before);
    } finally {
      layout.mockRestore();
    }
  });

  it("invalidates intrinsic sizes when only line height changes", () => {
    const text = (height: number) => new TextSpan({
      text: "hello", style: new TextStyle({ fontSize: 10, height })
    });
    const render = new RenderParagraph({ text: text(1) });
    expect(render.getIntrinsicHeight(100)).toBe(10);
    render.text = text(2);
    expect(render.getIntrinsicHeight(100)).toBe(20);
  });

  it("invalidates intrinsic sizes for changed content and font", () => {
    const render = new RenderParagraph({ text: span("hello") });
    const width = render.getIntrinsicWidth(Infinity);
    render.text = span("hello world");
    expect(render.getIntrinsicWidth(Infinity)).toBeGreaterThan(width);
    const height = render.getIntrinsicHeight(200);
    render.text = new TextSpan({ text: "hello", style: new TextStyle({fontSize: 30}) });
    expect(render.getIntrinsicHeight(200)).toBeGreaterThan(height);
  });
});
