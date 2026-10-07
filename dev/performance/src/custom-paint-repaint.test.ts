import { describe, expect, it, vi } from 'vitest';
import {
	RenderCustomPaint,
	type Painter
} from '../../../packages/core/src/component/base/BaseCustomPaint';
import { Size } from 'flitter-core';

function setup(painter: Painter) {
	const render = new RenderCustomPaint({
		painter,
		preferredSize: new Size({ width: 100, height: 100 })
	});
	const markNeedsPaint = vi.fn();
	render.renderOwner = { markNeedsPaint } as unknown as typeof render.renderOwner;
	return { render, markNeedsPaint };
}

describe('CustomPaint delegate updates', () => {
	it('schedules a repaint for a changed delegate when no opt-out is supplied', () => {
		const { render, markNeedsPaint } = setup({ canvas: { paint: () => {} } });
		render.painter = { canvas: { paint: () => {} } };
		expect(markNeedsPaint).toHaveBeenCalledWith(render);
	});
	it('keeps an unchanged delegate and honors an explicit repaint veto', () => {
		const painter = { canvas: { paint: () => {} } };
		const { render, markNeedsPaint } = setup(painter);
		render.painter = painter;
		expect(markNeedsPaint).not.toHaveBeenCalled();
		const shouldRepaint = vi.fn(() => false);
		render.painter = { canvas: { paint: () => {} }, shouldRepaint };
		expect(shouldRepaint).toHaveBeenCalledWith(painter);
		expect(markNeedsPaint).not.toHaveBeenCalled();
	});
});
