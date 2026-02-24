import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import { Constraints, Size } from "../../type";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

class BaseLimitedBox extends SingleChildRenderObjectWidget {
  maxWidth: number;
  maxHeight: number;

  constructor({
    child,
    maxHeight = Infinity,
    maxWidth = Infinity,
    key,
  }: {
    child?: Widget;
    maxWidth?: number;
    maxHeight?: number;
    key?: any;
  }) {
    super({ child, key });
    this.maxHeight = maxHeight;
    this.maxWidth = maxWidth;
  }

  override createRenderObject(): RenderLimitedBox {
    return new RenderLimitedBox({
      maxHeight: this.maxHeight,
      maxWidth: this.maxWidth,
    });
  }

  override updateRenderObject(renderObject: RenderLimitedBox): void {
    renderObject.maxHeight = this.maxHeight;
    renderObject.maxWidth = this.maxWidth;
  }
}

class RenderLimitedBox extends SingleChildRenderObject {
  _maxWidth: number;
  _maxHeight: number;

  get maxWidth(): number {
    return this._maxWidth;
  }

  set maxWidth(newMaxWidth: number) {
    if (this._maxWidth === newMaxWidth) return; // early return
    this._maxWidth = newMaxWidth;
    this.markNeedsLayout();
  }

  get maxHeight(): number {
    return this._maxHeight;
  }

  set maxHeight(newMaxHeight: number) {
    if (this._maxHeight === newMaxHeight) return; // early return
    this._maxHeight = newMaxHeight;
    this.markNeedsLayout();
  }

  constructor({
    maxHeight = Infinity,
    maxWidth = Infinity,
  }: {
    maxWidth?: number;
    maxHeight?: number;
  }) {
    super({ isPainter: false });
    this._maxHeight = maxHeight;
    this._maxWidth = maxWidth;
  }

  protected override preformLayout(): void {
    if (this.child == null) {
      this.size = this.limitConstraints(this.constraints).constrain(Size.zero);
      return;
    }
    this.child.layout(this.limitConstraints(this.constraints));
    this.size = this.child.size;
  }

  private limitConstraints(constraints: Constraints): Constraints {
    return new Constraints({
      minHeight: constraints.minHeight,
      minWidth: constraints.minWidth,
      maxWidth: constraints.hasBoundedWidth
        ? constraints.maxWidth
        : constraints.constrainWidth(this.maxWidth),
      maxHeight: constraints.hasBoundedHeight
        ? constraints.maxHeight
        : constraints.constrainHeight(this.maxHeight),
    });
  }
}

export default BaseLimitedBox;
