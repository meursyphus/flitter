import type { RenderObject } from "../../../renderobject/RenderObject";
import { RenderPipeline } from "../renderer";
import { Constraints } from "../../../type";
import { CanvasPaintingContext } from "./canvas-painting-context";
import { SceneBuilder } from "./layer";

export class CanvasRenderPipeline extends RenderPipeline {
  /**
   * Retained-rendering dirty bit, the analog of Flutter's
   * Layer._needsAddToScene: set on every path that can mutate the layer tree
   * (and therefore the composited scene), cleared after compositing. While it
   * stays false the on-screen canvas already shows the identical scene, so
   * the SceneBuilder rebuild + replay can be skipped entirely.
   */
  #needsComposite = true;

  override drawFrame(): void {
    this.trace("layout", () => this.flushLayout());
    this.trace("compositingBits", () => this.flushCompositingBits());
    // No paint-transform pass: canvas paints by walking accumulated offsets, and
    // offset changes are turned directly into repaint/layer-offset updates in
    // markNeedsPaintTransformUpdate below (localToGlobal computes lazily).
    this.recalculateZOrder();
    this.trace("paint", () => {
      this.flushPaint();
      if (this.#needsComposite) {
        this.#compositeFrame();
      }
    });
  }

  override reinitializeFrame(): void {
    this.#needsComposite = true;
    this.trace("layout", () =>
      this.renderView.layout(Constraints.tight(this.renderContext.viewSize)),
    );
    this.trace("compositingBits", () => this.flushCompositingBits());
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

        if (node.canvasPainter.layer == null) {
          if (node.needsPaint && node.canvasPainter.isRepaintBoundary) {
            CanvasPaintingContext.repaintCompositedChild(node);
          }
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
    this.#needsComposite = true;
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

  override markNeedsCompositingBitsUpdate(renderObject: RenderObject): void {
    this.#needsComposite = true;
    this.needsCompositingBitsUpdateRenderObjects.push(renderObject);
    this.requestVisualUpdate();
  }

  override markNeedsCompositedLayerUpdate(renderObject: RenderObject): void {
    this.#needsComposite = true;
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
    // There is no cached paint transform to refresh for canvas. An offset change
    // only needs the affected node to repaint, or — if it is a repaint boundary —
    // its composited layer's offset to update. This is exactly the effect the
    // old paint-transform pass produced via didChangePaintTransform, applied here
    // directly without a separate full-tree walk.
    this.didChangePaintTransform(renderObject);
  }

  override didChangePaintTransform(renderObjet: RenderObject): void {
    this.#needsComposite = true;
    if (renderObjet.canvasPainter.layer != null) {
      renderObjet.markNeedsCompositedLayerUpdate();
      return;
    }

    renderObjet.markNeedsPaint();
  }

  override notifyZOrderChanged(): void {
    super.notifyZOrderChanged();
  }

  protected override recalculateZOrder(): RenderObject[] {
    const changed = super.recalculateZOrder();
    if (changed.length > 0) {
      // Pictures bake in draw order. Re-record affected boundaries only when
      // the resolved order changes, not merely when a numeric zIndex changes.
      this.markNeedsPaint(this.renderView);
      for (const node of changed) this.markNeedsPaint(node);
    }
    return changed;
  }

  #compositeFrame() {
    const builder = new SceneBuilder();
    const ctx = this.#prepareCanvas(
      this.renderContext.view as HTMLCanvasElement,
    );
    this.renderView.canvasPainter.layer?.buildScene(builder);
    builder.render(ctx);
    this.#needsComposite = false;
  }

  #preparedCanvas: HTMLCanvasElement | null = null;
  #preparedWidth = -1;
  #preparedHeight = -1;
  #preparedDpr = -1;

  #prepareCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const size = this.renderContext.viewSize;
    const dpr = window.devicePixelRatio;
    const ctx = canvas.getContext("2d")!;
    if (
      this.#preparedCanvas === canvas &&
      this.#preparedWidth === size.width &&
      this.#preparedHeight === size.height &&
      this.#preparedDpr === dpr
    ) {
      // Same backing store as last frame: clearing in place is bit-identical
      // to reallocating the buffer and skips the realloc + implicit context
      // reset. setTransform (not scale) so the dpr transform cannot
      // accumulate across frames.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size.width, size.height);
      return ctx;
    }
    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.#preparedCanvas = canvas;
    this.#preparedWidth = size.width;
    this.#preparedHeight = size.height;
    this.#preparedDpr = dpr;
    return ctx;
  }
}
