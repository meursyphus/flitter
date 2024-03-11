import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

class BasePositioned extends SingleChildRenderObjectWidget {
  top?: number;
  bottom?: number;
  right?: number;
  left?: number;
  width?: number;
  height?: number;
  constructor({
    top,
    bottom,
    left,
    right,
    width,
    height,
    child,
    key,
  }: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    width?: number;
    height?: number;
    child?: Widget;
    key?: any;
  }) {
    super({ child, key });
    this.top = top;
    this.bottom = bottom;
    this.left = left;
    this.right = right;
    this.width = width;
    this.height = height;
  }

  createRenderObject(): RenderPositioned {
    return new RenderPositioned({
      top: this.top,
      left: this.left,
      right: this.right,
      bottom: this.bottom,
      width: this.width,
      height: this.height,
    });
  }

  updateRenderObject(renderObject: RenderPositioned): void {
    renderObject.top = this.top;
    renderObject.left = this.left;
    renderObject.bottom = this.bottom;
    renderObject.right = this.right;
    renderObject.width = this.width;
    renderObject.height = this.height;
  }
}

export class RenderPositioned extends SingleChildRenderObject {
  _top?: number;
  _bottom?: number;
  _right?: number;
  _left?: number;
  _width?: number;
  _height?: number;

  get top(): number | undefined {
    return this._top;
  }

  set top(newTop: number | undefined) {
    if (this._top === newTop) return; // early return
    this._top = newTop;
    this.markNeedsLayout();
  }

  get bottom(): number | undefined {
    return this._bottom;
  }

  set bottom(newBottom: number | undefined) {
    if (this._bottom === newBottom) return; // early return
    this._bottom = newBottom;
    this.markNeedsLayout();
  }

  get right(): number | undefined {
    return this._right;
  }

  set right(newRight: number | undefined) {
    if (this._right === newRight) return; // early return
    this._right = newRight;
    this.markNeedsLayout();
  }

  get left(): number | undefined {
    return this._left;
  }

  set left(newLeft: number | undefined) {
    if (this._left === newLeft) return; // early return
    this._left = newLeft;
    this.markNeedsLayout();
  }

  get width(): number | undefined {
    return this._width;
  }

  set width(newWidth: number | undefined) {
    if (this._width === newWidth) return; // early return
    this._width = newWidth;
    this.markNeedsLayout();
  }

  get height(): number | undefined {
    return this._height;
  }

  set height(newHeight: number | undefined) {
    if (this._height === newHeight) return; // early return
    this._height = newHeight;
    this.markNeedsLayout();
  }
  constructor({
    top,
    bottom,
    left,
    right,
    width,
    height,
  }: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    width?: number;
    height?: number;
  }) {
    super({ isPainter: false });
    this._top = top;
    this._bottom = bottom;
    this._left = left;
    this._right = right;
    this._width = width;
    this._height = height;
  }

  get isPositioned(): boolean {
    return (
      this.top != null ||
      this.bottom != null ||
      this.left != null ||
      this.right != null ||
      this.width != null ||
      this.height != null
    );
  }

  override getIntrinsicWidth(height: number): number {
    return this.child?.getIntrinsicWidth(height) || 0;
  }

  override getIntrinsicHeight(width: number): number {
    return this.child?.getIntrinsicHeight(width) || 0;
  }
}

export default BasePositioned;
