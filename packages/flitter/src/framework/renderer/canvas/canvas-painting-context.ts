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

type AncestorNode = { node: RenderObject; offset: Offset };

type CollectedPainter = {
  renderObject: RenderObject;
  offset: Offset;
  ancestors: AncestorNode[];
};

type CanvasProxy = CanvasRenderingContext2D & {
  __enterSuppress: () => void;
  __exitSuppress: () => void;
  __raw: CanvasRenderingContext2D;
};

function createCanvasProxy(ctx: CanvasRenderingContext2D): CanvasProxy {
  let suppressDepth = 0;
  let suppressing = false;

  const proxy = new Proxy(ctx, {
    get(target, prop, receiver) {
      if (prop === "__enterSuppress")
        return () => {
          suppressing = true;
          suppressDepth = 0;
        };
      if (prop === "__exitSuppress")
        return () => {
          suppressing = false;
        };
      if (prop === "__raw") return target;

      if (suppressing) {
        if (prop === "save") {
          return () => {
            suppressDepth++;
            if (suppressDepth > 1) target.save();
          };
        }
        if (prop === "restore") {
          return () => {
            if (suppressDepth > 1) target.restore();
            suppressDepth--;
          };
        }
      }

      const val = Reflect.get(target, prop, receiver);
      return typeof val === "function" ? val.bind(target) : val;
    },
    set(target, prop, value) {
      return Reflect.set(target, prop, value);
    },
  });

  return proxy as CanvasProxy;
}

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

    // Phase 1: Collect all painter render objects with ancestor node chains
    const painters: CollectedPainter[] = [];
    CanvasPaintingContext.#collectPainters(
      node,
      Offset.Constants.zero,
      [],
      painters,
    );

    // Phase 2: Sort by z-order (calculated by ZOrderCalculatorVisitor)
    painters.sort((a, b) => a.renderObject.zOrder - b.renderObject.zOrder);

    // Phase 3: Paint each painter in z-order with ancestor ctx state replayed
    const proxyCanvas = childContext.canvas as unknown as CanvasProxy;
    childContext.#skipChildPainting = true;
    for (const { renderObject, offset, ancestors } of painters) {
      proxyCanvas.__raw.save();
      // Replay ancestors with suppressed save/restore
      for (const { node: ancestorNode, offset: ancOffset } of ancestors) {
        proxyCanvas.__enterSuppress();
        ancestorNode.canvasPainter.paint(childContext, ancOffset);
        proxyCanvas.__exitSuppress();
      }
      // Paint the actual painter
      renderObject.canvasPainter.paint(childContext, offset);
      proxyCanvas.__raw.restore();
    }
    childContext.#skipChildPainting = false;

    childContext.stopRecording();
  }

  /**
   * Walk the render object tree and collect all painter render objects
   * with their accumulated offsets and ancestor node chains.
   */
  static #collectPainters(
    node: RenderObject,
    offset: Offset,
    ancestorChain: AncestorNode[],
    result: CollectedPainter[],
  ) {
    if (node.isPainter) {
      result.push({
        renderObject: node,
        offset,
        ancestors: [...ancestorChain],
      });
    }

    // Only non-painter nodes go into the ancestor chain.
    // Painter nodes (Container, DecoratedBox, etc.) would draw pixels
    // during ancestor replay, which is undesirable. Non-painter nodes
    // that modify ctx state (Transform, Opacity) are safely replayed.
    const childAncestorChain = node.isPainter
      ? ancestorChain
      : [...ancestorChain, { node, offset }];

    node.visitChildren(child => {
      CanvasPaintingContext.#collectPainters(
        child,
        offset.plus(child.offset),
        childAncestorChain,
        result,
      );
    });
  }

  static updateLayerProperties(_: RenderObject): void {
    throw new NotImplementedError("updateLayerProperties is not implemented");
  }

  #recorder: PictureRecorder;
  #ctx: CanvasProxy | null;
  get canvas(): CanvasRenderingContext2D {
    if (this.#ctx == null) {
      this.#startRecording();
    }
    return this.#ctx;
  }

  #startRecording() {
    this.#currentLayer = new PictureLayer(this.#estimateBound);
    this.#recorder = new PictureRecorder(this.#estimateBound);
    this.#ctx = createCanvasProxy(this.#recorder.createCanvasContext());
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
