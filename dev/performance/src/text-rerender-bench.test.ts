import { describe, expect, it } from "vitest";
import TextPainter from "../../../packages/core/src/type/_types/text-painter";
import TextSpan from "../../../packages/core/src/type/_types/text-span";
import TextStyle from "../../../packages/core/src/type/_types/text-style";

function makeLabels(count: number): TextPainter[] {
	const painters: TextPainter[] = [];
	const style = new TextStyle({ fontSize: 12, fontFamily: "sans-serif" });
	for (let i = 0; i < count; i++) {
		// Reuse a small pool of strings, like a chart with repeating axis/legend labels.
		painters.push(
			new TextPainter({ text: new TextSpan({ text: `label_${i % 50}`, style }) }),
		);
	}
	return painters;
}

function time(fn: () => void): number {
	const start = performance.now();
	fn();
	return performance.now() - start;
}

/*
  The mount benchmark only renders once, so it cannot show the payoff of the
  text layout cache — that lands on re-render (animation frames, parent-driven
  relayouts where the text node's own inputs are stable). This demonstration
  re-lays-out a batch of labels across many "frames": "cold" forces a rebuild
  every frame (the pre-cache behavior), "warm" keeps the inputs stable so every
  relayout after the first is a cache hit. Warm must be strictly faster.
*/
describe("text relayout cache (re-render payoff)", () => {
	it("warm relayout with stable inputs is faster than rebuilding every frame", () => {
		const COUNT = 1500;
		const FRAMES = 24;
		const painters = makeLabels(COUNT);

		// Warm everything up once so allocation/JIT noise is excluded from both sides.
		for (const painter of painters) painter.layout({ maxWidth: 200 });

		const cold = time(() => {
			for (let frame = 0; frame < FRAMES; frame++) {
				for (const painter of painters) {
					painter.markNeedsLayout();
					painter.layout({ maxWidth: 200 });
				}
			}
		});

		const warm = time(() => {
			for (let frame = 0; frame < FRAMES; frame++) {
				for (const painter of painters) {
					painter.layout({ maxWidth: 200 });
				}
			}
		});

		// eslint-disable-next-line no-console
		console.log(
			`[text relayout] ${COUNT} labels x ${FRAMES} frames — cold(rebuild)=${cold.toFixed(
				1,
			)}ms  warm(cache hit)=${warm.toFixed(1)}ms  speedup=${(cold / warm).toFixed(1)}x`,
		);

		expect(warm).toBeLessThan(cold);
	});
});
