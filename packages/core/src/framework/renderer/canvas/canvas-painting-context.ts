import { assert } from "../../../utils";
import type { RenderObject } from "../../../renderobject";
import { Offset, type Rect } from "../../../type";
import {
  type ContainerLayer,
  type Layer,
  OffsetLayer,
  PictureLayer,
  PictureRecorder,
} from "./layer";

type AncestorNode = {
  node: RenderObject;
  offset: Offset;
  handlesOffset: boolean;
};

type CollectedPainter = (
  | {
      kind: "painter";
      renderObject: RenderObject;
      offset: Offset;
      ancestors: AncestorNode[];
      zOrder: number;
    }
  | {
      kind: "boundary";
      renderObject: RenderObject;
      offset: Offset;
      ancestors: AncestorNode[];
      zOrder: number;
    }
);

type CanvasProxy = CanvasRenderingContext2D & {
  __enterSuppress: () => void;
  __exitSuppress: () => void;
  __raw: CanvasRenderingContext2D;
};

// Drawing operations that produce pixels — suppressed during ancestor replay
// so that only canvas state changes (transforms, clips, opacity) persist.
const DRAWING_OPS: ReadonlySet<string | symbol> = new Set([
  "fillRect",
  "strokeRect",
  "clearRect",
  "fill",
  "stroke",
  "fillText",
  "strokeText",
  "drawImage",
  "putImageData",
]);

const NOOP = () => {};

