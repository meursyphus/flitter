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
    this.#dispatchEvent(e, "onMouseDown");
  };

  #handleClick = (e: Wrapped<MouseEvent>) => {
    this.#dispatchEvent(e, "onClick");
  };

  #previousHits: Set<RenderGestureDetector> = new Set();
  #previousCursorDetector: RenderGestureDetector | null = null;

  #handleMouseMove = (e: Wrapped<MouseEvent>) => {
    const hitDetectors = this.#performHitTest(e);

    // dispatch onMouseMove
    for (const detector of hitDetectors) {
      if (e.isPropagationStopped) break;
      detector.invokeCallback("onMouseMove", e);
    }

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
    this.#dispatchEvent(e, "onMouseUp");
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

  #dispatchEvent = (
    e: Wrapped<MouseEvent | WheelEvent>,
    type: EventHandlerType,
  ) => {
    const detectors = this.#performHitTest(e);
    for (const detector of detectors) {
      if (e.isPropagationStopped) return;
      detector.invokeCallback(type, e);
    }
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
