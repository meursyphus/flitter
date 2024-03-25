import type RenderObjectElement from "./element/RenderObjectElement";
import { Size, Constraints } from "./type";
import type { PaintContext } from "./utils/type";
import RenderObjectToWidgetAdapter from "./widget/RenderObjectToWidgetAdapter";
import type Widget from "./widget/Widget";
import {
  BuildOwner,
  RenderOwner,
  Scheduler,
  RenderFrameDispatcher,
} from "./scheduler";
import { HitTestDispatcher } from "./hit-test/HitTestDispatcher";

type AppRunnerProps = {
  document?: Document;
  window?: Window;
  view: SVGSVGElement;
  ssrSize?: { width: number; height: number };
};

export class AppRunner {
  private root!: RenderObjectElement;
  private renderContext: RenderContext;
  private viewSize?: { width: number; height: number };
  private buildOwner: BuildOwner;
  private renderOwner: RenderOwner;
  private scheduler: Scheduler;

  constructor({
    view,
    document: _document = document,
    window: _window = window,
    ssrSize,
  }: AppRunnerProps) {
    this.viewSize = ssrSize;
    const renderContext = new RenderContext({
      view,
      document: _document,
      window: _window,
      onResize: this.handleViewResize,
    });
    const renderFrameDispatcher = new RenderFrameDispatcher();
    const scheduler = new Scheduler({ renderFrameDispatcher });
    const buildOwner = new BuildOwner({
      onNeedVisualUpdate: () => scheduler.ensureVisualUpdate(),
    });

    const renderOwner = new RenderOwner({
      onNeedVisualUpdate: () => scheduler.ensureVisualUpdate(),
      renderContext: renderContext,
      hitTestDispatcher: new HitTestDispatcher(),
    });

    scheduler.addPersistenceCallbacks(() => buildOwner.flushBuild());
    scheduler.addPersistenceCallbacks(() => renderOwner.drawFrame());
    this.buildOwner = buildOwner;
    this.renderOwner = renderOwner;
    this.scheduler = scheduler;
    this.renderContext = renderContext;
  }
  private didRun = false;

  private widget!: Widget;
  runApp(widget: Widget): string {
    this.widget = widget;
    if (this.viewSize == null) return "";

    this.root = new RenderObjectToWidgetAdapter({
      app: widget,
      buildOwner: this.buildOwner,
      renderOwner: this.renderOwner,
      scheduler: this.scheduler,
    }).createElement();
    this.root.mount(undefined);
    this.root.renderObject.constraints = Constraints.tight(this.viewSize);

    this.didRun = true;
    this.draw();

    return this.renderContext.view.innerHTML;
  }

  setConfig({
    document,
    window,
    view,
  }: {
    document?: Document;
    window?: Window;
    view?: SVGSVGElement;
  }) {
    if (document) this.renderContext.document = document;
    if (window) this.renderContext.window = window;
    if (view) this.renderContext.view = view;
    this.renderOwner.renderContext = this.renderContext;
  }

  onMount({
    view,
    resizeTarget,
  }: {
    view?: SVGSVGElement;
    resizeTarget?: HTMLElement;
  }) {
    this.setConfig({
      view,
      window,
      document,
    });
    resizeTarget && this.renderContext.observeSize(resizeTarget);
  }

  handleViewResize = (size: Size) => {
    this.viewSize = size;
    if (this.didRun) {
      this.draw();
    } else {
      this.runApp(this.widget);
    }
  };

  draw() {
    this.layout();
    this.renderOwner.rearrangeDomOrder();
    this.paint();
    this.scheduler.flushPostCallbacks();
  }

  rebuild() {
    this.root.children[0].rebuild();
  }

  layout() {
    const rootRenderObject = this.root.renderObject;
    rootRenderObject.layout(Constraints.tight(this.viewSize));
  }

  paint() {
    const rootRenderObject = this.root.renderObject;
    rootRenderObject.paint(this.renderContext.paintContext);
  }

  dispose() {
    this.root.unmount();
    this.renderContext.dispose();
  }
}

export class RenderContext {
  document: Document;
  window: Window;
  view: SVGSVGElement;
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
  }: {
    document: Document;
    window: Window;
    view: SVGSVGElement;
    onResize: (size: Size) => void;
  }) {
    this.document = document;
    this.window = window;
    this.view = view;
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
  get paintContext(): PaintContext {
    const { document: _document, view } = this;
    return {
      isOnBrowser: typeof this.window !== "undefined",
      createSvgEl(tagName) {
        const el = _document.createElementNS(
          "http://www.w3.org/2000/svg",
          tagName,
        ) as unknown as SVGElement;
        return el;
      },
      appendSvgEl(el) {
        view.appendChild(el);
      },
      insertSvgEl(el, index: number) {
        const child = view.children[index];
        if (child == null) {
          view.appendChild(el);
          return;
        }

        child.insertAdjacentElement("beforebegin", el);
      },
    };
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
