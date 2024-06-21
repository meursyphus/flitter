import type RenderObject from "../../renderobject/RenderObject";
import type { RenderObjectVisitor } from "../../renderobject/RenderObjectVisitor";
import type { HitTestDispatcher } from "../../hit-test/HitTestDispatcher";
import { type Matrix4, type Offset, Size } from "../../type";
import type { RenderZIndex } from "../../component/base/BaseZIndex";
import { RenderGestureDetector } from "src/component/base/BaseGestureDetector";

export class RenderContext {
  document: Document;
  window: Window;
  view: SVGSVGElement | HTMLCanvasElement;
  viewPort: { translation: { x: number; y: number }; scale: number } = {
    translation: { x: 0, y: 0 },
    scale: 1,
  };
  viewSize: Size = new Size({ width: 0, height: 0 });
  private resizeObserver: ResizeObserver;
  #resizeHandlers: ((size: Size) => void)[] = [];

  constructor({
    document,
    window,
    view,
    viewSize,
  }: {
    document: Document;
    window: Window;
    view: SVGSVGElement | HTMLCanvasElement;
    viewSize?: { width: number; height: number };
  }) {
    this.document = document;
    this.window = window;
    this.view = view;
    if (viewSize) {
      this.viewSize = new Size(viewSize);
    }
  }

  setViewport({
    translation,
    scale,
  }: {
    translation: { x: number; y: number };
    scale: number;
  }) {
    this.viewPort = { translation, scale };
    this.view.setAttribute(
      "viewBox",
      `${-this.viewPort.translation.x} ${-this.viewPort.translation.y} ${this.viewSize.width / this.viewPort.scale} ${this.viewSize.height / this.viewPort.scale}`,
    );
  }

  setConfig({
    document,
    window,
    view,
  }: {
    document: Document;
    window: Window;
    view: SVGSVGElement;
  }) {
    this.document = document;
    this.window = window;
    this.view = view;
  }

  dispose() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  observeSize(target: HTMLElement) {
    this.resizeObserver = new ResizeObserver(([child]) => {
      const { width, height } = child.target.getBoundingClientRect();
      this.viewSize = new Size({ width, height });
      this.#resizeHandlers.forEach(handler => handler(this.viewSize));
    });
    this.resizeObserver.observe(target);
  }

  addResizeHandler(handler: (size: Size) => void) {
    this.#resizeHandlers.push(handler);
  }
}

export abstract class RenderPipeline {
  hitTestDispatcher: HitTestDispatcher;
  readonly renderContext: RenderContext;
  private onNeedVisualUpdate: () => void;
  needsPaintRenderObjects: RenderObject[] = [];
  needsLayoutRenderObjects: RenderObject[] = [];
  needsPaintTransformUpdateRenderObjects: RenderObject[] = [];
  /*
   this will be set by RenderView
  */
  renderView!: RenderObject;
  constructor({
    onNeedVisualUpdate,
    renderContext,
    hitTestDispatcher,
  }: {
    onNeedVisualUpdate: () => void;
    renderContext: RenderContext;
    hitTestDispatcher: HitTestDispatcher;
  }) {
    this.onNeedVisualUpdate = onNeedVisualUpdate;
    this.renderContext = renderContext;
    this.hitTestDispatcher = hitTestDispatcher;
    this.hitTestDispatcher.init({ renderContext: this.renderContext });
  }

  requestVisualUpdate() {
    this.onNeedVisualUpdate();
  }

  protected flushLayout() {
    const dirties = this.needsLayoutRenderObjects;
    this.needsLayoutRenderObjects = [];

    dirties
      .sort((a, b) => a.depth - b.depth)
      .forEach(renderObject => {
        if (!renderObject.needsLayout) return;
        renderObject.layoutWithoutResize();
      });
  }

