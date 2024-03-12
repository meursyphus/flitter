import type RenderObject from "../../renderobject/RenderObject";
import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import { Constraints } from "../../type";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";

export default class BaseIntrinsicWidth extends SingleChildRenderObjectWidget {
  createRenderObject(): SingleChildRenderObject {
    return new RenderIntrinsicWidth({ isPainter: false });
  }
  updateRenderObject(_: RenderObject): void {}
}

class RenderIntrinsicWidth extends SingleChildRenderObject {
  protected preformLayout(): void {
    if (this.child == null) return;
    const width = this.child.getIntrinsicWidth(this.constraints.maxHeight) || 0;
    const constraint = Constraints.tightFor({ width }).enforce(
      this.constraints
    );
    this.child.layout(constraint);
    this.size = this.child.size;
  }
}
