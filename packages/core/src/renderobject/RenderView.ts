import { ContainerLayer } from "../framework/renderer/canvas/layer";
import type { CanvasRenderPipeline } from "../framework/renderer/canvas/canvas-renderer";
import { RenderPipeline } from "../framework/renderer/renderer";
import { CanvasPainter } from "../framework/renderer/canvas/canvas-painter";
import { Size, Constraints } from "../type";
import RenderObject from "./RenderObject";

class RenderView extends RenderObject {
  constructor({ renderOwner }: { renderOwner: RenderPipeline }) {
    super({ isPainter: false });
    this.renderOwner = renderOwner;
    this.renderOwner.renderView = this;
    this.renderOwner.hitTestDispatcher.setRenderView(this);
    this.constraints = Constraints.tight({ width: 0, height: 0 });
  }
  override get sizedByParent(): boolean {
    return true;
  }

  protected override performResize(): void {
    const constraint = this.constraints;
    if (!constraint.isTight)
      throw new Error("constraint must be tight on render view");

    this.size = new Size({
      width: constraint.maxWidth,
      height: constraint.maxHeight,
    });
  }

  protected override computeDryLayout(constraints: Constraints): Size {
    if (!constraints.isTight)
      throw new Error("constraint must be tight on render view");

    return constraints.biggest;
  }

  preformLayout(): void {
    const constraint = this.constraints;
    if (!constraint.isTight)
      throw new Error("constraint must be tight on render view");
    if (constraint.maxWidth === 0 || constraint.maxHeight === 0) return;
    this.children.forEach(child =>
      child.layout(Constraints.loose(this.size), { parentUsesSize: false })
    );
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
