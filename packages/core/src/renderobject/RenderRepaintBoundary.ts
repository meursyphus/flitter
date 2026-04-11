import { CanvasPainter } from "../framework/renderer/canvas/canvas-painter";
import {
  OffsetLayer,
  type ContainerLayer,
} from "../framework/renderer/canvas/layer";
import SingleChildRenderObject from "./SingleChildRenderObject";
import { assert } from "../utils";

class RenderRepaintBoundary extends SingleChildRenderObject {
  constructor() {
    super({ isPainter: false });
  }

  protected override createCanvasPainter(): CanvasPainter {
    return new RepaintBoundaryCanvasPainter(this);
  }
}

class RepaintBoundaryCanvasPainter extends CanvasPainter {
  override get isRepaintBoundary() {
    return true;
  }

  override updateCompositedLayer(oldLayer: ContainerLayer | null) {
    const layer = oldLayer ?? new OffsetLayer();
    assert(
      layer instanceof OffsetLayer,
      "RepaintBoundary must use an OffsetLayer",
    );
    layer.offset = this.offset;
    return layer;
  }
}

export default RenderRepaintBoundary;
