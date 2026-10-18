import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HitTestDispatcher } from '../../../packages/core/src/hit-test/HitTestDispatcher';
import BaseGestureDetector from '../../../packages/core/src/component/base/BaseGestureDetector';
import { HitTestEntry } from '../../../packages/core/src/hit-test/HitTestResult';

class PointerEvent extends Event {
	clientX = 0;
	clientY = 0;
	constructor(type: string, init: Record<string, unknown> = {}) {
		super(type, { cancelable: true });
		for (const [key, value] of Object.entries(init)) Object.defineProperty(this, key, { value });
	}
}

function fixture(callbacks: (((e: MouseEvent) => void) | undefined)[]) {
	const view = Object.assign(new EventTarget(), {
		style: {},
		getBoundingClientRect: () => ({ left: 0, top: 0 })
	});
	const detectors = callbacks.map((onContextMenu) =>
		new BaseGestureDetector({ onContextMenu }).createRenderObject()
	);
	const hitTest = vi.fn((result) =>
		detectors.forEach((detector) => result.add(new HitTestEntry(detector)))
	);
	const dispatcher = new HitTestDispatcher();
	dispatcher.init({
		renderContext: {
			view,
			window: new EventTarget(),
			viewPort: { translation: { x: 0, y: 0 }, scale: 1 }
		} as any
	});
	dispatcher.setRenderView({ hitTest } as any);
	const mouse = () => {
		const e = new PointerEvent('contextmenu', { clientX: 13, clientY: 27 });
		view.dispatchEvent(e);
		return e;
	};
	const touch = (type: string, points: { clientX: number; clientY: number }[]) => {
		const e = new Event(type, { cancelable: true });
		Object.assign(e, { touches: points });
		view.dispatchEvent(e);
	};
	return { view, dispatcher, mouse, touch, hitTest };
}

beforeEach(() => {
	vi.useFakeTimers();
	vi.stubGlobal('window', {});
	vi.stubGlobal('MouseEvent', PointerEvent);
});
afterEach(() => {
	vi.useRealTimers();
	vi.unstubAllGlobals();
});

describe('core context-menu dispatch', () => {
	it('hit tests right-click and prevents the DOM menu only for a handler', () => {
		const listener = vi.fn();
		const f = fixture([listener]);
		expect(f.mouse().defaultPrevented).toBe(true);
		expect(listener).toHaveBeenCalledOnce();
		expect(f.hitTest).toHaveBeenCalledOnce();
		expect(listener.mock.calls[0][0]).toMatchObject({ clientX: 13, clientY: 27 });
		f.dispatcher.dispose();
		const empty = fixture([undefined]);
		expect(empty.mouse().defaultPrevented).toBe(false);
		empty.dispatcher.dispose();
	});
	it('counts stopPropagation as handled and stops at the child', () => {
		const parent = vi.fn();
		const f = fixture([(e) => e.stopPropagation(), parent]);
		expect(f.mouse().defaultPrevented).toBe(true);
		expect(parent).not.toHaveBeenCalled();
		f.dispatcher.dispose();
	});
	it('dispatches a long press at 500ms even without drag handlers', () => {
		const listener = vi.fn();
		const f = fixture([listener]);
		f.touch('touchstart', [{ clientX: 19, clientY: 31 }]);
		vi.advanceTimersByTime(499);
		expect(listener).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(listener).toHaveBeenCalledOnce();
		expect(listener.mock.calls[0][0]).toMatchObject({ clientX: 19, clientY: 31, fromTouch: true });
		f.dispatcher.dispose();
	});
	it.each(['touchend', 'touchcancel', 'touchmove', 'second finger', 'dispose', 'replace view'])(
		'cancels long press on %s',
		(action) => {
			const listener = vi.fn();
			const f = fixture([listener]);
			f.touch('touchstart', [{ clientX: 10, clientY: 10 }]);
			if (action === 'dispose') f.dispatcher.dispose();
			else if (action === 'replace view') f.dispatcher.setRenderView({ hitTest: () => {} } as any);
			else if (action === 'second finger')
				f.touch('touchstart', [
					{ clientX: 10, clientY: 10 },
					{ clientX: 20, clientY: 20 }
				]);
			else f.touch(action, action === 'touchmove' ? [{ clientX: 15, clientY: 10 }] : []);
			vi.advanceTimersByTime(600);
			expect(listener).not.toHaveBeenCalled();
			f.dispatcher.dispose();
		}
	);
	it('allows motion within touch drag slop', () => {
		const listener = vi.fn();
		const f = fixture([listener]);
		f.touch('touchstart', [{ clientX: 10, clientY: 10 }]);
		f.touch('touchmove', [{ clientX: 12, clientY: 12 }]);
		vi.advanceTimersByTime(500);
		expect(listener).toHaveBeenCalledOnce();
		f.dispatcher.dispose();
	});
});
