import type { RenderObject } from "../../../renderobject/RenderObject";
import { RenderPipeline } from "../renderer";
import { Constraints } from "../../../type";
import { CanvasPaintingContext } from "./canvas-painting-context";
import { SceneBuilder } from "./layer";

export class CanvasRenderPipeline extends RenderPipeline {
  override drawFrame(): void {
    this.trace("layout", () => this.flushLayout());
    this.flushPaintTransformUpdate();
    this.recalculateZOrder();
    this.trace("paint", () => {
      this.flushPaint();
      this.#compositeFrame();
    });
  }

  override reinitializeFrame(): void {
    this.trace("layout", () =>
      this.renderView.layout(Constraints.tight(this.renderContext.viewSize)),
    );
    this.renderView.updatePaintTransform();
    this.notifyZOrderChanged();
    this.recalculateZOrder();
    this.trace("paint", () => {
      CanvasPaintingContext.repaintCompositedChild(this.renderView);
      this.#compositeFrame();
    });
  }

  override flushPaint(): void {
    const dirties = this.needsPaintRenderObjects;
    this.needsPaintRenderObjects = [];

    dirties
      .sort((a, b) => b.depth - a.depth)
      .forEach(node => {
        if (!node.needsPaint && !node.needsCompositedLayerUpdate) {
          return;
        }

        if (node.canvasPainter.layer?.attached) {
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
      parent = parent.parent!;
    }
    if (parent != null) {
      if (!parent.needsPaint) {
        parent.needsPaint = true;
        this.needsPaintRenderObjects.push(parent);
        this.requestVisualUpdate();
      }
    }
  }

  override markNeedsCompositedLayerUpdate(renderObject: RenderObject): void {
    if (renderObject.needsPaint || renderObject.needsCompositedLayerUpdate) {
      return;
    }

    renderObject.needsCompositedLayerUpdate = true;

    if (renderObject.canvasPainter.layer != null) {
      this.needsPaintRenderObjects.push(renderObject);
      this.requestVisualUpdate();
      return;
    }

    this.markNeedsPaint(renderObject);
  }

  override markNeedsPaintTransformUpdate(renderObject: RenderObject): void {
    renderObject.needsPaintTransformUpdate = true;
    this.needsPaintTransformUpdateRenderObjects.push(renderObject);
    this.requestVisualUpdate();
  }

  override didChangePaintTransform(renderObjet: RenderObject): void {
    if (renderObjet.canvasPainter.layer != null) {
      renderObjet.markNeedsCompositedLayerUpdate();
      return;
    }

    renderObjet.markNeedsPaint();
  }

  #compositeFrame() {
    const builder = new SceneBuilder();
    const ctx = this.#prepareCanvas(
      this.renderContext.view as HTMLCanvasElement,
    );
    this.renderView.canvasPainter.layer?.buildScene(builder);
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
