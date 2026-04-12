import type RenderObject from "../../renderobject/RenderObject";
import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import { Constraints, Size } from "../../type";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";

export default class BaseIntrinsicWidth extends SingleChildRenderObjectWidget {
  createRenderObject(): SingleChildRenderObject {
    return new RenderIntrinsicWidth({ isPainter: false });
  }
  updateRenderObject(_: RenderObject): void {}
}

class RenderIntrinsicWidth extends SingleChildRenderObject {
  protected preformLayout(): void {
    if (this.child == null) {
      this.size = this.constraints.constrain(Size.zero);
      return;
    }
    const width = this.child.getIntrinsicWidth(this.constraints.maxHeight) || 0;
    const constraint = Constraints.tightFor({ width }).enforce(
      this.constraints,
    );
    this.child.layout(constraint, { parentUsesSize: true });
    this.size = this.child.size;
  }

  protected override computeDryLayout(constraints: Constraints): Size {
    if (this.child == null) {
      return constraints.constrain(Size.zero);
    }

    const width = this.child.getIntrinsicWidth(constraints.maxHeight) || 0;
    const childConstraints = Constraints.tightFor({ width }).enforce(
      constraints,
    );
    return this.child.getDryLayout(childConstraints);
  }
}
