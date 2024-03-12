import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import type { Offset} from "../../type";
import { Alignment, Matrix4, TextDirection } from "../../type";
import { assert } from "../../utils";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

class Transform extends SingleChildRenderObjectWidget {
  origin?: Offset;
  alignment?: Alignment;
  transform: Matrix4;

  constructor({
    child,
    transform,
    origin,
    alignment = Alignment.center,
    key,
  }: {
    child?: Widget;
    transform: Matrix4;
    origin?: Offset;
    alignment?: Alignment;
    key?: any;
  }) {
    super({ child, key });
    this.transform = transform;
    this.origin = origin;
    this.alignment = alignment;
  }

  static rotate({
    angle,
    origin,
    alignment = Alignment.center,
    child,
    key,
  }: {
    origin?: Offset;
    alignment?: Alignment;
    child?: Widget;
    angle: number;
    key?: any;
  }) {
    return new Transform({
      key,
      child,
      origin,
      alignment,
      transform: Transform._computeRotation(angle),
    });
  }

  static translate({
    child,
    offset,
    key,
  }: {
    child?: Widget;
    offset: Offset;
    key?: any;
  }) {
    return new Transform({
      child,
      key,
      transform: Matrix4.translationValues(offset.x, offset.y, 0),
      origin: undefined,
      alignment: undefined,
    });
  }

  static scale({
    child,
    scale,
    scaleX,
    scaleY,
    origin,
    alignment = Alignment.center,
    key,
  }: {
    child?: Widget;
    alignment?: Alignment;
    origin?: Offset;
    scale?: number;
    scaleX?: number;
    scaleY?: number;
    key?: any;
  }) {
    assert(
      !(scale == null && scaleX == null && scaleY == null),
      "At least one of 'scale', 'scaleX' and 'scaleY' is required to be non-null"
    );
    assert(
      scale == null || (scaleX == null && scaleY == null),
      "If 'scale' is non-null then 'scaleX' and 'scaleY' must be left null"
    );
    return new Transform({
      key,
      child,
      origin,
      alignment,
      transform: Matrix4.diagonal3Values(
        scale ?? scaleX ?? 1,
        scale ?? scaleY ?? 1,
        1
      ),
    });
  }

  override createRenderObject(): SingleChildRenderObject {
    return new RenderTransform({
      transform: this.transform,
      origin: this.origin,
      alignment: this.alignment,
    });
  }

  updateRenderObject(renderObject: RenderTransform): void {
    renderObject.transform = this.transform;
    renderObject.origin = this.origin;
    renderObject.alignment = this.alignment;
  }

  private static _computeRotation(radians: number) {
    if (radians == 0) {
      return Matrix4.identity();
    }
    const sin = Math.sin(radians);
    if (sin == 1) {
      return Transform._createZRotation(1.0, 0.0);
    }

    if (sin == -1) {
      return Transform._createZRotation(-1.0, 0.0);
    }

    const cos = Math.cos(radians);

    if (cos == -1.0) {
      return Transform._createZRotation(0, -1);
    }

    return Transform._createZRotation(sin, cos);
  }

  private static _createZRotation(sin: number, cos: number) {
    const result = Matrix4.zero();
    result.storage[0] = cos;
    result.storage[1] = sin;
    result.storage[4] = -sin;
    result.storage[5] = cos;
    result.storage[10] = 1.0;
    result.storage[15] = 1.0;
    return result;
  }
}

class RenderTransform extends SingleChildRenderObject {
  _origin?: Offset;
  get origin(): Offset | undefined | null {
    return this._origin;
  }
  set origin(value: Offset | undefined | null) {
    if (value == null && this._origin == null) return;
    if (
      value != null &&
      this._origin != null &&
      this._origin.x === value.x &&
      this._origin.y === value.y
    )
      return;
    this._origin = value;
    this.markNeedsLayout();
  }
  _alignment?: Alignment;
  get alignment(): Alignment {
    return this._alignment;
  }
  set alignment(value: Alignment) {
    if (this._alignment.equal(value)) return;
    this._alignment = value;
    this.markNeedsLayout();
  }
  _transform: Matrix4;
  get transform() {
    return this._transform;
  }
  set transform(value: Matrix4) {
    if (this.transform.equals(value)) return;
    this._transform = value;
    this.markNeedsLayout();
  }
  _textDirection: TextDirection;
  get textDirection(): TextDirection {
    return this._textDirection;
  }
  set textDirection(value) {
    if (this._textDirection == value) return;
    this._textDirection = value;
    this.markNeedsLayout();
  }
  constructor({
    origin,
    alignment,
    transform,
    textDirection = TextDirection.ltr,
  }: {
    transform: Matrix4;
    origin?: Offset;
    alignment?: Alignment;
    textDirection?: TextDirection;
  }) {
    super({ isPainter: false });
    this._transform = transform;
    this._origin = origin;
    this._alignment = alignment;
    this._textDirection = textDirection;
  }

  private get _effectiveTransform(): Matrix4 {
    const resolvedAlignment = this.alignment?.resolve(this.textDirection);
    const translation = resolvedAlignment?.alongSize(this.size) ?? {
      x: 0,
      y: 0,
    };
    const origin = this.origin ?? { x: 0, y: 0 };
    const effectiveOrigin = {
      x: origin.x + translation.x,
      y: origin.y + translation.y,
    };
    const result = Matrix4.identity();

    result.translate(effectiveOrigin.x, effectiveOrigin.y);
    result.multiplyMatrix(this.transform);
    result.translate(-effectiveOrigin.x, -effectiveOrigin.y);

    return result;
  }

  override getChildMatrix4(parentMatrix: Matrix4): Matrix4 {
    return parentMatrix.multipliedMatrix(this._effectiveTransform);
  }
}

export default Transform;
