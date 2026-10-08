import type { RenderContext } from "../framework/renderer/renderer";
import type { RenderGestureDetector } from "../component/base/BaseGestureDetector";
import type { RenderObject } from "../renderobject/RenderObject";
import { Offset } from "../type";
import { HitTestResult } from "./HitTestResult";

type EventHandlerType =
  | "onClick"
  | "onMouseMove"
  | "onMouseUp"
  | "onMouseDown"
  | "onWheel"
  | "onMouseEnter"
  | "onMouseLeave";

export class HitTestDispatcher {
  #activated = typeof window !== "undefined";
  #rootPosition: Offset | null = null;
  #renderContext!: RenderContext;
  #renderView: RenderObject | null = null;
  #isMouseDown = false;
  #activePointerHits: RenderGestureDetector[] | null = null;
  #lastPressHits: RenderGestureDetector[] | null = null;
  #lastHoverPosition: Offset | null = null;
  #lastHoverHits: RenderGestureDetector[] | null = null;
  #listeners: { type: string; handler: EventListener }[] = [];
  #touch: TouchSession | null = null;

  init({ renderContext }: { renderContext: RenderContext }) {
    if (!this.#activated) return;
    this.#renderContext = renderContext;
    const { view } = this.#renderContext;

    const handlers = {
      mousedown: this.#handleMouseDown,
      click: this.#handleClick,
      mousemove: this.#handleMouseMove,
      mouseup: this.#handleMouseUp,
      wheel: this.#handleMouseWheel,
      mouseenter: this.#handleMouseEnter,
      mouseleave: this.#handleMouseLeave,
    };
    for (const [type, callback] of Object.entries(handlers)) {
      const handler = this.#wrapEvent(callback);
      this.#listeners.push({ type, handler });
      view.addEventListener(type, handler);
    }
    /*
      Touch input is translated into the mouse events above: one finger acts
      as the mouse (drag, tap -> click), two fingers pinch-zoom (a wheel event
      carrying `pinchScale`) while panning with their midpoint. Only touches
      that land on a detector with drag handlers are captured; anything else
      keeps the browser's default scrolling and compatibility mouse events.
    */
    const touchHandlers: Record<string, (e: TouchEvent) => void> = {
      touchstart: this.#handleTouchStart,
      touchmove: this.#handleTouchMove,
      touchend: this.#handleTouchEnd,
      touchcancel: this.#handleTouchEnd,
    };
    for (const [type, callback] of Object.entries(touchHandlers)) {
      const handler = callback as EventListener;
      this.#listeners.push({ type, handler });
      view.addEventListener(type, handler, { passive: false });
    }
    this.#renderContext.window.addEventListener(
      "scroll",
      this.invalidate,
      true,
    );
  }

  setRenderView(renderView: RenderObject) {
    this.#renderView = renderView;
    this.#previousHits = new Set();
    this.#previousCursorDetector = null;
    this.#isMouseDown = false;
    this.#activePointerHits = null;
    this.#lastPressHits = null;
    this.#lastHoverPosition = null;
    this.#lastHoverHits = null;
  }

  /** A retained hit at the same coordinates is valid only for the same scene. */
  invalidate = () => {
    this.#rootPosition = null;
    this.#lastHoverPosition = null;
    this.#lastHoverHits = null;
  };

  dispose() {
    for (const { type, handler } of this.#listeners)
      this.#renderContext.view.removeEventListener(type, handler);
    this.#listeners = [];
    this.#renderContext?.window?.removeEventListener(
      "scroll",
      this.invalidate,
      true,
    );
    this.#renderView = null;
    this.#previousHits.clear();
    this.#activePointerHits = this.#lastPressHits = null;
    this.#previousCursorDetector = null;
    this.invalidate();
  }

