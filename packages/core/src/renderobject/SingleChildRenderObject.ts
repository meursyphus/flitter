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
      if (!this.sizedByParent) {
        this.size = this.computeSizeForNoChild(this.constraints);
      }
    } else {
      this.child.layout(this.constraints);
      if (!this.sizedByParent) {
        this.size = this.constraints.constrain(this.child.size);
      }
    }
  }

  protected computeSizeForNoChild(constraints: Constraints) {
    return constraints.constrain(Size.zero);
  }

  protected override computeDryLayout(constraints: Constraints) {
    if (this.child == null) {
      return this.computeSizeForNoChild(constraints);
    }
    return constraints.constrain(this.child.getDryLayout(constraints));
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

  override getIntrinsicWidth(height: number): number {
    return this.child?.getIntrinsicWidth(height) || 0;
  }

  override getIntrinsicHeight(width: number): number {
    return this.child?.getIntrinsicHeight(width) || 0;
  }
}

export default SingleChildRenderObject;
