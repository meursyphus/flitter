import type RenderObject from "../../renderobject/RenderObject";
import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import { Constraints } from "../../type";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";

export default class BaseIntrinsicHeight extends SingleChildRenderObjectWidget {
  createRenderObject(): SingleChildRenderObject {
    return new RenderIntrinsicHeight({ isPainter: false });
  }
  updateRenderObject(_: RenderObject): void {}
}

class RenderIntrinsicHeight extends SingleChildRenderObject {
  protected preformLayout(): void {
    if (this.child == null) return;
    const height =
      this.child.getIntrinsicHeight(this.constraints.maxWidth) || 0;
    const constraint = Constraints.tightFor({ height }).enforce(
      this.constraints
    );
    this.child.layout(constraint);
    this.size = this.child.size;
  }
}
