import { ContainerLayer } from "../framework/renderer/canvas/layer";
import type { CanvasRenderPipeline } from "../framework/renderer/canvas/canvas-renderer";
import { type RenderPipeline, CanvasPainter } from "../framework";
import { Size, Constraints } from "../type";
import RenderObject from "./RenderObject";

class RenderView extends RenderObject {
  constructor({ renderOwner }: { renderOwner: RenderPipeline }) {
    super({ isPainter: false });
    this.renderOwner = renderOwner;
    this.renderOwner.renderView = this;
    this.constraints = Constraints.tight({ width: 0, height: 0 });
  }
  preformLayout(): void {
    const constraint = this.constraints;
    if (!constraint.isTight)
      throw new Error("constraint must be tight on render view");
    if (constraint.maxWidth === 0 || constraint.maxHeight === 0) return;
    this.size = new Size({
      width: constraint.maxWidth,
      height: constraint.maxHeight,
    });
    this.children.forEach(child => child.layout(Constraints.loose(this.size)));
  }

  protected createCanvasPainter(): CanvasPainter {
    return new RootCanvasPainter(this);
  }
}

class RootCanvasPainter extends CanvasPainter {
  constructor(renderView: RenderView) {
    super(renderView);
    this.layer = new ContainerLayer();
    this.layer.attach(renderView.renderOwner as CanvasRenderPipeline);
  }
  override get isRepaintBoundary() {
    return true;
  }
}

export default RenderView;
