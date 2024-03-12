import { RenderAligningShiftedBox } from "../../renderobject";
import { Alignment, Constraints, Size, TextDirection } from "../../type";
import type { Widget } from "../../widget";
import { SingleChildRenderObjectWidget } from "../../widget";

class BaseFractionallySizedBox extends SingleChildRenderObjectWidget {
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
    child?: Widget;
    alignment?: Alignment;
    widthFactor?: number;
    heightFactor?: number;
    key?: any;
  }) {
    super({ child, key });
    this.alignment = alignment;
    this.widthFactor = widthFactor;
    this.heightFactor = heightFactor;
  }

  override createRenderObject(): RenderFractionallySizedBox {
    return new RenderFractionallySizedBox({
      alignment: this.alignment,
      widthFactor: this.widthFactor,
      heightFactor: this.heightFactor,
    });
  }

  override updateRenderObject(renderObject: RenderFractionallySizedBox) {
    renderObject.alignment = this.alignment;
    renderObject.widthFactor = this.widthFactor;
    renderObject.heightFactor = this.heightFactor;
  }
}

class RenderFractionallySizedBox extends RenderAligningShiftedBox {
  _widthFactor?: number;
  _heightFactor?: number;
  get widthFactor(): number | undefined {
    return this._widthFactor;
  }

  set widthFactor(newWidthFactor: number | undefined) {
    if (this._widthFactor === newWidthFactor) return; // early return
    this._widthFactor = newWidthFactor;
    this.markNeedsLayout();
  }

  get heightFactor(): number | undefined {
    return this._heightFactor;
  }

  set heightFactor(newHeightFactor: number | undefined) {
    if (this._heightFactor === newHeightFactor) return; // early return
    this._heightFactor = newHeightFactor;
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

  private getInnerConstraints(constraints: Constraints): Constraints {
    let { minHeight, maxHeight, maxWidth, minWidth } = constraints;
    if (this.widthFactor != null) {
      const width = this.widthFactor * maxWidth;
      minWidth = width;
      maxWidth = width;
    }
    if (this.heightFactor != null) {
      const height = this.heightFactor * maxHeight;
      minHeight = height;
      maxHeight = height;
    }
    return new Constraints({
      maxHeight,
      maxWidth,
      minHeight,
      minWidth,
    });
  }

  protected preformLayout(): void {
    if (this.child != null) {
      this.child.layout(this.getInnerConstraints(this.constraints));
      this.size = this.constraints.constrain(this.child.size);
      this.alignChild();
    } else {
      this.size = this.constraints.constrain(
        this.getInnerConstraints(this.constraints).constrain(Size.zero)
      );
    }
  }

  override getIntrinsicHeight(width: number): number {
    let result: number;
    if (this.child == null) {
      result = super.getIntrinsicHeight(width);
    } else {
      result = this.child.getIntrinsicHeight(width * (this.widthFactor ?? 1));
    }

    return result / (this.heightFactor ?? 1);
  }

  override getIntrinsicWidth(height: number): number {
    let result: number;
    if (this.child == null) {
      result = super.getIntrinsicWidth(height);
    } else {
      result = this.child.getIntrinsicWidth(height * (this.heightFactor ?? 1));
    }

    return result / (this.widthFactor ?? 1);
  }
}

export default BaseFractionallySizedBox;
