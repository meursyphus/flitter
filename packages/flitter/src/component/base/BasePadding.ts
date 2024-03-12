import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import { Size, Offset, EdgeInsets } from "../../type";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

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
    if (this.child == null) return;
    const { top, left, right, bottom } = this.padding;
    const childConstraints = this.constraints.deflate(this.padding);

    this.child.layout(childConstraints);
    const { size: childSize } = this.child;

    this.size = this.constraints.constrain(
      new Size({
        width: childSize.width + left + right,
        height: childSize.height + top + bottom,
      })
    );

    this.child.offset = new Offset({ x: left, y: top });
  }

  getIntrinsicWidth(height: number): number {
    return super.getIntrinsicWidth(height) + this.padding.horizontal;
  }

  getIntrinsicHeight(width: number): number {
    return super.getIntrinsicHeight(width) + this.padding.vertical;
  }
}
