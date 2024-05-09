import type { RenderContext } from "../framework/renderer";
import type { RenderGestureDetector } from "../component/base/BaseGestureDetector";
import { Offset } from "../type";

type EventHandlerType =
  | "onClick"
  | "onMouseMove"
  | "onMouseUp"
  | "onMouseDown"
  | "onMouseWheel"
  | "onMouseEnter"
  | "onMouseLeave";

export class HitTestDispatcher {
  #activated = typeof window !== "undefined";
  #detectors: RenderGestureDetector[] = [];
  #rootPosition: Offset | null = null;
  #renderContext: RenderContext;
  #hitPosition: Offset = new Offset({ x: 0, y: 0 });

  init({ renderContext }: { renderContext: RenderContext }) {
    if (!this.#activated) return;
    this.#renderContext = renderContext;
    const { view } = this.#renderContext;

    view.addEventListener("mousedown", this.#wrapEvent(this.#handleMouseDown));
    view.addEventListener("click", this.#wrapEvent(this.#handleClick));
    view.addEventListener("mousemove", this.#wrapEvent(this.#handleMouseMove));
    view.addEventListener("mouseup", this.#wrapEvent(this.#handleMouseUp));
    view.addEventListener("wheel", this.#wrapEvent(this.#handleMouseWheel));

    view.addEventListener("mouseenter", this.#handleMouseEnter);
    view.addEventListener("mouseleave", this.#handleMouseLeave);
  }

  #handleMouseDown = (e: Wrapped<MouseEvent>) => {
    this.hitTest(e, "onMouseDown");
  };

  #handleClick = (e: Wrapped<MouseEvent>) => {
    this.hitTest(e, "onClick");
  };

  #hitHistory: boolean[] = [];
  #handleMouseMove = (e: Wrapped<MouseEvent>) => {
    this.traceHitPosition(e);
    this.hitTest(e, "onMouseMove");

    // trigger mouseenter event
    e.isPropagationStopped = false;
    for (const i in this.#detectors) {
      const detector = this.#detectors[i];
      if (e.isPropagationStopped) return;
      if (
        !this.#hitHistory[i] &&
        detector.hitTest({ globalPoint: this.#hitPosition })
      ) {
        detector.onMouseEnter(e);
      }
    }

    // trigger mouseleave event
    e.isPropagationStopped = false;
    for (const i in this.#detectors) {
      const detector = this.#detectors[i];
      if (e.isPropagationStopped) return;
      if (
        this.#hitHistory[i] &&
        !detector.hitTest({ globalPoint: this.#hitPosition })
      ) {
        detector.onMouseLeave(e);
      }
    }

    this.#detectors.forEach((detector, i) => {
      this.#hitHistory[i] = detector.hitTest({
        globalPoint: this.#hitPosition,
      });
    });
  };

  #handleMouseUp = (e: Wrapped<MouseEvent>) => {
    this.hitTest(e, "onMouseUp");
  };

  #handleMouseWheel = (e: Wrapped<WheelEvent>) => {
    this.hitTest(e, "onMouseWheel");
    e.isPropagationStopped = false;

    for (const detector of this.#detectors) {
      if (e.isPropagationStopped) return;
      if (!detector.hitTest({ globalPoint: this.#hitPosition })) continue;
      detector.onMouseEnter(e);
    }

    e.isPropagationStopped = false;
  };

  #handleMouseEnter = () => {
    const rect = this.#renderContext.view.getBoundingClientRect();
    this.#rootPosition = new Offset({
      x: rect.left,
      y: rect.top,
    });
  };

  #handleMouseLeave = () => {
    this.#rootPosition = null;
  };

  traceHitPosition(e: MouseEvent) {
    if (this.#rootPosition == null) return;
    this.#hitPosition.x = e.clientX - this.#rootPosition.x;
    this.#hitPosition.y = e.clientY - this.#rootPosition.y;
  }

  hitTest = (e: Wrapped<MouseEvent>, type: EventHandlerType) => {
    for (const detector of this.#detectors) {
      if (e.isPropagationStopped) return;
      if (!detector.hitTest({ globalPoint: this.#hitPosition })) continue;

      detector[type](e);
    }
  };

  #wrapEvent =
    <E extends Event>(callback: (e: E) => void) =>
    (e: Wrapped<E>) => {
      const stopPropagation = e.stopPropagation;
      e.stopPropagation = function () {
        e.isPropagationStopped = true;
        stopPropagation.call(e);
      };
      return callback(e);
    };

  /**
   * This code is for batch processing. The intention is not to perform the sorting operation every time this method is called,
   * but rather to ensure that the sorting happens only once in a batch manner. This is achieved by wrapping the sorting logic
   * inside a setTimeout, which defers the execution until the current call stack is clear, effectively coalescing multiple calls
   * into a single operation.
   */
  #didDomOrderChangeState: "idle" | "processing" = "idle";
  didChangeDomOrder() {
    if (this.#didDomOrderChangeState === "processing") return;
    this.#didDomOrderChangeState = "processing";
    setTimeout(() => {
      this.#detectors = this.#detectors.sort((a, b) => b.domOrder - a.domOrder);
      this.#didDomOrderChangeState = "idle";
    }, 0);
  }

  addDetector(detector: RenderGestureDetector) {
    if (!this.#activated) return;
    this.#detectors.push(detector);
  }

  removeDetector(detector: RenderGestureDetector) {
    if (!this.#activated) return;
    this.#detectors = this.#detectors.filter(d => d !== detector);
  }
}

type Wrapped<E extends Event> = E & { isPropagationStopped: boolean };
