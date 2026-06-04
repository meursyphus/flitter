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

  /*
    Specialized traversal for the single-child shape (Padding, Align, SizedBox,
    DecoratedBox, Opacity, ClipRect, ...). Avoids the Array.prototype.forEach
    closure dispatch of the base implementation on the hottest render-object
    shape, which is walked once per node in every layout/compositing/paint pass.
  */
  override visitChildren(callback: (child: RenderObject) => void): void {
    const child = this.children[0];
    if (child != null) callback(child);
  }

  protected preformLayout(): void {
    if (this.child == null) {
      if (!this.sizedByParent) {
        this.size = this.computeSizeForNoChild(this.constraints);
      }
    } else {
      this.child.layout(this.constraints, { parentUsesSize: true });
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

  protected override computeIntrinsicWidth(height: number): number {
    return this.child?.getIntrinsicWidth(height) || 0;
  }

  protected override computeIntrinsicHeight(width: number): number {
    return this.child?.getIntrinsicHeight(width) || 0;
  }
}

export default SingleChildRenderObject;
