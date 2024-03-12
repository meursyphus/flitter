import type { Constraints} from "../type";
import { Size } from "../type";
import RenderObject from "./RenderObject";

/*
  It is counterpart to RenderShiftedBox of Flutter.
*/
class SingleChildRenderObject extends RenderObject {
  get child(): RenderObject | undefined {
    return this.children[0];
  }

  protected preformLayout(): void {
    if (this.child == null) {
      this.size = this.computeSizeForNoChild(this.constraints);
    } else {
      this.child.layout(this.constraints);
      this.size = this.constraints.constrain(this.child.size);
    }
  }

  protected computeSizeForNoChild(constraints: Constraints) {
    return constraints.constrain(Size.zero);
  }

  override getIntrinsicWidth(height: number): number {
    return this.child?.getIntrinsicWidth(height) || 0;
  }

  override getIntrinsicHeight(width: number): number {
    return this.child?.getIntrinsicHeight(width) || 0;
  }
}

export default SingleChildRenderObject;
