import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import BaseGestureDetector, { type RenderGestureDetector } from '../../../packages/core/src/component/base/BaseGestureDetector';

let documentEvents: EventTarget;
const mounted: RenderGestureDetector[] = [];
const callbacks = () => ({ onDragStart: vi.fn(), onDragMove: vi.fn(), onDragEnd: vi.fn() });

function mount(widget: BaseGestureDetector) {
  const render = widget.createRenderObject();
  render.renderOwner = {
    markNeedsCompositingBitsUpdate() {},
    markNeedsPaintTransformUpdate() {},
    notifyZOrderChanged() {},
    disposeRenderObject() {},
  } as any;
  render.attach({ depth: 0 } as any);
  mounted.push(render);
  return render;
}
function down(render: RenderGestureDetector) {
  const event = new Event('mousedown', { cancelable: true });
  render.onMouseDown(event as MouseEvent);
  return event;
}

beforeEach(() => {
  documentEvents = new EventTarget();
  vi.stubGlobal('document', documentEvents);
  vi.stubGlobal('window', {});
});
afterEach(() => {
  mounted.splice(0).forEach(render => render.dispose());
  vi.unstubAllGlobals();
});

describe('reconciled gesture callbacks', () => {
  it('uses the new drag policy after switching a widget from viewer to editor', () => {
    const viewer = callbacks();
    const render = mount(new BaseGestureDetector(viewer));
    const editor = callbacks();
    editor.onDragStart.mockImplementation(event => event.stopPropagation());
    new BaseGestureDetector(editor).updateRenderObject(render);

    const press = down(render);
    documentEvents.dispatchEvent(new Event('mousemove'));
    documentEvents.dispatchEvent(new Event('mouseup'));

    expect(press.cancelBubble).toBe(true);
    for (const callback of Object.values(viewer)) expect(callback).not.toHaveBeenCalled();
    for (const callback of Object.values(editor)) expect(callback).toHaveBeenCalledOnce();
  });

  it('keeps an active drag bound to the latest callbacks after a rebuild', () => {
    const first = callbacks();
    const render = mount(new BaseGestureDetector(first));
    down(render);
    documentEvents.dispatchEvent(new Event('mousemove'));
    const next = callbacks();
    new BaseGestureDetector(next).updateRenderObject(render);
    documentEvents.dispatchEvent(new Event('mousemove'));
    documentEvents.dispatchEvent(new Event('mouseup'));

    expect(first.onDragStart).toHaveBeenCalledOnce();
    expect(first.onDragMove).toHaveBeenCalledOnce();
    expect(first.onDragEnd).not.toHaveBeenCalled();
    expect(next.onDragStart).not.toHaveBeenCalled();
    expect(next.onDragMove).toHaveBeenCalledOnce();
    expect(next.onDragEnd).toHaveBeenCalledOnce();
  });
});
