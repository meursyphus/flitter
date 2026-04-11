import { Rect, type Offset } from "../../../type";
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

  get paintBounds(): Rect {
    return Rect.fromLTWH({
      left: 0,
      top: 0,
      width: this.size.width,
      height: this.size.height,
    });
  }

  #layer!: ContainerLayer;
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

  createAncestorLayer(_offset: Offset): ContainerLayer | null {
    return null;
  }

  skippedPaintingOnLayer() {
    assert(
      this.isRepaintBoundary,
      "skippedPaintingOnLayer must be called on a repaint boundary",
    );
    assert(this.layer != null, "layer must exist on skippedPaintingOnLayer");
    assert(!this.layer.attached, "layer must be detached on skippedPaintingOnLayer");

    let node = this.renderObject.parent;
    while (node != null) {
      if (node.canvasPainter.isRepaintBoundary) {
        const layer = node.canvasPainter.layer;
        if (layer == null) {
          break;
        }
        if (layer.attached) {
          this.renderOwner.scheduleRepaintBoundary(node, { needsPaint: true });
          break;
        }
        node.needsPaint = true;
      }
      node = node.parent;
    }
  }
}
