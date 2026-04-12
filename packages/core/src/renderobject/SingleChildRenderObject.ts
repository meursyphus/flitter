import type { Constraints } from "../type";
import { Offset, Size } from "../type";
import type { HitTestResult } from "../hit-test/HitTestResult";
import RenderObject from "./RenderObject";

/*
  It is counterpart to RenderShiftedBox of Flutter.
*/
export class SingleChildRenderObject extends RenderObject {
  get child(): RenderObject | undefined {
    return this.children[0];
  }

  protected preformLayout(): void {
    if (this.child == null) {
      this.size = this.computeSizeForNoChild(this.constraints);
    } else {
      this.child.layout(this.constraints, { parentUsesSize: true });
      this.size = this.constraints.constrain(this.child.size);
    }
  }

  protected computeSizeForNoChild(constraints: Constraints) {
    return constraints.constrain(Size.zero);
  }

  override hitTestChildren(result: HitTestResult, position: Offset): boolean {
    const child = this.child;
    if (child == null) return false;
    const childOffset = child.offset;
    const childPosition = new Offset({
      x: position.x - childOffset.x,
      y: position.y - childOffset.y,
    });
    return child.hitTest(result, childPosition);
  }

  protected override computeIntrinsicWidth(height: number): number {
    return this.child?.getIntrinsicWidth(height) || 0;
  }

  protected override computeIntrinsicHeight(width: number): number {
    return this.child?.getIntrinsicHeight(width) || 0;
  }

  protected override computeDryLayout(constraints: Constraints): Size {
    if (this.child == null) {
      return this.computeSizeForNoChild(constraints);
    }

    return constraints.constrain(this.child.getDryLayout(constraints));
  }
}

export default SingleChildRenderObject;
