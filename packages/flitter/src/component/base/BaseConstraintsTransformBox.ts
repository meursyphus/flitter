import RenderAligningShiftedBox from "../../renderobject/RenderAligningShiftedBox";
import type SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import { Alignment, Constraints, TextDirection } from "../../type";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

class BaseConstraintsTransformBox extends SingleChildRenderObjectWidget {
  alignment: Alignment;
  textDirection: TextDirection;
  constraintsTransform: (constraints: Constraints) => Constraints;
  constructor({
    alignment = Alignment.center,
    child,
    constraintsTransform,
    textDirection = TextDirection.ltr,
    key,
  }: {
    child?: Widget;
    alignment?: Alignment;
    textDirection?: TextDirection;
    constraintsTransform: (constraints: Constraints) => Constraints;
    key?: any;
  }) {
    super({
      child,
      key,
    });
    this.alignment = alignment;
    this.textDirection = textDirection;
    this.constraintsTransform = constraintsTransform;
  }

  static unmodified = (constraints: Constraints) => constraints;
  static unconstrained = (_constraints: Constraints) => new Constraints();
  static widthUnconstrained = (constraints: Constraints) =>
    constraints.heightConstraints();
  static heightUnconstrained = (constraints: Constraints) =>
    constraints.widthConstraints();
  static maxHeightUnconstrained = (constraints: Constraints) =>
    constraints.copyWith({ maxHeight: Infinity });
  static maxWidthUnconstrained = (constraints: Constraints) =>
    constraints.copyWith({ maxWidth: Infinity });
  static maxUnconstrained = (constraints: Constraints) =>
    constraints.copyWith({ maxWidth: Infinity, maxHeight: Infinity });

  createRenderObject(): SingleChildRenderObject {
    return new RenderConstraintsTransformBox({
      alignment: this.alignment,
      textDirection: this.textDirection,
      constraintsTransform: this.constraintsTransform,
    });
  }

  updateRenderObject(renderObject: RenderConstraintsTransformBox): void {
    renderObject.alignment = this.alignment;
    renderObject.textDirection = this.textDirection;
    renderObject.constraintsTransform = this.constraintsTransform;
  }
}

class RenderConstraintsTransformBox extends RenderAligningShiftedBox {
  _constraintsTransform: (constraints: Constraints) => Constraints;
  get constraintsTransform() {
    return this._constraintsTransform;
  }
  set constraintsTransform(value: (constraints: Constraints) => Constraints) {
    if (value === this._constraintsTransform) return;
    this._constraintsTransform = value;
    this.markNeedsLayout();
  }

  constructor({
    alignment,
    textDirection,
    constraintsTransform,
  }: {
    alignment: Alignment;
    textDirection: TextDirection;
    constraintsTransform: (constraints: Constraints) => Constraints;
  }) {
    super({
      alignment,
      textDirection,
    });
    this._constraintsTransform = constraintsTransform;
  }

  override getIntrinsicHeight(width: number): number {
    return super.getIntrinsicHeight(
      this.constraintsTransform(new Constraints({ maxWidth: width })).maxWidth
    );
  }

  override getIntrinsicWidth(height: number): number {
    return super.getIntrinsicWidth(
      this.constraintsTransform(new Constraints({ maxHeight: height }))
        .maxHeight
    );
  }

  protected override preformLayout(): void {
    if (this.child == null) {
      this.size = this.constraints.smallest;
      return;
    }

    const childConstraints = this.constraintsTransform(this.constraints);
    this.child.layout(childConstraints);
    this.size = this.constraints.constrain(this.child.size);
    this.alignChild();
  }
}

export default BaseConstraintsTransformBox;
