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

  init({ renderContext }: { renderContext: RenderContext }) {
    if (!this.#activated) return;
    this.#renderContext = renderContext;
    const { view } = this.#renderContext;

    view.addEventListener("mousedown", this.#wrapEvent(this.#handleMouseDown));
    view.addEventListener("click", this.#wrapEvent(this.#handleClick));
    view.addEventListener("mousemove", this.#wrapEvent(this.#handleMouseMove));
    view.addEventListener("mouseup", this.#wrapEvent(this.#handleMouseUp));
    view.addEventListener("wheel", this.#wrapEvent(this.#handleMouseWheel));

    view.addEventListener("mouseenter", this.#wrapEvent(this.#handleMouseEnter));
    view.addEventListener("mouseleave", this.#wrapEvent(this.#handleMouseLeave));
  }

  setRenderView(renderView: RenderObject) {
    this.#renderView = renderView;
  }

  #handleMouseDown = (e: Wrapped<MouseEvent>) => {
    const detectors = this.#performHitTest(e);
    this.#isMouseDown = true;
    this.#activePointerHits = detectors;
    this.#lastPressHits = detectors;
    this.#dispatchDetectors(detectors, e, "onMouseDown");
  };

  #handleClick = (e: Wrapped<MouseEvent>) => {
    const detectors = this.#lastPressHits ?? this.#performHitTest(e);
    this.#lastPressHits = null;
    this.#dispatchDetectors(detectors, e, "onClick");
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
    const rect = this.#renderContext.view.getBoundingClientRect();
    this.#rootPosition = new Offset({
      x: rect.left,
      y: rect.top,
    });
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
      return new Offset({ x: 0, y: 0 });
    }
    const { translation, scale } = this.#renderContext.viewPort;
    const domX = e.clientX - this.#rootPosition.x;
    const domY = e.clientY - this.#rootPosition.y;
    return new Offset({
      x: domX / scale - translation.x,
      y: domY / scale - translation.y,
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

  #wrapEvent =
    <E extends Event>(callback: (e: Wrapped<E>) => void) =>
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
