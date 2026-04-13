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
    this.recalculateZOrder();
    this.flushPaint();
    this.#compositeFrame();
  }

  override reinitializeFrame(): void {
    this.renderView.layout(Constraints.tight(this.renderContext.viewSize));
    this.renderView.updatePaintTransform();
    this.notifyZOrderChanged();
    this.recalculateZOrder();
    CanvasPaintingContext.repaintCompositedChild(this.renderView);
    this.#compositeFrame();
  }

  override flushPaint(): void {
    const dirties = this.needsPaintRenderObjects;
    this.needsPaintRenderObjects = [];

    dirties
      .sort((a, b) => b.depth - a.depth)
      .forEach(node => {
        if (!node.needsPaint && !node.needsCompositedLayerUpdate) return;

        assert(
          node.canvasPainter.isRepaintBoundary,
          "isRepaintBoundary must be true on flushPaint",
        );

        const layer = node.canvasPainter.layer;
        if (layer == null) {
          if (node.needsPaint || node.needsCompositedLayerUpdate) {
            CanvasPaintingContext.repaintCompositedChild(node);
          }
          return;
        }

        if (layer.attached) {
          if (node.needsPaint) {
            CanvasPaintingContext.repaintCompositedChild(node);
          } else if (node.needsCompositedLayerUpdate) {
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
    const boundary = this.#findRepaintBoundary(renderObject);
    if (boundary == null) return;
    this.scheduleRepaintBoundary(boundary, { needsPaint: true });
  }

  override markNeedsPaintTransformUpdate(renderObject: RenderObject): void {
    renderObject.needsPaintTransformUpdate = true;
    this.needsPaintTransformUpdateRenderObjects.push(renderObject);
    this.requestVisualUpdate();
  }

  override didChangePaintTransform(renderObject: RenderObject): void {
    if (renderObject.canvasPainter.isRepaintBoundary) {
      this.scheduleRepaintBoundary(renderObject, {
        needsCompositedLayerUpdate: true,
      });
      return;
    }
    this.markNeedsPaint(renderObject);
  }

  scheduleRepaintBoundary(
    renderObject: RenderObject,
    {
      needsPaint = false,
      needsCompositedLayerUpdate = false,
    }: {
      needsPaint?: boolean;
      needsCompositedLayerUpdate?: boolean;
    },
  ) {
    assert(
      renderObject.canvasPainter.isRepaintBoundary,
      "scheduleRepaintBoundary must be called on a repaint boundary",
    );

    if (this.needsPaintRenderObjects.indexOf(renderObject) === -1) {
      this.needsPaintRenderObjects.push(renderObject);
    }
    if (needsPaint) {
      renderObject.needsPaint = true;
      renderObject.needsCompositedLayerUpdate = false;
    } else if (
      needsCompositedLayerUpdate &&
      !renderObject.needsPaint &&
      renderObject.canvasPainter.layer != null
    ) {
      renderObject.needsCompositedLayerUpdate = true;
    } else if (renderObject.canvasPainter.layer == null) {
      renderObject.needsPaint = true;
    }
    this.requestVisualUpdate();
  }

  #findRepaintBoundary(renderObject: RenderObject): RenderObject | null {
    let parent: RenderObject | undefined = renderObject;
    while (parent != null && !parent.canvasPainter.isRepaintBoundary) {
      parent = parent.parent;
    }
    return parent ?? null;
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
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    return ctx;
  }
}
