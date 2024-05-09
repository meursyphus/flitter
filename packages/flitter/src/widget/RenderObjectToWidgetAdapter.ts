import type { RenderObjectElement } from "../element";
import type RenderObject from "../renderobject/RenderObject";
import type { RenderContext } from "../framework/renderer";
import type { BuildOwner, RenderOwner, Scheduler } from "../framework";
import RenderView from "../renderobject/RenderView";
import RenderObjectWidget from "./RenderObjectWidget";
import type Widget from "./Widget";

class RenderObjectToWidgetAdapter extends RenderObjectWidget {
  renderOwner: RenderOwner;
  buildOwner: BuildOwner;
  renderContext: RenderContext;
  scheduler: Scheduler;
  constructor({
    app,
    renderOwner,
    buildOwner,
    scheduler,
  }: {
    app: Widget;
    renderOwner: RenderOwner;
    buildOwner: BuildOwner;
    scheduler: Scheduler;
  }) {
    super({ children: [app] });
    this.renderOwner = renderOwner;
    this.buildOwner = buildOwner;
    this.renderContext = renderOwner.renderContext;
    this.scheduler = scheduler;
  }

  createElement(): RenderObjectElement {
    const el = super.createElement();
    el.renderContext = this.renderContext;
    el.buildOwner = this.buildOwner;
    el.scheduler = this.scheduler;
    return el;
  }

  createRenderObject(): RenderObject {
    return new RenderView({ renderOwner: this.renderOwner });
  }

  updateRenderObject(renderObject: RenderObject): void {
    renderObject.renderOwner = this.renderOwner;
  }
}

export default RenderObjectToWidgetAdapter;
