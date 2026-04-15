import { RenderAligningShiftedBox } from "../../renderobject";
import { Alignment, Constraints, Size, TextDirection } from "../../type";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

class Align extends SingleChildRenderObjectWidget {
  widthFactor?: number;
  heightFactor?: number;
  alignment: Alignment;
  constructor({
    child,
    widthFactor,
    heightFactor,
    alignment = Alignment.center,
    key,
  }: {
    key?: any;
    child?: Widget;
    alignment?: Alignment;
    widthFactor?: number;
    heightFactor?: number;
  }) {
    super({ child, key });
    this.alignment = alignment;
    this.widthFactor = widthFactor;
    this.heightFactor = heightFactor;
  }

  override createRenderObject(): RenderAlign {
    return new RenderAlign({
      alignment: this.alignment,
      widthFactor: this.widthFactor,
      heightFactor: this.heightFactor,
    });
  }

  override updateRenderObject(renderObject: RenderAlign) {
    renderObject.alignment = this.alignment;
    renderObject.widthFactor = this.widthFactor;
    renderObject.heightFactor = this.heightFactor;
  }
}

class RenderAlign extends RenderAligningShiftedBox {
  _widthFactor?: number;
  get widthFactor() {
    return this._widthFactor;
  }
  set widthFactor(value: number | undefined) {
    if (this._widthFactor === value) return;
    this._widthFactor = value;
    this.markNeedsLayout();
  }
  _heightFactor?: number;
  get heightFactor() {
    return this._heightFactor;
  }
  set heightFactor(value: number | undefined) {
    if (this._heightFactor === value) return;
    this._heightFactor = value;
    this.markNeedsLayout();
  }
  constructor({
    alignment,
    widthFactor,
    heightFactor,
  }: {
    alignment: Alignment;
    widthFactor?: number;
    heightFactor?: number;
  }) {
    super({ alignment, textDirection: TextDirection.ltr });

    if (widthFactor != null && widthFactor < 0)
      throw new Error("widthFactor must be greater than zero");
    if (heightFactor != null && heightFactor < 0)
      throw new Error("heightFactor must be greater than zero");

    this._widthFactor = widthFactor;
    this._heightFactor = heightFactor;
  }

  protected override get sizedByParent(): boolean {
    return (
      this.widthFactor == null &&
      this.heightFactor == null &&
      this.constraints.hasBoundedWidth &&
      this.constraints.hasBoundedHeight
    );
  }

  protected preformLayout(): void {
    const constraints = this.constraints;
    const shrinkWrapWidth = this.shouldShrinkWrapWidth(constraints);
    const shrinkWrapHeight = this.shouldShrinkWrapHeight(constraints);

    if (this.child != null) {
      this.child.layout(constraints.loosen());
      if (!this.sizedByParent) {
        this.size = this.getDryLayoutForChild(constraints, this.child.size);
      }
      this.alignChild();
    } else {
      if (!this.sizedByParent) {
        this.size = constraints.constrain({
          width: shrinkWrapWidth ? 0 : Infinity,
          height: shrinkWrapHeight ? 0 : Infinity,
        });
      }
    }
  }

  protected override computeDryLayout(constraints: Constraints) {
    const childSize = this.child?.getDryLayout(constraints.loosen());
    if (childSize == null) {
      return constraints.constrain({
        width: this.shouldShrinkWrapWidth(constraints) ? 0 : Infinity,
        height: this.shouldShrinkWrapHeight(constraints) ? 0 : Infinity,
      });
    }
    return this.getDryLayoutForChild(constraints, childSize);
  }

  private shouldShrinkWrapWidth(constraints: Constraints) {
    return this.widthFactor != null || constraints.maxWidth == Infinity;
  }

  private shouldShrinkWrapHeight(constraints: Constraints) {
    return this.heightFactor != null || constraints.maxHeight == Infinity;
  }

  private getDryLayoutForChild(constraints: Constraints, childSize: Size) {
    return constraints.constrain({
      width: this.shouldShrinkWrapWidth(constraints)
        ? childSize.width * (this.widthFactor ?? 1)
        : Infinity,
      height: this.shouldShrinkWrapHeight(constraints)
        ? childSize.height * (this.heightFactor ?? 1)
        : Infinity,
    });
  }
}

export default Align;
