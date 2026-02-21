import { assert } from "../../../utils";
import type { RenderObject } from "../../../renderobject";
import { Offset, type Rect } from "../../../type";
import {
  type ContainerLayer,
  PictureLayer,
  PictureRecorder,
  type Layer,
} from "./layer";
import { NotImplementedError } from "../../../exception";

export class CanvasPaintingContext {
  #estimateBound: Rect;
  #containerLayer: ContainerLayer;
  constructor(containerLayer: ContainerLayer, estimateBound: Rect) {
    this.#containerLayer = containerLayer;
    this.#estimateBound = estimateBound;
  }
  #currentLayer: PictureLayer | null;

  /**
   * When true, paintChild becomes a no-op. Used during z-ordered
   * painting so that each painter's performPaint only draws itself
   * without recursing into children (children are painted separately
   * in z-order).
   */
  #skipChildPainting = false;

  static repaintCompositedChild(node: RenderObject): void {
    assert(
      node.canvasPainter.isRepaintBoundary,
      "isRepaintBoundary must be true on repaintCompositedChild",
    );
    let childLayer = node.canvasPainter.layer;
    if (childLayer == null) {
      childLayer = node.canvasPainter.updateCompositedLayer(null);
      node.canvasPainter.layer = childLayer;
    } else {
      const updatedChildLayer =
        node.canvasPainter.updateCompositedLayer(childLayer);
      assert(
        childLayer === updatedChildLayer,
        "updateCompositedLayer must return the same layer",
      );
      updatedChildLayer.removeAllChildren();
    }

    const childContext = new CanvasPaintingContext(
      childLayer,
      node.canvasPainter.paintBounds,
    );

    // Phase 1: Collect all painter render objects with their offsets
    const painters: { renderObject: RenderObject; offset: Offset }[] = [];
    CanvasPaintingContext.#collectPainters(
      node,
      Offset.Constants.zero,
      painters,
    );

    // Phase 2: Sort by z-order (calculated by ZOrderCalculatorVisitor)
    painters.sort((a, b) => a.renderObject.zOrder - b.renderObject.zOrder);

    // Phase 3: Paint each painter in z-order, skipping child traversal
    childContext.#skipChildPainting = true;
    for (const { renderObject, offset } of painters) {
      renderObject.canvasPainter.paint(childContext, offset);
    }
    childContext.#skipChildPainting = false;

    childContext.stopRecording();
  }

  /**
   * Walk the render object tree and collect all painter render objects
   * with their accumulated offsets.
   */
  static #collectPainters(
    node: RenderObject,
    offset: Offset,
    result: { renderObject: RenderObject; offset: Offset }[],
  ) {
    if (node.isPainter) {
      result.push({ renderObject: node, offset });
    }
    node.visitChildren(child => {
      CanvasPaintingContext.#collectPainters(
        child,
        offset.plus(child.offset),
        result,
      );
    });
  }

  static updateLayerProperties(_: RenderObject): void {
    throw new NotImplementedError("updateLayerProperties is not implemented");
  }

  #recorder: PictureRecorder;
  #ctx: CanvasRenderingContext2D | null;
  get canvas(): CanvasRenderingContext2D {
    if (this.#ctx == null) {
      this.#startRecording();
    }
    return this.#ctx;
  }

  #startRecording() {
    this.#currentLayer = new PictureLayer(this.#estimateBound);
    this.#recorder = new PictureRecorder(this.#estimateBound);
    this.#ctx = this.#recorder.createCanvasContext();
    this.#containerLayer.append(this.#currentLayer!);
  }

  stopRecording() {
    this.#currentLayer.picture = this.#recorder.endRecording();
    this.#recorder = null;
    this.#ctx = null;
    this.#currentLayer = null;
  }

  addLayer(layer: Layer) {
    this.stopRecording();
    this.#appendLayer(layer);
  }

  #appendLayer(layer: Layer) {
    this.#containerLayer.append(layer);
  }

  /**
   * Paint a child RenderObject.
   *
   * When #skipChildPainting is true (during z-ordered paint phase),
   * this is a no-op because each painter is invoked individually
   * in z-order from repaintCompositedChild.
   */
  paintChild(child: RenderObject, offset: Offset) {
    if (this.#skipChildPainting) return;
    child.canvasPainter.paint(this, offset);
  }
}
