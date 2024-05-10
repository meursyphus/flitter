import type RenderObjectElement from "./element/RenderObjectElement";
import RenderObjectToWidgetAdapter from "./widget/RenderObjectToWidgetAdapter";
import type Widget from "./widget/Widget";
import {
  BuildOwner,
  RenderPipelineProvider,
  type RenderPipeline,
  Scheduler,
  RenderFrameDispatcher,
} from "./framework";
import { HitTestDispatcher } from "./hit-test/HitTestDispatcher";
import { RenderContext } from "./framework/renderer";
import { Constraints, type Size } from "./type";

type AppRunnerProps = {
  document?: Document;
  window?: Window;
  view: SVGSVGElement | HTMLCanvasElement;
  ssrSize?: { width: number; height: number };
};

export class AppRunner {
  private root!: RenderObjectElement;
  private renderContext: RenderContext;
  private viewSize?: { width: number; height: number };
  private buildOwner: BuildOwner;
  private renderPipeline: RenderPipeline;
  private scheduler: Scheduler;

  constructor({
    view,
    document: _document = document,
    window: _window = window,
    ssrSize,
  }: AppRunnerProps) {
    this.viewSize = ssrSize;

    this.renderContext = new RenderContext({
      view,
      viewSize: ssrSize,
      document: _document,
      window: _window,
      onResize: this.handleViewResize,
    });
    const renderFrameDispatcher = new RenderFrameDispatcher();
    this.scheduler = new Scheduler({ renderFrameDispatcher });
    this.buildOwner = new BuildOwner({
      onNeedVisualUpdate: () => this.scheduler.ensureVisualUpdate(),
    });

    const rendererType =
      view.tagName.toLowerCase() === "canvas" ? "canvas" : "svg";

    this.renderPipeline = new RenderPipelineProvider({
      onNeedVisualUpdate: () => this.scheduler.ensureVisualUpdate(),
      renderContext: this.renderContext,
      hitTestDispatcher: new HitTestDispatcher(),
    }).get(rendererType);

    this.scheduler.addPersistenceCallbacks(() => this.buildOwner.flushBuild());
    this.scheduler.addPersistenceCallbacks(() =>
      this.renderPipeline.drawFrame(),
    );
  }
  private didRun = false;

  private widget!: Widget;
  runApp(widget: Widget): string {
    this.widget = widget;
    if (this.viewSize == null) return "";

    this.root = new RenderObjectToWidgetAdapter({
      app: widget,
      buildOwner: this.buildOwner,
      renderPipeline: this.renderPipeline,
      scheduler: this.scheduler,
    }).createElement();
    this.root.mount(undefined);
    this.root.renderObject.constraints = Constraints.tight(this.viewSize);

    this.didRun = true;
    this.draw();

    return this.renderContext.view.innerHTML;
  }

  onMount({ resizeTarget }: { resizeTarget?: HTMLElement }) {
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
    this.renderPipeline.reinitializeFrame();
    this.scheduler.flushPostCallbacks();
  }

  dispose() {
    this.root.unmount();
    this.renderContext.dispose();
  }
}
