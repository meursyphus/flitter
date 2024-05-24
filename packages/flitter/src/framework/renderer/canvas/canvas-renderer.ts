import type { RenderObject } from "../../../renderobject/RenderObject";
import { RenderPipeline } from "../renderer";
import { Constraints } from "../../../type";
import { CanvasPaintingContext } from "./canvas-painting-context";
import { assert } from "../../../utils";
import { SceneBuilder } from "./layer";

export class CanvasRenderPipeline extends RenderPipeline {
  override drawFrame(): void {
    this.flushLayout();
    this.flushPaintTransformUpdate();
    this.flushPaint();
    this.recalculateZOrder();
    this.#compositeFrame();
  }

  override reinitializeFrame(): void {
    this.renderView.layout(Constraints.tight(this.renderContext.viewSize));
    this.renderView.updatePaintTransform();
    CanvasPaintingContext.repaintCompositedChild(this.renderView);
    this.#compositeFrame();
  }

  override flushPaint(): void {
    const dirties = this.needsPaintRenderObjects;
    this.needsPaintRenderObjects = [];

    dirties
      .sort((a, b) => b.depth - a.depth)
      .forEach(node => {
        if (node.canvasPainter.layer?.attached) {
          assert(
            node.canvasPainter.isRepaintBoundary,
            "isRepaintBoundary must be true on flushPaint",
          );
          if (node.needsPaint) {
            CanvasPaintingContext.repaintCompositedChild(node);
          } else {
            CanvasPaintingContext.updateLayerProperties(node);
          }
        } else {
          node.canvasPainter.skippedPaintingOnLayer();
        }
      });
  }

  override disposeRenderObject(_: RenderObject): void {
    // Nothing needs to be implemented
  }

  override markNeedsPaint(renderObject: RenderObject): void {
    let parent = renderObject;
    while (parent != null && !parent.canvasPainter.isRepaintBoundary) {
      parent = parent.parent;
    }
    if (parent != null) {
      if (!parent.needsPaint) {
        parent.needsPaint = true;
        this.needsPaintRenderObjects.push(parent);
      }
    }
  }

  override markNeedsPaintTransformUpdate(renderObject: RenderObject): void {
    renderObject.needsPaintTransformUpdate = true;
    this.needsPaintTransformUpdateRenderObjects.push(renderObject);
    this.markNeedsPaint(renderObject);
  }

  override didChangePaintTransform(renderObjet: RenderObject): void {
    renderObjet.markNeedsPaint();
  }

  #compositeFrame() {
    const builder = new SceneBuilder();
    const ctx = this.#prepareCanvas(
      this.renderContext.view as HTMLCanvasElement,
    );
    this.renderView.canvasPainter.layer.buildScene(builder);
    builder.render(ctx);
  }

  #prepareCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const size = this.renderContext.viewSize;
    const dpr = window.devicePixelRatio;
    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    return ctx;
  }
}
