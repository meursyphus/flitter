import type { RenderObject } from "../../../renderobject/RenderObject";
import { NotImplementedError } from "../../../exception";
import { RenderPipeline } from "../renderer";

export class CanvasRenderPipeline extends RenderPipeline {
  override drawFrame(): void {
    throw new NotImplementedError("drawFrame on CanvasRenderPipeline");
  }

  override reinitializeFrame(): void {
    throw new NotImplementedError("reinitializeFrame on CanvasRenderPipeline");
  }

  override flushPaint(): void {
    throw new NotImplementedError("flushPaint on CanvasRenderPipeline");
  }

  override disposeRenderObject(_: RenderObject): void {
    throw new NotImplementedError(
      "disposeRenderObject on CanvasRenderPipeline",
    );
  }

  override markNeedsPaint(_: RenderObject): void {
    throw new NotImplementedError(
      "markNeedsPaintRenderObject on CanvasRenderPipeline",
    );
  }

  protected override flushPaintTransformUpdate(): void {
    throw new NotImplementedError(
      "flushPaintTransformUpdate on CanvasRenderPipeline",
    );
  }

  override markNeedsPaintTransformUpdate(_: RenderObject): void {
    throw new NotImplementedError(
      "flushPaintTransformUpdate on CanvasRenderPipeline",
    );
  }
}
