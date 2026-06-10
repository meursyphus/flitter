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

/**
 * One picture recording. Painters receive the raw CanvasRenderingContext2D in
 * the normal path; the intercepting wrapper only exists for the ancestor-state
 * replay window in repaintCompositedChild, where pixel-producing calls must be
 * swallowed while canvas state changes persist.
 *
 * Suppression state is owned by the recording, not the painting context: the
 * z-walk in repaintCompositedChild captures the recording it started with, so
 * a recording ended mid-walk (by a boundary item) keeps the suppression
 * toggles bound to it rather than to whatever recording is started next.
 */
class CanvasRecording {
  readonly raw: CanvasRenderingContext2D;
  #suppressing = false;
  #suppressDepth = 0;
  #wrapper: CanvasRenderingContext2D | null = null;

  constructor(raw: CanvasRenderingContext2D) {
    this.raw = raw;
  }

  get suppressing(): boolean {
    return this.#suppressing;
  }

  enterSuppress(): void {
    this.#suppressing = true;
    this.#suppressDepth = 0;
  }

  exitSuppress(): void {
    this.#suppressing = false;
  }

  get wrapper(): CanvasRenderingContext2D {
    if (this.#wrapper == null) {
      this.#wrapper = this.#createWrapper();
    }
    return this.#wrapper;
  }

  #createWrapper(): CanvasRenderingContext2D {
    const target = this.raw;
    // A replayed ancestor's first-level save/restore pair is swallowed so the
    // state it establishes survives for the painter that follows; deeper
    // pairs are forwarded untouched.
    const save = () => {
      this.#suppressDepth++;
      if (this.#suppressDepth > 1) target.save();
    };
    const restore = () => {
      if (this.#suppressDepth > 1) target.restore();
      this.#suppressDepth--;
    };
    const boundMethods = new Map<string | symbol, unknown>();
    return new Proxy(target, {
      get(t, prop) {
        if (prop === "save") return save;
        if (prop === "restore") return restore;
        if (DRAWING_OPS.has(prop)) return NOOP;
        const cached = boundMethods.get(prop);
        if (cached != null) return cached;
        const value = Reflect.get(t, prop, t);
        if (typeof value !== "function") return value;
        const bound = (value as (...args: unknown[]) => unknown).bind(t);
        boundMethods.set(prop, bound);
        return bound;
      },
      set(t, prop, value) {
        return Reflect.set(t, prop, value);
      },
    }) as CanvasRenderingContext2D;
  }
}

export class CanvasPaintingContext {
  #estimateBound: Rect;
  #containerLayer: ContainerLayer;
  /**
   * Backing canvases harvested from the PictureLayers this repaint discards.
   * A new recording with the same device-pixel size reuses one instead of
   * allocating a fresh DOM canvas (see PictureRecorder).
   */
  #recycledCanvases: HTMLCanvasElement[] | null;

  constructor(
    containerLayer: ContainerLayer,
    estimateBound: Rect,
    recycledCanvases: HTMLCanvasElement[] | null = null,
  ) {
    this.#containerLayer = containerLayer;
    this.#estimateBound = estimateBound;
    this.#recycledCanvases = recycledCanvases;
  }

  #currentLayer: PictureLayer | null = null;
  #recorder: PictureRecorder | null = null;
  #recording: CanvasRecording | null = null;

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
    let recycledCanvases: HTMLCanvasElement[] | null = null;
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
      recycledCanvases =
        CanvasPaintingContext.#harvestRecycledCanvases(updatedChildLayer);
      updatedChildLayer.removeAllChildren();
    }

    node.needsCompositedLayerUpdate = false;

    const childContext = new CanvasPaintingContext(
      childLayer,
      node.canvasPainter.paintBounds,
      recycledCanvases,
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

    const recording = childContext.#ensureRecording();
    childContext.#skipChildPainting = true;
    for (const item of items) {
      if (item.kind === "boundary") {
        childContext.compositeChild(item.renderObject, item.offset);
        continue;
      }

      const { renderObject, offset, ancestors } = item;
      recording.raw.save();
      for (const { node: ancestorNode, offset: ancestorOffset } of ancestors) {
        recording.enterSuppress();
        ancestorNode.canvasPainter.paint(childContext, ancestorOffset);
        recording.exitSuppress();
      }
      renderObject.canvasPainter.paint(childContext, offset);
      recording.raw.restore();
    }
    childContext.#skipChildPainting = false;

    childContext.stopRecordingIfNeeded();
  }

  /**
   * Collects the backing canvases of the PictureLayers about to be discarded
   * by removeAllChildren. Only direct PictureLayer children may donate their
   * canvas: nested boundary layers keep their own pictures alive and are
   * re-appended as-is by compositeChild.
   */
  static #harvestRecycledCanvases(
    layer: ContainerLayer,
  ): HTMLCanvasElement[] | null {
    let canvases: HTMLCanvasElement[] | null = null;
    layer.visitChildren(child => {
      if (!(child instanceof PictureLayer)) return;
      const source = child.recycleSource();
      if (source == null) return;
      (canvases ??= []).push(source);
    });
    return canvases;
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
        // Snapshot only when emitting a painter (which retains the chain for
        // later ancestor replay); the traversal itself reuses one mutable stack.
        ancestors: ancestorChain.slice(),
      });
    }

    ancestorChain.push({ node, offset });
    node.visitChildren(child => {
      CanvasPaintingContext.#collectPaintItems(
        child,
        offset.plus(child.offset),
        ancestorChain,
        result,
      );
    });
    ancestorChain.pop();
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
    const recording = this.#ensureRecording();
    return recording.suppressing ? recording.wrapper : recording.raw;
  }

  #ensureRecording(): CanvasRecording {
    if (this.#recording == null) {
      this.#startRecording();
    }
    return this.#recording!;
  }

  #startRecording() {
    this.#currentLayer = new PictureLayer(this.#estimateBound);
    this.#recorder = new PictureRecorder(
      this.#estimateBound,
      this.#recycledCanvases?.pop() ?? null,
    );
    this.#recording = new CanvasRecording(this.#recorder.createCanvasContext());
    this.#appendLayer(this.#currentLayer);
  }

  stopRecordingIfNeeded() {
    if (this.#currentLayer == null || this.#recorder == null) return;
    this.#currentLayer.picture = this.#recorder.endRecording();
    this.#recorder = null;
    this.#recording = null;
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
