import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import type { Constraints } from "../../type";
import { Size } from "../../type";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

class BaseConstrainedBox extends SingleChildRenderObjectWidget {
  constraints: Constraints;
  constructor({
    child,
    constraints,
    key,
  }: {
    child?: Widget;
    constraints: Constraints;
    key?: any;
  }) {
    super({ child, key });
    this.constraints = constraints;
  }

  createRenderObject(): SingleChildRenderObject {
    return new RenderConstrainedBox({ constraint: this.constraints });
  }

  updateRenderObject(renderObject: RenderConstrainedBox): void {
    renderObject.additionalConstraint = this.constraints;
  }
}

class RenderConstrainedBox extends SingleChildRenderObject {
  _additionalConstraint: Constraints;
  get additionalConstraint() {
    return this._additionalConstraint;
  }
  set additionalConstraint(constraint: Constraints) {
    if (constraint.equals(this._additionalConstraint)) return;
    this._additionalConstraint = constraint;
    this.markNeedsLayout();
  }

  constructor({ constraint }: { constraint: Constraints }) {
    super({ isPainter: false });
    this._additionalConstraint = constraint;
  }

  protected override get sizedByParent(): boolean {
    return this.getEnforcedConstraints(this.constraints).isTight;
  }

  protected override preformLayout(): void {
    const enforcedConstraints = this.getEnforcedConstraints(this.constraints);
    if (this.child != null) {
      this.child.layout(enforcedConstraints);
    }
    if (!this.sizedByParent) {
      this.size = this.computeDryLayout(this.constraints);
    }
  }

  protected override computeDryLayout(constraints: Constraints) {
    const enforcedConstraints = this.getEnforcedConstraints(constraints);
    const childSize =
      this.child?.getDryLayout(enforcedConstraints) ?? Size.zero;
    return enforcedConstraints.constrain(childSize);
  }

  override getIntrinsicHeight(width: number): number {
    if (
      this.additionalConstraint.hasBoundedHeight &&
      this.additionalConstraint.hasTightHeight
    ) {
      return this.additionalConstraint.minHeight;
    }
    const height = super.getIntrinsicHeight(width);

    if (!this.additionalConstraint.hasInfiniteHeight) {
      return this.additionalConstraint.constrainHeight(height);
    }

    return height;
  }

  override getIntrinsicWidth(height: number): number {
    if (
      this.additionalConstraint.hasBoundedWidth &&
      this.additionalConstraint.hasTightWidth
    ) {
      return this.additionalConstraint.minWidth;
    }
    const width = super.getIntrinsicWidth(height);
    if (!this.additionalConstraint.hasInfiniteWidth) {
      return this.additionalConstraint.constrainWidth(width);
    }

    return width;
  }

  private getEnforcedConstraints(constraints: Constraints) {
    return this.additionalConstraint.enforce(constraints);
  }
}

export default BaseConstrainedBox;
