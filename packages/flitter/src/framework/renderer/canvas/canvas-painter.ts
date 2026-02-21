import { Rect, type Offset } from "../../../type";
import { NotImplementedError } from "../../../exception";
import { Painter } from "../renderer";
import type { CanvasRenderPipeline } from "./canvas-renderer";
import type { CanvasPaintingContext } from "./canvas-painting-context";
import { OffsetLayer, type ContainerLayer } from "./layer";
import { assert } from "../../../utils";

export class CanvasPainter extends Painter {
  get renderOwner(): CanvasRenderPipeline {
    return this.renderObject.renderOwner as CanvasRenderPipeline;
  }
  get isRepaintBoundary() {
    return false;
  }

  paint(context: CanvasPaintingContext, offset: Offset) {
    this.needsPaint = false;
    this.performPaint(context, offset);
  }

  protected performPaint(context: CanvasPaintingContext, offset: Offset) {
    this.defaultPaint(context, offset);
  }

  protected defaultPaint(context: CanvasPaintingContext, offset: Offset) {
    this.renderObject.visitChildren(child => {
      context.paintChild(child, offset.plus(child.offset));
    });
  }

  /**
   * Whether this painter modifies canvas state (transform, clip, opacity)
   * that descendants need to inherit. Override in subclasses.
   */
  get hasCanvasState(): boolean {
    return false;
  }

  /**
   * Apply this painter's canvas state modifications without painting children.
   * Called during z-ordered painting to replay ancestor state chain.
   * Override in subclasses that modify canvas state.
   */
  applyCanvasState(
    _ctx: CanvasRenderingContext2D,
    _offset: Offset,
  ): void {
    // Base: no-op
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
