import { assert } from "../../../utils";
import type { RenderObject } from "../../../renderobject";
import type { Rect } from "../../../type";
import {
  type ContainerLayer,
  PictureLayer,
  PictureRecorder,
  type Layer,
} from "./layer";

export class CanvasPaintingContext {
  #estimateBound: Rect;
  #containerLayer: ContainerLayer;
  constructor(containerLayer: ContainerLayer, estimateBound: Rect) {
    this.#containerLayer = containerLayer;
    this.#estimateBound = estimateBound;
  }
  #currentLayer: PictureLayer | null;

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
    node.canvasPainter.paint(childContext);
    childContext.stopRecording();
  }

  static updateLayerProperties(_: RenderObject): void {
    console.warn("updateLayerProperties is not implemented");
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
}