  #handleMouseDown = (e: Wrapped<MouseEvent>) => {
    const detectors = this.#performHitTest(e);
    this.#isMouseDown = true;
    this.#activePointerHits = detectors;
    this.#lastPressHits = detectors;
    this.#dispatchDetectors(detectors, e, "onMouseDown");
  };

  #handleClick = (e: Wrapped<MouseEvent>) => {
    const detectors = this.#performHitTest(e);
    const resolvedDetectors =
      detectors.length > 0 ? detectors : (this.#lastPressHits ?? []);
    this.#lastPressHits = null;
    this.#dispatchDetectors(resolvedDetectors, e, "onClick");
  };

  #previousHits: Set<RenderGestureDetector> = new Set();
  #previousCursorDetector: RenderGestureDetector | null = null;

  #handleMouseMove = (e: Wrapped<MouseEvent>) => {
    if (this.#isMouseDown && this.#activePointerHits != null) {
      this.#dispatchDetectors(this.#activePointerHits, e, "onMouseMove");
      return;
    }

    const hitDetectors = this.#performHoverHitTest(e);

    // dispatch onMouseMove
    this.#dispatchDetectors(hitDetectors, e, "onMouseMove");

    const currentHits = new Set(hitDetectors);

    // trigger mouseenter for newly hit detectors
    e.isPropagationStopped = false;
    for (const detector of hitDetectors) {
      if (e.isPropagationStopped) break;
      if (!this.#previousHits.has(detector)) {
        detector.invokeCallback("onMouseEnter", e);
      }
    }

    // trigger mouseleave for previously hit detectors that are no longer hit
    e.isPropagationStopped = false;
    for (const detector of this.#previousHits) {
      if (e.isPropagationStopped) break;
      if (!currentHits.has(detector)) {
        detector.invokeCallback("onMouseLeave", e);
      }
    }

    this.#previousHits = currentHits;

    // set cursor based on topmost hit detector
    const cursorDetector: RenderGestureDetector | null =
      hitDetectors[0] ?? null;

    if (cursorDetector !== this.#previousCursorDetector) {
      this.#previousCursorDetector = cursorDetector;
      this.#renderContext.view.style.cursor =
        cursorDetector?.cursor ?? "default";
    }
  };

  #handleMouseUp = (e: Wrapped<MouseEvent>) => {
    const detectors = this.#activePointerHits ?? this.#performHitTest(e);
    this.#dispatchDetectors(detectors, e, "onMouseUp");
    this.#isMouseDown = false;
    this.#activePointerHits = null;
    this.#lastPressHits = detectors;
    this.#lastHoverPosition = null;
    this.#lastHoverHits = null;
  };

  #handleMouseWheel = (e: Wrapped<WheelEvent>) => {
    this.#dispatchEvent(e, "onWheel");
  };

  // --- touch emulation -----------------------------------------------------

  #touchPoint(touches: TouchList): { x: number; y: number } {
    let x = 0;
    let y = 0;
    for (let i = 0; i < touches.length; i++) {
      x += touches[i].clientX;
      y += touches[i].clientY;
    }
    return { x: x / touches.length, y: y / touches.length };
  }

  #touchSpan(touches: TouchList): number {
    if (touches.length < 2) return 0;
    return Math.hypot(
      touches[1].clientX - touches[0].clientX,
      touches[1].clientY - touches[0].clientY,
    );
  }

  #synthesizeMouse(
    type: "mousedown" | "mousemove" | "mouseup" | "click",
    point: { x: number; y: number },
    source: TouchEvent,
  ) {
    const event = new MouseEvent(type, {
      clientX: point.x,
      clientY: point.y,
      screenX: point.x,
      screenY: point.y,
      button: 0,
      buttons: type === "mouseup" || type === "click" ? 0 : 1,
      bubbles: true,
      cancelable: true,
      shiftKey: source.shiftKey,
      ctrlKey: source.ctrlKey,
      metaKey: source.metaKey,
      altKey: source.altKey,
    });
    (event as SyntheticPointerEvent).fromTouch = true;
    // Dispatched on the view so both the view listeners (this dispatcher) and
    // document listeners (drag tracking) observe it, exactly like a real mouse.
    this.#renderContext.view.dispatchEvent(event);
  }

  #handleTouchStart = (e: TouchEvent) => {
    if (this.#renderView == null) return;
    const touches = e.touches;
    if (touches.length === 1) {
      const point = this.#touchPoint(touches);
      // Only capture when the touch lands on something draggable; otherwise the
      // page keeps scrolling and the browser's compatibility mouse events fire.
      const detectors = this.#performHitTestAt(
        this.#convertToLocalPosition({ clientX: point.x, clientY: point.y } as MouseEvent),
      );
      if (!detectors.some(detector => detector.wantsDrag)) {
        this.#touch = null;
        return;
      }
      e.preventDefault();
      this.#touch = {
        start: point,
        last: point,
        moved: false,
        span: 0,
        pinching: false,
      };
      this.#synthesizeMouse("mousedown", point, e);
      return;
    }
    if (touches.length === 2) {
      const point = this.#touchPoint(touches);
      if (this.#touch == null) {
        // Two fingers at once: pan/zoom the pane under the midpoint, but only
        // when something there takes gestures; otherwise the page keeps its
        // own pinch-zoom and scroll.
        const detectors = this.#performHitTestAt(
          this.#convertToLocalPosition({ clientX: point.x, clientY: point.y } as MouseEvent),
        );
        if (!detectors.some(detector => detector.wantsDrag)) return;
        e.preventDefault();
        this.#touch = { start: point, last: point, moved: false, span: 0, pinching: false };
        this.#synthesizeMouse("mousedown", point, e);
      } else {
        e.preventDefault();
        // A second finger joined a drag: restart the emulated pointer at the
        // midpoint so the content does not jump to it.
        this.#reanchor(point, e);
      }
      this.#touch.pinching = true;
      this.#touch.span = this.#touchSpan(touches);
    }
  };

  /** End the emulated drag where it is and start a new one at `point` (no jump). */
  #reanchor(point: { x: number; y: number }, source: TouchEvent) {
    const session = this.#touch;
    if (session == null) return;
    this.#synthesizeMouse("mouseup", session.last, source);
    this.#synthesizeMouse("mousedown", point, source);
    session.last = point;
  }

  #handleTouchMove = (e: TouchEvent) => {
    const session = this.#touch;
    if (session == null) return;
    e.preventDefault();
    const touches = e.touches;
    const point = this.#touchPoint(touches);
    if (Math.hypot(point.x - session.start.x, point.y - session.start.y) > 4) {
      session.moved = true;
    }
    if (touches.length >= 2) {
      const span = this.#touchSpan(touches);
      if (session.pinching && session.span > 0 && span > 0) {
        const ratio = span / session.span;
        if (Math.abs(ratio - 1) > 1e-4) {
          const wheel = new WheelEvent("wheel", {
            clientX: point.x,
            clientY: point.y,
            deltaX: 0,
            // Chosen so the default wheel curve (exp(-pixels / 200)) reproduces the pinch ratio.
            deltaY: -200 * Math.log(ratio),
            deltaMode: 0,
            ctrlKey: true,
            bubbles: true,
            cancelable: true,
          }) as PinchWheelEvent;
          wheel.pinchScale = ratio;
          this.#renderContext.view.dispatchEvent(wheel);
        }
      }
      session.pinching = true;
      session.span = span;
    }
    this.#synthesizeMouse("mousemove", point, e);
    session.last = point;
  };

  #handleTouchEnd = (e: TouchEvent) => {
    const session = this.#touch;
    if (session == null) return;
    if (e.touches.length > 0) {
      // A finger lifted but others remain: continue from the new midpoint
      // without moving the content there.
      const point = this.#touchPoint(e.touches);
      session.pinching = e.touches.length >= 2;
      session.span = this.#touchSpan(e.touches);
      this.#reanchor(point, e);
      return;
    }
    e.preventDefault();
    this.#touch = null;
    this.#synthesizeMouse("mouseup", session.last, e);
    if (!session.moved && !session.pinching && e.type !== "touchcancel") {
      this.#synthesizeMouse("click", session.last, e);
    }
    // Touch has no hover: release detectors that saw mouseenter from the drag.
    this.#handleMouseLeave(e as unknown as Wrapped<MouseEvent>);
  };

  #handleMouseEnter = (_e: Wrapped<MouseEvent>) => {
    this.#updateRootPosition();
    this.#lastHoverPosition = null;
    this.#lastHoverHits = null;
  };

  #handleMouseLeave = (e: Wrapped<MouseEvent>) => {
    // trigger mouseleave for all previously hit detectors
    for (const detector of this.#previousHits) {
      detector.invokeCallback("onMouseLeave", e);
    }
    this.#previousHits = new Set();
    this.#rootPosition = null;

    if (this.#previousCursorDetector != null) {
      this.#previousCursorDetector = null;
      this.#renderContext.view.style.cursor = "default";
    }

    this.#isMouseDown = false;
    this.#activePointerHits = null;
    this.#lastPressHits = null;
    this.#lastHoverPosition = null;
    this.#lastHoverHits = null;
  };

  #convertToLocalPosition(e: MouseEvent): Offset {
    if (this.#rootPosition == null) {
      this.#updateRootPosition();
    }
    const rootPosition = this.#rootPosition!;
    const { translation, scale } = this.#renderContext.viewPort;
    const domX = e.clientX - rootPosition.x;
    const domY = e.clientY - rootPosition.y;
    return new Offset({
      x: domX / scale - translation.x,
      y: domY / scale - translation.y,
    });
  }

  #updateRootPosition() {
    const rect = this.#renderContext.view.getBoundingClientRect();
    this.#rootPosition = new Offset({
      x: rect.left,
      y: rect.top,
    });
  }

  #performHitTest(e: MouseEvent): RenderGestureDetector[] {
    if (this.#renderView == null) return [];
    const position = this.#convertToLocalPosition(e);
    return this.#performHitTestAt(position);
  }

  #performHoverHitTest(e: MouseEvent): RenderGestureDetector[] {
    const position = this.#convertToLocalPosition(e);
    if (
      this.#lastHoverPosition != null &&
      this.#lastHoverHits != null &&
      this.#lastHoverPosition.equals(position)
    ) {
      return this.#lastHoverHits;
    }

    const detectors = this.#performHitTestAt(position);
    this.#lastHoverPosition = position;
    this.#lastHoverHits = detectors;
    return detectors;
  }

  #performHitTestAt(position: Offset): RenderGestureDetector[] {
    if (this.#renderView == null) return [];
    const result = new HitTestResult();
    this.#renderView.hitTest(result, position);

    // extract gesture detectors from result path (child-first order)
    const detectors: RenderGestureDetector[] = [];
    for (const entry of result.path) {
      if (isGestureDetector(entry.target)) {
        detectors.push(entry.target);
      }
    }
    return detectors;
  }

  #dispatchDetectors(
    detectors: RenderGestureDetector[],
    e: Wrapped<MouseEvent | WheelEvent>,
    type: EventHandlerType,
  ) {
    for (const detector of detectors) {
      if (e.isPropagationStopped) return;
      detector.invokeCallback(type, e);
    }
  }

  #dispatchEvent = (
    e: Wrapped<MouseEvent | WheelEvent>,
    type: EventHandlerType,
  ) => {
    const detectors = this.#performHitTest(e);
    this.#dispatchDetectors(detectors, e, type);
  };

  #wrapEvent = <E extends Event>(callback: (e: Wrapped<E>) => void) =>
    ((e: E) => {
      const wrapped = e as Wrapped<E>;
      const stopPropagation = wrapped.stopPropagation.bind(wrapped);
      wrapped.stopPropagation = function () {
        wrapped.isPropagationStopped = true;
        stopPropagation();
      };
      return callback(wrapped);
    }) as EventListener;
}

function isGestureDetector(
  target: RenderObject,
): target is RenderGestureDetector {
  return (target as any).isRenderGestureDetector === true;
}

type Wrapped<E extends Event> = E & { isPropagationStopped: boolean };

type TouchSession = {
  start: { x: number; y: number };
  last: { x: number; y: number };
  moved: boolean;
  span: number;
  pinching: boolean;
};

/** Mouse event synthesized from touch input. */
export type SyntheticPointerEvent = MouseEvent & { fromTouch?: boolean };

/** Wheel event synthesized from a two-finger pinch; `pinchScale` is the zoom ratio of this step. */
export type PinchWheelEvent = WheelEvent & { pinchScale?: number };
