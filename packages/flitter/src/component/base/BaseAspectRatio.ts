import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import { Constraints, Size } from "../../type";
import { assert } from "../../utils";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

class AspectRatio extends SingleChildRenderObjectWidget {
  aspectRatio: number;
  constructor({
    child,
    aspectRatio,
    key,
  }: {
    child?: Widget;
    aspectRatio: number;
    key?: string;
  }) {
    super({ child, key });
    this.aspectRatio = aspectRatio;
  }

  override createRenderObject(): SingleChildRenderObject {
    return new RenderAspectRatio({
      aspectRatio: this.aspectRatio,
    });
  }

  updateRenderObject(renderObject: RenderAspectRatio): void {
    renderObject.aspectRatio = this.aspectRatio;
  }
}

class RenderAspectRatio extends SingleChildRenderObject {
  _aspectRatio!: number;
  get aspectRatio(): number {
    return this._aspectRatio;
  }
  set aspectRatio(value: number) {
    assert(value > 0);
    assert(Number.isFinite(value));
    this._aspectRatio = value;
  }

  constructor({ aspectRatio }: { aspectRatio: number }) {
    super({ isPainter: false });
    this._aspectRatio = aspectRatio;
  }

  getIntrinsicWidth(height: number): number {
    if (Number.isFinite(height)) {
      return height * this.aspectRatio;
    }

    if (this.child != null) {
      return this.child.getIntrinsicWidth(height);
    }

    return 0;
  }

  getIntrinsicHeight(width: number): number {
    if (Number.isFinite(width)) {
      return width / this.aspectRatio;
    }

    if (this.child != null) {
      return this.child.getIntrinsicHeight(width);
    }

    return 0;
  }

  private _applyAspectRatio(constraints: Constraints): Size {
    if (constraints.isTight) {
      return constraints.smallest;
    }

    let width = constraints.maxWidth;
    let height: number;

    if (Number.isFinite(width)) {
      height = width / this.aspectRatio;
    } else {
      height = constraints.maxHeight;
      width = height * this.aspectRatio;
    }

    if (width > constraints.maxWidth) {
      width = constraints.maxWidth;
      height = width / this.aspectRatio;
    }

    if (height > constraints.maxHeight) {
      height = constraints.maxHeight;
      width = height * this.aspectRatio;
    }

    if (width < constraints.minWidth) {
      width = constraints.minWidth;
      height = width / this.aspectRatio;
    }

    if (height < constraints.minHeight) {
      height = constraints.minHeight;
      width = height * this.aspectRatio;
    }

    return constraints.constrain(new Size({ width, height }));
  }

  protected override preformLayout(): void {
    this.size = this._applyAspectRatio(this.constraints);
    if (this.child != null) {
      this.child.layout(Constraints.tight(this.size));
    }
  }
}

export default AspectRatio;
