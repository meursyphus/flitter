import { describe, expect, it, vi } from 'vitest';
import { FocusNode, TextEditingController } from 'flitter-core';

describe('TextEditingController', () => {
	it('notifies atomic text and selection changes and clamps native offsets', () => {
		const controller = new TextEditingController('hello');
		const changed = vi.fn();
		controller.addListener(changed);
		controller.selection = { start: 9, end: -1 };
		expect(controller.value).toEqual({ text: 'hello', selection: { start: 0, end: 5 } });
		controller.value = { text: '한😀', selection: { start: 1, end: 3 } };
		expect(controller.selection).toEqual({ start: 1, end: 3 });
		controller.value = controller.value;
		expect(changed).toHaveBeenCalledTimes(2);
		expect(Object.isFrozen(controller.value)).toBe(true);
		expect(Object.isFrozen(controller.selection)).toBe(true);
		controller.clear();
		expect(controller.value).toEqual({ text: '', selection: { start: 0, end: 0 } });
		controller.removeListener(changed);
		controller.text = 'done';
		expect(changed).toHaveBeenCalledTimes(3);
		controller.dispose();
		expect(() => {
			controller.text = 'invalid';
		}).toThrow('disposed');
	});
});

describe('FocusNode', () => {
	it('delivers pending focus, reports native changes and detaches without disposing its owner', () => {
		const node = new FocusNode();
		const focus = vi.fn(() => node.updateFocus(true));
		const blur = vi.fn(() => node.updateFocus(false));
		const changed = vi.fn();
		node.addListener(changed);
		node.requestFocus();
		const detach = node.attach(focus, blur);
		expect(focus).toHaveBeenCalledOnce();
		expect(node.hasFocus).toBe(true);
		expect(() => node.attach(focus, blur)).toThrow('multiple');
		node.unfocus();
		expect(blur).toHaveBeenCalledOnce();
		expect(node.hasFocus).toBe(false);
		node.requestFocus();
		detach();
		expect(node.hasFocus).toBe(false);
		expect(changed).toHaveBeenCalledTimes(4);
		const nextFocus = vi.fn();
		node.attach(nextFocus, blur);
		node.requestFocus();
		expect(nextFocus).toHaveBeenCalledOnce();
		node.dispose();
		expect(() => node.requestFocus()).toThrow('disposed');
	});
});
