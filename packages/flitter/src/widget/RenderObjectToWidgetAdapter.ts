import type { RenderObjectElement } from "../element";
import type RenderObject from "../renderobject/RenderObject";
import type { RenderContext } from "../framework/renderer";
import type { BuildOwner, RenderPipeline, Scheduler } from "../framework";
import RenderView from "../renderobject/RenderView";
import RenderObjectWidget from "./RenderObjectWidget";
import type Widget from "./Widget";

class RenderObjectToWidgetAdapter extends RenderObjectWidget {
  renderPipeline: RenderPipeline;
  buildOwner: BuildOwner;
  renderContext: RenderContext;
  scheduler: Scheduler;
  constructor({
    app,
    renderPipeline,
    buildOwner,
    scheduler,
  }: {
    app: Widget;
    renderPipeline: RenderPipeline;
    buildOwner: BuildOwner;
    scheduler: Scheduler;
  }) {
    super({ children: [app] });
    this.renderPipeline = renderPipeline;
    this.buildOwner = buildOwner;
    this.scheduler = scheduler;
  }

  createElement(): RenderObjectElement {
    const el = super.createElement();
    el.buildOwner = this.buildOwner;
    el.scheduler = this.scheduler;
    return el;
  }

  createRenderObject(): RenderObject {
    return new RenderView({ renderOwner: this.renderPipeline });
  }

  updateRenderObject(renderObject: RenderObject): void {
    renderObject.renderOwner = this.renderPipeline;
  }
}

export default RenderObjectToWidgetAdapter;
