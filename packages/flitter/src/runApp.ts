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
  private renderDispatcher: RenderFrameDispatcher;

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
    });
    const renderDispatcher = new RenderFrameDispatcher();
    const buildOwner = new BuildOwner({
      onNeedVisualUpdate: () => renderDispatcher.dispatch(),
    });
    const renderOwner = new RenderOwner({
      onNeedVisualUpdate: () => renderDispatcher.dispatch(),
      paintContext: renderContext.paintContext,
    });
    const scheduler = new Scheduler();
    scheduler.addPersistenceCallbacks(() => buildOwner.flushBuild());
    scheduler.addPersistenceCallbacks(() => renderOwner.drawFrame());
    renderDispatcher.setOnFrame(() => scheduler.schedule());
    this.buildOwner = buildOwner;
    this.renderOwner = renderOwner;
    this.scheduler = scheduler;
    this.renderDispatcher = renderDispatcher;
    this.renderContext = renderContext;
  }
  private didRun = false;

  private widget!: Widget;
  runApp(widget: Widget): string {
    this.widget = widget;
    if (this.viewSize == null) return ``;

    this.root = new RenderObjectToWidgetAdapter({
      app: widget,
      buildOwner: this.buildOwner,
      renderOwner: this.renderOwner,
      renderContext: this.renderContext,
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
    this.renderOwner.paintContext = this.renderContext.paintContext;
  }

  onMount({
    view,
    resizeTarget: resizeTarget,
  }: {
    view?: SVGSVGElement;
    resizeTarget?: HTMLElement;
  }) {
    this.setConfig({
      view,
      window,
      document,
    });
    resizeTarget && this.observeCanvasSize(resizeTarget);
  }

  observeCanvasSize(target: HTMLElement) {
    const resize = (child: ResizeObserverEntry) => {
      const { width, height } = child.target.getBoundingClientRect();
      this.renderContext.view.setAttribute("width", `${width}`);
      this.renderContext.view.setAttribute("height", `${height}`);
      this.viewSize = new Size({ width, height });
    };
    const resizeObserver = new ResizeObserver((entries) => {
      const child = entries[0];
      resize(child);
      if (this.didRun) {
        this.draw();
      } else {
        this.runApp(this.widget);
      }
    });
    resizeObserver.observe(target);
  }

  draw() {
    this.layout();
    this.paint();
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
}

export class RenderContext {
  document: Document;
  window: Window;
  view: SVGSVGElement;
  constructor({
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
          tagName
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
}
