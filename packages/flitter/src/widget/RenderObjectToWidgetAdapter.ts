import type { RenderObjectElement } from "../element";
import type RenderObject from "../renderobject/RenderObject";
import type { RenderContext } from "../runApp";
import type { BuildOwner, RenderOwner, Scheduler } from "../scheduler";
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
    renderContext,
    scheduler,
  }: {
    app: Widget;
    renderOwner: RenderOwner;
    buildOwner: BuildOwner;
    renderContext: RenderContext;
    scheduler: Scheduler;
  }) {
    super({ children: [app] });
    this.renderOwner = renderOwner;
    this.buildOwner = buildOwner;
    this.renderContext = renderContext;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateRenderObject(renderObject: RenderObject): void {
    //
  }
}

export default RenderObjectToWidgetAdapter;