  #zOrderChanged = false;
  notifyZOrderChanged() {
    this.#zOrderChanged = true;
    this.requestVisualUpdate();
  }
  protected recalculateZOrder() {
    if (!this.#zOrderChanged) return [];
    this.#zOrderChanged = false;
    const visitor = new ZOrderCalculatorVisitor();
    this.renderView.accept(visitor);
    const painterRenderObjects = visitor.getRenderObjectsByDomOrder();

    for (let i = painterRenderObjects.length - 1; i >= 0; i--) {
      const renderObject = painterRenderObjects[i];
      renderObject.updateZOrder(i);
    }
    return painterRenderObjects;
  }

  abstract drawFrame(): void;
  abstract reinitializeFrame(): void;
  protected abstract flushPaint(): void;
  protected flushPaintTransformUpdate(): void {
    const dirties = this.needsPaintTransformUpdateRenderObjects;
    this.needsPaintTransformUpdateRenderObjects = [];

    dirties
      .sort((a, b) => a.depth - b.depth)
      .forEach(renderObject => {
        if (!renderObject.needsPaintTransformUpdate) return;
        renderObject.updatePaintTransform();
      });
  }
  abstract disposeRenderObject(renderObject: RenderObject): void;
  abstract markNeedsPaint(renderObject: RenderObject): void;
  abstract markNeedsPaintTransformUpdate(renderObject: RenderObject): void;
  abstract didChangePaintTransform(renderObject: RenderObject): void;
}

export class Painter {
  renderObject: RenderObject;
  get size() {
    return this.renderObject.size;
  }
  constructor(renderObject: RenderObject) {
    this.renderObject = renderObject;
  }
  get isPainter(): boolean {
    return this.renderObject.isPainter;
  }
  get needsPaint(): boolean {
    return this.renderObject.needsPaint;
  }
  set needsPaint(newValue: boolean) {
    this.renderObject.needsPaint = newValue;
  }
  get offset(): Offset {
    return this.renderObject.offset;
  }
  get type(): string {
    return this.renderObject.type;
  }
  get needsPaintTransformUpdate(): boolean {
    return this.renderObject.needsPaintTransformUpdate;
  }
  set needsPaintTransformUpdate(newValue: boolean) {
    this.renderObject.needsPaintTransformUpdate = newValue;
  }
  get paintTransform(): Matrix4 {
    return this.renderObject.paintTransform;
  }
  set paintTransform(newValue: Matrix4) {
    this.renderObject.paintTransform = newValue;
  }
}

type StackingContext = {
  zIndex: number;
  visitedOrder: number;
};

export class ZOrderCalculatorVisitor implements RenderObjectVisitor {
  private collectedRenderObjects: {
    renderObject: RenderObject;
    visitedOrder: number;
    contexts: StackingContext[];
  }[] = [];
  private currentVisitedOrder = 0;
  private currentStackingContext: StackingContext[] = [];

  #visit(
    renderObject: RenderObject,
    { willCollect }: { willCollect: boolean },
  ) {
    if (willCollect) {
      this.collectedRenderObjects.push({
        renderObject,
        contexts: this.currentStackingContext,
        visitedOrder: this.currentVisitedOrder++,
      });
    }

    renderObject.visitChildren(child => {
      child.accept(this);
    });
  }

  visit(renderObject: RenderObject): void {
    /**
     * @todo: renderObject's isPainter must moved to svgPainter.isPainter
     */
    this.#visit(renderObject, {
      willCollect: renderObject.isPainter,
    });
  }

  visitGestureDetector(gestureDetector: RenderGestureDetector): void {
    this.#visit(gestureDetector, { willCollect: true });
  }

  visitZIndex(renderObject: RenderZIndex) {
    this.currentStackingContext = [...this.currentStackingContext];
    this.currentStackingContext.push({
      visitedOrder: this.currentVisitedOrder,
      zIndex: renderObject.zIndex,
    });

    this.#visit(renderObject, { willCollect: false });

    this.currentStackingContext = [...this.currentStackingContext];
    this.currentStackingContext.pop();
  }

  getRenderObjectsByDomOrder(): RenderObject[] {
    const sorted = this.collectedRenderObjects.sort((a, b) => {
      const limit = Math.min(a.contexts.length, b.contexts.length);

      for (let i = 0; i < limit; i++) {
        const aContext = a.contexts[i];
        const bContext = b.contexts[i];

        if (aContext.zIndex !== bContext.zIndex) {
          return aContext.zIndex - bContext.zIndex;
        } else if (aContext.visitedOrder !== bContext.visitedOrder) {
          return aContext.visitedOrder - bContext.visitedOrder;
        }
      }

      if (limit > 0) {
        const lastContext = a.contexts[limit - 1];

        if (
          lastContext.visitedOrder === a.visitedOrder ||
          lastContext.visitedOrder === b.visitedOrder
        ) {
          return a.visitedOrder - b.visitedOrder;
        }
      }

      if (a.contexts.length !== b.contexts.length) {
        const aContext = a.contexts[limit] ?? {
          visitedOrder: a.visitedOrder,
          zIndex: 0,
        };
        const bContext = b.contexts[limit] ?? {
          visitedOrder: b.visitedOrder,
          zIndex: 0,
        };

        if (aContext.zIndex !== bContext.zIndex) {
          return aContext.zIndex - bContext.zIndex;
        } else if (aContext.visitedOrder !== bContext.visitedOrder) {
          return aContext.visitedOrder - bContext.visitedOrder;
        }
      }

      return a.visitedOrder - b.visitedOrder;
    });

    return sorted.map(({ renderObject }) => renderObject);
  }
}
