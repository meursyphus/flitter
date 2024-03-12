/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RenderOwner } from "../scheduler";
import type { Matrix4 } from "../type";
import { Size, Constraints } from "../type";
import type { PaintContext } from "../utils/type";
import RenderObject from "./RenderObject";

class RenderView extends RenderObject {
  constructor({ renderOwner }: { renderOwner: RenderOwner }) {
    super({ isPainter: false });
    this.renderOwner = renderOwner;
    this.renderOwner.renderView = this;
    this.constraints = Constraints.tight({ width: 0, height: 0 });
  }
  preformLayout(): void {
    const constraint = this.constraints;
    if (!constraint.isTight)
      throw { message: "constraint must be tight on render view" };
    if (constraint.maxWidth === 0 || constraint.maxHeight === 0) return;
    this.size = new Size({
      width: constraint.maxWidth,
      height: constraint.maxHeight,
    });
    this.children.forEach((child) =>
      child.layout(Constraints.loose(this.size))
    );
  }
  paint(
    context: PaintContext,
    clipId?: string,
    matrix4?: Matrix4,
    opacity?: number
  ): void {
    if (this.size.width === 0 || this.size.height === 0) return;
    super.paint(context, clipId, matrix4, opacity);
  }
}

export default RenderView;
