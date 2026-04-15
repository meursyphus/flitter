import { assert } from "../../../utils";
import type { RenderObject } from "../../../renderobject";
import { Offset, type Rect } from "../../../type";
import {
  type ContainerLayer,
  OffsetLayer,
  PictureLayer,
  PictureRecorder,
  type Layer,
} from "./layer";

type AncestorNode = { node: RenderObject; offset: Offset };

type CollectedPainter = {
  kind: "painter";
  renderObject: RenderObject;
  offset: Offset;
  ancestors: AncestorNode[];
};

type CollectedBoundary = {
  kind: "boundary";
  renderObject: RenderObject;
  offset: Offset;
};

type CollectedPaintItem = CollectedPainter | CollectedBoundary;

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
    get(target, prop) {
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
        if (DRAWING_OPS.has(prop)) {
          return NOOP;
        }
      }

      const value = Reflect.get(target, prop, target);
      return typeof value === "function" ? value.bind(target) : value;
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

  #currentLayer: PictureLayer | null = null;
  #recorder: PictureRecorder | null = null;
  #ctx: CanvasProxy | null = null;

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

    node.needsCompositedLayerUpdate = false;

    const childContext = new CanvasPaintingContext(
      childLayer,
      node.canvasPainter.paintBounds,
    );

    const items: CollectedPaintItem[] = [];
    CanvasPaintingContext.#collectPaintItems(
      node,
      Offset.Constants.zero,
      [],
      items,
      true,
    );

    items.sort((a, b) => {
      const aOrder =
        a.kind === "boundary"
          ? a.renderObject.minDescendantZOrder
          : a.renderObject.zOrder;
      const bOrder =
        b.kind === "boundary"
          ? b.renderObject.minDescendantZOrder
          : b.renderObject.zOrder;
      return aOrder - bOrder;
    });

    const proxyCanvas = childContext.canvas as unknown as CanvasProxy;
    childContext.#skipChildPainting = true;
    for (const item of items) {
      if (item.kind === "boundary") {
        childContext.compositeChild(item.renderObject, item.offset);
        continue;
      }

      const { renderObject, offset, ancestors } = item;
      proxyCanvas.__raw.save();
      for (const { node: ancestorNode, offset: ancestorOffset } of ancestors) {
        proxyCanvas.__enterSuppress();
        ancestorNode.canvasPainter.paint(childContext, ancestorOffset);
        proxyCanvas.__exitSuppress();
      }
      renderObject.canvasPainter.paint(childContext, offset);
      proxyCanvas.__raw.restore();
    }
    childContext.#skipChildPainting = false;

    childContext.stopRecordingIfNeeded();
  }

  static #collectPaintItems(
    node: RenderObject,
    offset: Offset,
    ancestorChain: AncestorNode[],
    result: CollectedPaintItem[],
    isRoot = false,
  ) {
    if (!isRoot && node.canvasPainter.isRepaintBoundary) {
      result.push({
        kind: "boundary",
        renderObject: node,
        offset,
      });
      return;
    }

    if (node.isPainter) {
      result.push({
        kind: "painter",
        renderObject: node,
        offset,
        ancestors: [...ancestorChain],
      });
    }

    const childAncestorChain = [...ancestorChain, { node, offset }];

    node.visitChildren(child => {
      CanvasPaintingContext.#collectPaintItems(
        child,
        offset.plus(child.offset),
        childAncestorChain,
        result,
      );
    });
  }

  static updateLayerProperties(node: RenderObject): void {
    assert(
      node.canvasPainter.layer != null,
      "layer must exist on updateLayerProperties",
    );

    const layer = node.canvasPainter.layer!;
    const updatedLayer = node.canvasPainter.updateCompositedLayer(layer);
    assert(
      layer === updatedLayer,
      "updateCompositedLayer must return the same layer",
    );
    node.needsCompositedLayerUpdate = false;
  }

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
    this.#appendLayer(this.#currentLayer);
  }

  stopRecordingIfNeeded() {
    if (this.#currentLayer == null || this.#recorder == null) return;
    this.#currentLayer.picture = this.#recorder.endRecording();
    this.#recorder = null;
    this.#ctx = null;
    this.#currentLayer = null;
  }

  addLayer(layer: Layer) {
    this.stopRecordingIfNeeded();
    this.#appendLayer(layer);
  }

  #appendLayer(layer: Layer) {
    layer.remove();
    this.#containerLayer.append(layer);
  }

  paintChild(child: RenderObject, offset: Offset) {
    if (this.#skipChildPainting) return;

    if (child.canvasPainter.isRepaintBoundary) {
      this.compositeChild(child, offset);
      return;
    }

    child.canvasPainter.paint(this, offset);
  }

  compositeChild(child: RenderObject, offset: Offset) {
    this.stopRecordingIfNeeded();
    this.#compositeChild(child, offset);
  }

  #compositeChild(child: RenderObject, offset: Offset) {
    assert(
      child.canvasPainter.isRepaintBoundary,
      "isRepaintBoundary must be true on compositeChild",
    );

    if (child.needsPaint || child.canvasPainter.layer == null) {
      CanvasPaintingContext.repaintCompositedChild(child);
    } else if (child.needsCompositedLayerUpdate) {
      CanvasPaintingContext.updateLayerProperties(child);
    }

    const childLayer = child.canvasPainter.layer;
    assert(
      childLayer instanceof OffsetLayer,
      "repaint boundary layer must be an OffsetLayer",
    );
    childLayer.offset = offset;
    this.#appendLayer(childLayer);
  }
}
