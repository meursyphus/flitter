import { Offset, Rect } from "../../../type";
import { Painter } from "../renderer";
import type { CanvasRenderPipeline } from "./canvas-renderer";
import type { CanvasPaintingContext } from "./canvas-painting-context";
import { OffsetLayer, type ContainerLayer, type Layer } from "./layer";
import { assert } from "../../../utils";

export class CanvasPainter extends Painter {
  get renderOwner(): CanvasRenderPipeline {
    return this.renderObject.renderOwner as CanvasRenderPipeline;
  }
  get isRepaintBoundary() {
    return false;
  }

  /** Whether replaying this painter can establish state for its descendants. */
  get paintsChildState(): boolean {
    return this.performPaint !== CanvasPainter.prototype.performPaint;
  }

  /** Preserve an ancestor effect around an independently retained picture. */
  wrapLayer(layer: Layer, _offset: Offset): Layer {
    return layer;
  }

  paint(context: CanvasPaintingContext, offset: Offset) {
    this.needsPaint = false;
    this.renderObject.needsCompositedLayerUpdate = false;
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

  #layer: ContainerLayer | null = null;
  get layer() {
    return this.#layer;
  }
  set layer(layer: ContainerLayer | null) {
    this.#layer = layer;
  }

  get compositedOffset(): Offset {
    let offset = this.offset;
    let node = this.renderObject.parent;

    while (node != null && node.canvasPainter.layer == null) {
      offset = node.offset.plus(offset);
      node = node.parent;
    }

    return offset;
  }

  updateCompositedLayer(oldLayer: ContainerLayer | null) {
    assert(
      this.isRepaintBoundary,
      "updateCompositedLayer must be called on a repaint boundary",
    );
    const layer = oldLayer ?? new OffsetLayer(Offset.Constants.zero);
    if (layer instanceof OffsetLayer) {
      layer.offset = this.compositedOffset;
    }
    return layer;
  }

  skippedPaintingOnLayer() {
    const layer = this.layer;
    if (layer == null || layer.attached) return;

    let node = this.renderObject.parent;
    while (node != null) {
      if (node.canvasPainter.isRepaintBoundary) {
        const ancestorLayer = node.canvasPainter.layer;
        if (ancestorLayer == null) {
          break;
        }
        if (ancestorLayer.attached) {
          break;
        }
        node.needsPaint = true;
      }
      node = node.parent;
    }
  }
}
