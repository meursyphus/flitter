import { Rect } from "../../../type";
import { NotImplementedError } from "../../../exception";
import { Painter } from "../renderer";
import type { CanvasRenderPipeline } from "./canvas-renderer";
import type { CanvasPaintingContext } from "./canvas-painting-context";
import { OffsetLayer, type ContainerLayer } from "./layer";
import { assert } from "src/utils";

export class CanvasPainter extends Painter {
  get renderOwner(): CanvasRenderPipeline {
    return this.renderObject.renderOwner as CanvasRenderPipeline;
  }
  get isRepaintBoundary() {
    return false;
  }

  paint(context: CanvasPaintingContext) {
    this.needsPaint = false;
    context.canvas.translate(this.offset.x, this.offset.y);
    this.performPaint(context);
    this.#paintChildren(context);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected performPaint(context: CanvasPaintingContext) {}

  #paintChildren(context: CanvasPaintingContext) {
    this.renderObject.visitChildren(child => {
      child.canvasPainter.paint(context);
    });
  }

  get paintBounds(): Rect {
    return Rect.fromLTWH({
      left: this.offset.x,
      top: this.offset.y,
      width: this.size.width,
      height: this.size.height,
    });
  }

  #layer: ContainerLayer;
  get layer() {
    return this.#layer;
  }
  set layer(layer: ContainerLayer) {
    this.#layer = layer;
  }
  updateCompositedLayer(oldLayer: ContainerLayer | null) {
    assert(
      this.isRepaintBoundary,
      "updateCompositedLayer must be called on a repaint boundary",
    );
    return oldLayer ?? new OffsetLayer();
  }

  skippedPaintingOnLayer() {
    throw new NotImplementedError("skippedPaintingOnLayer on CanvasPainter");
  }
}
