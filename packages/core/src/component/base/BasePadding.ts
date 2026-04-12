import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import { Size, Offset, EdgeInsets } from "../../type";
import type { Constraints } from "../../type";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";
import type Flexible from "./BaseFlexible";

export default class Padding extends SingleChildRenderObjectWidget {
  padding: EdgeInsets;
  constructor({
    padding = EdgeInsets.all(0),
    child,
    key,
  }: {
    padding?: EdgeInsets;
    child?: Widget;
    key?: any;
  }) {
    super({ child, key });

    if ((child as Flexible)?.isFlexible && (child as Flexible).fit === "tight")
      throw new Error("Padding must not have a Expanded Widget");
    this.padding = padding;
  }

  createRenderObject(): RenderPadding {
    return new RenderPadding({
      padding: this.padding,
    });
  }

  updateRenderObject(renderObject: RenderPadding): void {
    renderObject.padding = this.padding;
  }
}

class RenderPadding extends SingleChildRenderObject {
  _padding: EdgeInsets;
  get padding(): EdgeInsets {
    return this._padding;
  }
  set padding(value: EdgeInsets) {
    if (value.eqaul(this._padding)) return;
    this._padding = value;
    this.markNeedsLayout();
  }
  constructor({ padding }: { padding: EdgeInsets }) {
    super({ isPainter: false });
    this._padding = padding;
  }

  protected preformLayout(): void {
    if (this.child == null) {
      this.size = this.constraints.constrain(Size.zero);
      return;
    }
    const { top, left, right, bottom } = this.padding;
    const childConstraints = this.constraints.deflate(this.padding);

    this.child.layout(childConstraints, { parentUsesSize: true });
    const { size: childSize } = this.child;

    this.size = this.constraints.constrain(
      new Size({
        width: childSize.width + left + right,
        height: childSize.height + top + bottom,
      }),
    );

    this.child.offset = new Offset({ x: left, y: top });
  }

  protected override computeIntrinsicWidth(height: number): number {
    return super.computeIntrinsicWidth(height) + this.padding.horizontal;
  }

  protected override computeIntrinsicHeight(width: number): number {
    return super.computeIntrinsicHeight(width) + this.padding.vertical;
  }

  protected override computeDryLayout(constraints: Constraints): Size {
    if (this.child == null) {
      return constraints.constrain(Size.zero);
    }

    const childSize = this.child.getDryLayout(constraints.deflate(this.padding));
    return constraints.constrain(
      new Size({
        width: childSize.width + this.padding.horizontal,
        height: childSize.height + this.padding.vertical,
      }),
    );
  }
}
