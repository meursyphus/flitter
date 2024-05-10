/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RenderPipeline } from "../framework";
import { Size, Constraints } from "../type";
import RenderObject from "./RenderObject";

class RenderView extends RenderObject {
  constructor({ renderOwner }: { renderOwner: RenderPipeline }) {
    super({ isPainter: false });
    this.renderOwner = renderOwner;
    this.renderOwner.renderView = this;
    this.constraints = Constraints.tight({ width: 0, height: 0 });
  }
  preformLayout(): void {
    const constraint = this.constraints;
    if (!constraint.isTight)
      throw new Error("constraint must be tight on render view");
    if (constraint.maxWidth === 0 || constraint.maxHeight === 0) return;
    this.size = new Size({
      width: constraint.maxWidth,
      height: constraint.maxHeight,
    });
    this.children.forEach(child => child.layout(Constraints.loose(this.size)));
  }
}

export default RenderView;
