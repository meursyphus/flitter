import MultiChildRenderObject from "../../renderobject/MultiChildRenderObject";
import {
  Alignment,
  Constraints,
  Offset,
  Size,
  TextDirection,
  StackFit,
} from "../../type";
import Utils, { assert } from "../../utils";
import type { Widget } from "../../widget";
import MultiChildRenderObjectWidget from "../../widget/MultiChildRenderObjectWidget";
import { RenderPositioned } from "./BasePositioned";

export default class BaseStack extends MultiChildRenderObjectWidget {
  alignment: Alignment;
  fit: StackFit;
  constructor({
    children,
    fit = StackFit.loose,
    alignment = Alignment.topLeft,
    key,
  }: {
    fit?: StackFit;
    alignment?: Alignment;
    children: Widget[];
    key?: any;
  }) {
    super({ children, key });
    this.alignment = alignment;
    this.fit = fit;
  }

  createRenderObject(): RenderStack {
    return new RenderStack({
      alignment: this.alignment,
      fit: this.fit,
    });
  }

  updateRenderObject(renderObject: RenderStack): void {
    renderObject.alignment = this.alignment;
    renderObject.fit = this.fit;
  }
}

export class RenderStack extends MultiChildRenderObject {
  _alignment: Alignment;
  get alignment(): Alignment {
    return this._alignment;
  }
  set alignment(value) {
    if (value.equal(this._alignment)) return;
    this._alignment = value;
    this.markNeedsLayout();
  }
  _fit: StackFit;
  get fit(): StackFit {
    return this._fit;
  }
  set fit(value: StackFit) {
    if (this._fit !== value) return;
    this._fit = value;
    this.markNeedsLayout();
  }
  _textDirection: TextDirection;
  get textDirection(): TextDirection {
    return this._textDirection;
  }
  set textDirection(value: TextDirection) {
    if (this._textDirection !== value) return;
    this._textDirection = value;
    this.markNeedsPaint();
  }

  constructor({
    fit = StackFit.loose,
    alignment = Alignment.topLeft,
    textDirection = TextDirection.ltr,
  }: {
    fit?: StackFit;
    alignment?: Alignment;
    textDirection?: TextDirection;
  }) {
    super({ isPainter: false });
    this._alignment = alignment;
    this._fit = fit;
    this._textDirection = textDirection;
  }

  private get resolvedAlignment(): Alignment {
    return this.alignment.resolve(this.textDirection);
  }

  private computeSize({ constraints }: { constraints: Constraints }) {
    let hasNonPositionedChildren = false;
    if (this.children.length === 0) {
      return constraints.biggest.isFinite
        ? constraints.biggest
        : constraints.smallest;
    }

    let [width, height] = [constraints.minWidth, constraints.minHeight];

    let nonPositionedConstraints: Constraints;

    switch (this.fit) {
      case "loose":
        nonPositionedConstraints = constraints.loosen();
        break;
      case "expand":
        nonPositionedConstraints = Constraints.tight(constraints.biggest);
        break;
      case "passthrough":
        nonPositionedConstraints = constraints;
        break;
    }

    this.children.forEach((child) => {
      if (child instanceof RenderPositioned && child.isPositioned) return;
      hasNonPositionedChildren = true;
      child.layout(nonPositionedConstraints);

      width = Math.max(width, child.size.width);
      height = Math.max(height, child.size.height);
    });

    let size: Size;
    if (hasNonPositionedChildren) {
      size = new Size({ width, height });
      assert(size.width === constraints.constrainWidth(width));
      assert(size.height === constraints.constrainHeight(height));
    } else {
      size = constraints.biggest;
    }

    return size;
  }

  static layoutPositionedChild({
    child,
    alignment,
    size,
  }: {
    child: RenderPositioned;
    alignment: Alignment;
    size: Size;
  }): void {
    assert(child.isPositioned, "child must be positioned");
    let childConstraints = new Constraints();

    if (child.left != null && child.right != null) {
      childConstraints = childConstraints.tighten({
        width: size.width - (child.left + child.right),
      });
    } else if (child.width != null) {
      childConstraints = childConstraints.tighten({
        width: child.width,
      });
    }

    if (child.top != null && child.bottom != null) {
      childConstraints = childConstraints.tighten({
        height: size.height - (child.top + child.bottom),
      });
    } else if (child.height != null) {
      childConstraints = childConstraints.tighten({
        height: child.height,
      });
    }

    child.layout(childConstraints);

    let x: number;

    if (child.left != null) {
      x = child.left;
    } else if (child.right != null) {
      x = size.width - child.right - child.size.width;
    } else {
      x = alignment.alongOffset(size.minus(child.size)).x;
    }

    let y: number;
    if (child.top != null) {
      y = child.top;
    } else if (child.bottom != null) {
      y = size.height - child.bottom - child.size.height;
    } else {
      y = alignment.alongOffset(size.minus(child.size)).y;
    }

    child.offset = new Offset({ x, y });
  }

  protected preformLayout(): void {
    this.size = this.computeSize({
      constraints: this.constraints,
    });

    this.children.forEach((child) => {
      if (!(child instanceof RenderPositioned && child.isPositioned)) {
        child.offset = this.resolvedAlignment.alongOffset(
          this.size.minus(child.size)
        );
      } else {
        RenderStack.layoutPositionedChild({
          child,
          size: this.size,
          alignment: this.resolvedAlignment,
        });
      }
    });
  }

  getIntrinsicWidth(height: number): number {
    return this.children
      .map((child) => child.getIntrinsicWidth(height))
      .reduce(Utils.maxReducer, 0);
  }

  getIntrinsicHeight(width: number): number {
    return this.children
      .map((child) => child.getIntrinsicHeight(width))
      .reduce(Utils.maxReducer, 0);
  }
}
