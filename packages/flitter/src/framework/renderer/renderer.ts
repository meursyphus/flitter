import type RenderObject from "../../renderobject/RenderObject";
import type { HitTestDispatcher } from "../../hit-test/HitTestDispatcher";
import { Size } from "../../type";

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
  private onResize: (size: Size) => void;

  constructor({
    document,
    window,
    view,
    onResize,
    viewSize,
  }: {
    document: Document;
    window: Window;
    view: SVGSVGElement | HTMLCanvasElement;
    viewSize?: { width: number; height: number };
    onResize: (size: Size) => void;
  }) {
    this.document = document;
    this.window = window;
    this.view = view;
    if (viewSize) {
      this.viewSize = new Size(viewSize);
    }
    this.onResize = onResize;
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
    this.resizeObserver.disconnect();
  }

  observeSize(target: HTMLElement) {
    this.resizeObserver = new ResizeObserver(([child]) => {
      const { width, height } = child.target.getBoundingClientRect();
      this.viewSize = new Size({ width, height });
      this.onResize(this.viewSize);
    });
    this.resizeObserver.observe(target);
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

  abstract drawFrame(): void;
  abstract reinitializeFrame(): void;
  protected abstract flushPaint(): void;
  protected abstract flushPaintTransformUpdate(): void;
  abstract disposeRenderObject(renderObject: RenderObject): void;
  abstract markNeedsPaint(renderObject: RenderObject): void;
  abstract markNeedsPaintTransformUpdate(renderObject: RenderObject): void;
}

export class Painter {
  renderObject: RenderObject;
  get size() {
    return this.renderObject.size;
  }
  constructor(renderObject: RenderObject) {
    this.renderObject = renderObject;
  }
}
