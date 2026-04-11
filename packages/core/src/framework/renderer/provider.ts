import type { RenderPipeline } from "./renderer";
import { SvgRenderPipeline } from "./svg/svg-renderer";
import { CanvasRenderPipeline } from "./canvas/canvas-renderer";
import { canNotReach } from "../../exception";

export class RenderPipelineProvider {
  constructor(private props: ConstructorParameters<typeof RenderPipeline>[0]) {}

  get(type: "svg" | "canvas") {
    switch (type) {
      case "svg":
        return new SvgRenderPipeline(this.props);
      case "canvas":
        return new CanvasRenderPipeline(this.props);
      default:
        canNotReach(type);
    }
  }
}