function createCanvasProxy(ctx: CanvasRenderingContext2D): CanvasProxy {
  let suppressDepth = 0;
  let suppressing = false;

  const proxy = new Proxy(ctx, {
    get(target, prop, _receiver) {
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
        // Suppress pixel-drawing operations during ancestor replay
        if (DRAWING_OPS.has(prop)) {
          return NOOP;
        }
      }

      const val = Reflect.get(target, prop, target);
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
  #currentLayer!: PictureLayer | null;

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
    node.needsPaint = false;
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
    node.needsCompositedLayerUpdate = false;

    const paintBounds = node.canvasPainter.paintBounds;
    if (paintBounds.width <= 0 || paintBounds.height <= 0) {
      return;
    }

    const childContext = new CanvasPaintingContext(
      childLayer,
      paintBounds,
    );

    // Phase 1: Collect all painter render objects with ancestor node chains
    const painters: CollectedPainter[] = [];
    CanvasPaintingContext.#collectPainters(
      node,
      node,
      Offset.Constants.zero,
      [],
      painters,
    );

    // Phase 2: Sort by z-order (calculated by ZOrderCalculatorVisitor)
    painters.sort((a, b) => a.zOrder - b.zOrder);

    // Phase 3: Paint each painter in z-order with ancestor ctx state replayed
    childContext.#skipChildPainting = true;
    let proxyCanvas: CanvasProxy | null = null;
    for (const entry of painters) {
      if (entry.kind === "boundary") {
        childContext.compositeChild(
          entry.renderObject,
          entry.ancestors,
          entry.offset,
        );
        continue;
      }

      proxyCanvas ??= childContext.canvas as unknown as CanvasProxy;
      proxyCanvas.__raw.save();
      // Replay ancestors with suppressed save/restore
      for (const { node: ancestorNode, offset: ancOffset } of entry.ancestors) {
        proxyCanvas.__enterSuppress();
        ancestorNode.canvasPainter.paint(childContext, ancOffset);
        proxyCanvas.__exitSuppress();
      }
      // Paint the actual painter
      entry.renderObject.canvasPainter.paint(childContext, entry.offset);
      proxyCanvas.__raw.restore();
    }
    childContext.#skipChildPainting = false;

    childContext.stopRecordingIfNeeded();
  }

  /**
   * Walk the render object tree and collect all painter render objects
   * with their accumulated offsets and ancestor node chains.
   */
  static #collectPainters(
    root: RenderObject,
    node: RenderObject,
    offset: Offset,
    ancestorChain: AncestorNode[],
    result: CollectedPainter[],
  ) {
    if (node !== root && node.canvasPainter.isRepaintBoundary) {
      result.push({
        kind: "boundary",
        renderObject: node,
        offset,
        ancestors: [...ancestorChain],
        zOrder: node.minDescendantZOrder,
      });
      return;
    }

    if (node.isPainter) {
      result.push({
        kind: "painter",
        renderObject: node,
        offset,
        ancestors: [...ancestorChain],
        zOrder: node.zOrder,
      });
    }

    // Only replay ancestors that intentionally affect descendant painting.
    // Replaying arbitrary painter ancestors leaks local canvas state
    // (fillStyle, shadow, path state, etc.) into descendants.
    const ancestorNode = CanvasPaintingContext.#createAncestorNode(node, offset);
    const childAncestorChain = ancestorNode == null
      ? ancestorChain
      : [...ancestorChain, ancestorNode];

    node.visitChildren(child => {
      CanvasPaintingContext.#collectPainters(
        root,
        child,
        offset.plus(child.offset),
        childAncestorChain,
        result,
      );
    });
  }

  static #createAncestorNode(
    node: RenderObject,
    offset: Offset,
  ): AncestorNode | null {
    const layer = node.canvasPainter.createAncestorLayer(offset);
    if (layer == null) return null;
    return {
      node,
      offset,
      handlesOffset: "offset" in layer,
    };
  }

  static updateLayerProperties(node: RenderObject): void {
    assert(
      node.canvasPainter.isRepaintBoundary,
      "isRepaintBoundary must be true on updateLayerProperties",
    );
    assert(node.canvasPainter.layer != null, "layer must exist on updateLayerProperties");
    assert(!node.needsPaint, "updateLayerProperties requires a clean paint state");

    const childLayer = node.canvasPainter.layer;
    const updatedChildLayer = node.canvasPainter.updateCompositedLayer(childLayer);
    assert(
      childLayer === updatedChildLayer,
      "updateCompositedLayer must return the same layer",
    );
    node.needsCompositedLayerUpdate = false;
  }

  #recorder!: PictureRecorder;
  #ctx!: CanvasProxy | null;
  get canvas(): CanvasRenderingContext2D {
    if (this.#ctx == null) {
      this.#startRecording();
    }
    return this.#ctx!;
  }

  #startRecording() {
    this.#currentLayer = new PictureLayer(this.#estimateBound);
    this.#recorder = new PictureRecorder(this.#estimateBound);
    this.#ctx = createCanvasProxy(this.#recorder.createCanvasContext());
    this.#containerLayer.append(this.#currentLayer!);
  }

  stopRecording() {
    this.#currentLayer!.picture = this.#recorder.endRecording();
    this.#recorder = null as unknown as PictureRecorder;
    this.#ctx = null;
    this.#currentLayer = null;
  }

  stopRecordingIfNeeded() {
    if (this.#currentLayer == null) return;
    this.stopRecording();
  }

  addLayer(layer: Layer) {
    this.stopRecordingIfNeeded();
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

  compositeChild(
    child: RenderObject,
    ancestors: AncestorNode[],
    accumulatedOffset?: Offset,
  ) {
    assert(
      child.canvasPainter.isRepaintBoundary,
      "compositeChild must be called on a repaint boundary",
    );

    if (child.needsPaint || child.canvasPainter.layer == null) {
      CanvasPaintingContext.repaintCompositedChild(child);
    } else if (child.needsCompositedLayerUpdate) {
      CanvasPaintingContext.updateLayerProperties(child);
    }

    let layer: Layer = child.canvasPainter.layer;
    let nearestPositionedAncestorOffset = Offset.Constants.zero;
    for (let i = ancestors.length - 1; i >= 0; i--) {
      if (!ancestors[i].handlesOffset) continue;
      nearestPositionedAncestorOffset = ancestors[i].offset;
      break;
    }
    // child.layer already carries child.offset. Positional ancestor layers
    // such as TransformLayer / ClipPathLayer are expressed in the parent
    // boundary's coordinate space, so only the remaining layout translation
    // needs to be wrapped here.
    const ancestorOffset = accumulatedOffset == null
      ? null
      : accumulatedOffset
          .minus(child.offset)
          .minus(nearestPositionedAncestorOffset);

    if (
      ancestorOffset != null &&
      (ancestorOffset.x !== 0 || ancestorOffset.y !== 0)
    ) {
      const wrapper = new OffsetLayer();
      wrapper.offset = ancestorOffset;
      wrapper.append(layer);
      layer = wrapper;
    }

    for (let i = ancestors.length - 1; i >= 0; i--) {
      const ancestor = ancestors[i];
      const ancestorLayer = ancestor.node.canvasPainter.createAncestorLayer(
        ancestor.offset,
      );
      if (ancestorLayer == null) continue;
      ancestorLayer.append(layer);
      layer = ancestorLayer;
    }

    this.addLayer(layer);
  }
}
