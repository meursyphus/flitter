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
