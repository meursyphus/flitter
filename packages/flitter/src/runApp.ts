import type RenderObjectElement from "./element/RenderObjectElement";
import RenderObjectToWidgetAdapter from "./widget/RenderObjectToWidgetAdapter";
import type Widget from "./widget/Widget";
import {
  BuildOwner,
  RenderOwner,
  Scheduler,
  RenderFrameDispatcher,
} from "./framework";
import { HitTestDispatcher } from "./hit-test/HitTestDispatcher";
import { RenderContext } from "./framework/renderer";
import { Constraints, type Size } from "./type";

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
