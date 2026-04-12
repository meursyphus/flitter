import type RenderObject from "../../renderobject/RenderObject";
import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import { Constraints, Size } from "../../type";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";

export default class BaseIntrinsicHeight extends SingleChildRenderObjectWidget {
  createRenderObject(): SingleChildRenderObject {
    return new RenderIntrinsicHeight({ isPainter: false });
  }
  updateRenderObject(_: RenderObject): void {}
}

class RenderIntrinsicHeight extends SingleChildRenderObject {
  protected preformLayout(): void {
    if (this.child == null) {
      this.size = this.constraints.constrain(Size.zero);
      return;
    }
    const height =
      this.child.getIntrinsicHeight(this.constraints.maxWidth) || 0;
    const constraint = Constraints.tightFor({ height }).enforce(
      this.constraints,
    );
    this.child.layout(constraint, { parentUsesSize: true });
    this.size = this.child.size;
  }

  protected override computeDryLayout(constraints: Constraints): Size {
    if (this.child == null) {
      return constraints.constrain(Size.zero);
    }

    const height = this.child.getIntrinsicHeight(constraints.maxWidth) || 0;
    const childConstraints = Constraints.tightFor({ height }).enforce(
      constraints,
    );
    return this.child.getDryLayout(childConstraints);
  }
}
