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
import { RenderContext } from "./framework/renderer/renderer";
import { Constraints } from "./type";
import PerfTimeline from "./framework/PerfTimeline";

export type AppRunnerPerfConfig =
  | boolean
  | {
      enabled?: boolean;
    };

type RunAppOptions = {
  perf?: AppRunnerPerfConfig;
};

function resolvePerfEnabled(perf?: AppRunnerPerfConfig): boolean {
  if (typeof perf === "boolean") {
    return perf;
  }

  return perf?.enabled === true;
}

type AppRunnerProps = {
  document?: Document;
  perf?: AppRunnerPerfConfig;
  window?: Window;
  view: SVGSVGElement | HTMLCanvasElement;
  ssrSize?: { width: number; height: number };
};

export class AppRunner {
  private root!: RenderObjectElement;
  private renderContext: RenderContext;
  private buildOwner: BuildOwner;
  private renderPipeline: RenderPipeline;
  private scheduler: Scheduler;
  private rendererType: "canvas" | "svg";
  private perfTimeline: PerfTimeline;

  constructor({
    view,
    document: _document = document,
    perf,
    window: _window = window,
    ssrSize,
  }: AppRunnerProps) {
    this.renderContext = new RenderContext({
      view,
      viewSize: ssrSize,
      document: _document,
      window: _window,
    });
    this.renderContext.addResizeHandler(() => this.handleViewResize());
    const renderFrameDispatcher = new RenderFrameDispatcher();
    this.scheduler = new Scheduler({ renderFrameDispatcher });
    this.perfTimeline = new PerfTimeline({
      enabled: resolvePerfEnabled(perf),
      performance: _window?.performance,
    });
    this.buildOwner = new BuildOwner({
      onNeedVisualUpdate: () => this.scheduler.ensureVisualUpdate(),
    });

    this.rendererType =
      view.tagName.toLowerCase() === "canvas" ? "canvas" : "svg";

    this.renderPipeline = new RenderPipelineProvider({
      onNeedVisualUpdate: () => this.scheduler.ensureVisualUpdate(),
      perfTimeline: this.perfTimeline,
      renderContext: this.renderContext,
      hitTestDispatcher: new HitTestDispatcher(),
    }).get(this.rendererType)!;

    this.scheduler.addPersistenceCallbacks(() => this.buildOwner.flushBuild());
    this.scheduler.addPersistenceCallbacks(() =>
      this.renderPipeline.drawFrame(),
    );
    this.scheduler.addPersistenceCallbacks(() =>
      this.buildOwner.finalizeTree(),
    );
  }
  private didRun = false;

  private widget!: Widget;
  runApp(widget: Widget, options: RunAppOptions = {}): string {
    if (options.perf != null) {
      this.perfTimeline.setEnabled(resolvePerfEnabled(options.perf));
    }

    return this.perfTimeline.measure("runApp", () => {
      this.widget = widget;
      if (
        this.renderContext.viewSize == null ||
        this.renderContext.viewSize.width === 0 ||
        this.renderContext.viewSize.height === 0
      )
        return "";

      if (this.root) {
        this.root.unmountRecursively();
        this.buildOwner.finalizeTree();
        this.root = null as unknown as RenderObjectElement;
      }

      this.root = new RenderObjectToWidgetAdapter({
        app: widget,
        buildOwner: this.buildOwner,
        renderPipeline: this.renderPipeline,
        scheduler: this.scheduler,
      }).createElement();
      this.perfTimeline.measure("mount", () => this.root.mount(undefined));
      this.root.renderObject.constraints = Constraints.tight(
        this.renderContext.viewSize,
      );

      this.didRun = true;
      this.draw();

      return this.renderContext.view.innerHTML;
    });
  }

  onMount({ resizeTarget }: { resizeTarget?: HTMLElement }) {
    resizeTarget && this.renderContext.observeSize(resizeTarget);
  }

  handleViewResize = () => {
    if (this.didRun) {
      this.draw();
    } else {
      this.runApp(this.widget);
    }
  };

  draw() {
    this.perfTimeline.measure("draw", () => {
      this.renderPipeline.reinitializeFrame();
      this.buildOwner.finalizeTree();
      this.scheduler.flushPostCallbacks();
    });
  }

  dispose() {
    if (this.root) {
      this.root.unmountRecursively();
      this.buildOwner.finalizeTree();
      this.root = null as unknown as RenderObjectElement;
    }
    this.renderContext.dispose();
  }
}
