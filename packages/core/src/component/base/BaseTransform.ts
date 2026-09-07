import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import { Offset } from "../../type";
import { Alignment, Matrix4, TextDirection } from "../../type";
import { assert } from "../../utils";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";
import { CanvasPainter } from "../../framework/renderer/canvas/canvas-painter";
import type { CanvasPaintingContext } from "../../framework/renderer/canvas/canvas-painting-context";
import type { HitTestResult } from "../../hit-test/HitTestResult";
import {
  TransformLayer,
  type Layer,
} from "../../framework/renderer/canvas/layer";

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
      "At least one of 'scale', 'scaleX' and 'scaleY' is required to be non-null",
    );
    assert(
      scale == null || (scaleX == null && scaleY == null),
      "If 'scale' is non-null then 'scaleX' and 'scaleY' must be left null",
    );
    return new Transform({
      key,
      child,
      origin,
      alignment,
      transform: Matrix4.diagonal3Values(
        scale ?? scaleX ?? 1,
        scale ?? scaleY ?? 1,
        1,
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
    renderObject.alignment = this.alignment!;
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
    this._origin = value ?? undefined;
    this.markTransformChanged();
  }
  _alignment?: Alignment;
  get alignment(): Alignment {
    return this._alignment!;
  }
  set alignment(value: Alignment) {
    if (
      this._alignment === value ||
      (this._alignment != null && value != null && this._alignment.equal(value))
    )
      return;
    this._alignment = value;
    this.markTransformChanged();
  }
  _transform: Matrix4;
  get transform() {
    return this._transform;
  }
  set transform(value: Matrix4) {
    if (this.transform.equals(value)) return;
    this._transform = value;
    this.markTransformChanged();
  }
  _textDirection: TextDirection;
  get textDirection(): TextDirection {
    return this._textDirection;
  }
  set textDirection(value) {
    if (this._textDirection == value) return;
    this._textDirection = value;
    this.markTransformChanged();
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

  private effectiveTransformCache: Matrix4 | null = null;
  private effectiveWidth = NaN;
  private effectiveHeight = NaN;
  private inverseTransform: Matrix4 | null = null;
  private inverseSource: Matrix4 | null = null;

  private markTransformChanged() {
    this.effectiveTransformCache = null;
    this.markNeedsPaintTransformUpdate();
    this.markNeedsPaint();
  }

  get _effectiveTransform(): Matrix4 {
    if (
      this.effectiveTransformCache != null &&
      this.effectiveWidth === this.size.width &&
      this.effectiveHeight === this.size.height
    ) {
      return this.effectiveTransformCache;
    }
    this.effectiveWidth = this.size.width;
    this.effectiveHeight = this.size.height;
    const resolvedAlignment = this._alignment?.resolve(this.textDirection);
    if (this._origin == null && resolvedAlignment == null) {
      return (this.effectiveTransformCache = this._transform);
    }
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

    return (this.effectiveTransformCache = result);
  }

  override hitTestChildren(result: HitTestResult, position: Offset): boolean {
    const child = this.child;
    if (child == null) return false;

    const effectiveTransform = this._effectiveTransform;
    const childOffset = child.offset;
    const translation = effectiveTransform.getAsTranslation();
    if (translation != null) {
      // The inverse of a pure translation is the negated translation.
      return child.hitTest(
        result,
        new Offset({
          x: position.x - childOffset.x - translation.x,
          y: position.y - childOffset.y - translation.y,
        }),
      );
    }

    if (this.inverseSource !== effectiveTransform) {
      this.inverseSource = effectiveTransform;
      const inverse = Matrix4.identity();
      this.inverseTransform =
        inverse.copyInverse(effectiveTransform) === 0 ? null : inverse;
    }
    const inverse = this.inverseTransform;
    if (inverse == null) return false;

    const localPosition = new Offset({
      x: position.x - childOffset.x,
      y: position.y - childOffset.y,
    });
    const transformed = new Offset({
      x:
        inverse.storage[0] * localPosition.x +
        inverse.storage[4] * localPosition.y +
        inverse.storage[12],
      y:
        inverse.storage[1] * localPosition.x +
        inverse.storage[5] * localPosition.y +
        inverse.storage[13],
    });
    return child.hitTest(result, transformed);
  }

  override applyPaintTransform(transform: Matrix4): Matrix4 {
    const effectiveTransform = this._effectiveTransform;
    const translation = effectiveTransform.getAsTranslation();
    if (translation != null) {
      return transform.translated(translation.x, translation.y);
    }
    return transform.multipliedMatrix(effectiveTransform);
  }

  protected override createCanvasPainter(): CanvasPainter {
    return new TransformCanvasPainter(this);
  }
}

class TransformCanvasPainter extends CanvasPainter {
  private transformLayer: TransformLayer | null = null;
  private boundaryLayers = new WeakMap<Layer, TransformLayer>();

  override wrapLayer(child: Layer, offset: Offset): Layer {
    const transform = this.transformAt(offset);
    let layer = this.boundaryLayers.get(child);
    if (layer == null) {
      layer = new TransformLayer({ offset: Offset.Constants.zero, transform });
      this.boundaryLayers.set(child, layer);
    }
    layer.transform = transform;
    layer.removeAllChildren();
    layer.append(child);
    return layer;
  }

  private transformAt(offset: Offset) {
    const transform = Matrix4.translationValues(offset.x, offset.y, 0);
    transform.multiplyMatrix(this.effectiveTransform);
    transform.translate(-offset.x, -offset.y);
    return transform;
  }
  get effectiveTransform(): Matrix4 {
    return (this.renderObject as RenderTransform)._effectiveTransform;
  }

  protected performPaint(context: CanvasPaintingContext, offset: Offset): void {
    if (context.paintsChildren && this.renderObject.needsCompositing) {
      const transform = this.transformAt(offset);
      const layer = (this.transformLayer ??= new TransformLayer({
        offset: Offset.Constants.zero,
        transform,
      }));
      layer.transform = transform;
      context.pushLayer(layer, childContext =>
        this.defaultPaint(childContext, offset),
      );
      return;
    }
    this.transformLayer = null;
    // The direct path and z-order replay both need real canvas state here:
    // descendant offsets do not include this paint-only transformation.
    const arr = this.effectiveTransform._m4storage;
    const translationOnly =
      arr[0] === 1 && arr[1] === 0 && arr[4] === 0 && arr[5] === 1;
    context.canvas.save();
    if (translationOnly) {
      context.canvas.translate(arr[12], arr[13]);
    } else {
      context.canvas.translate(offset.x, offset.y);
      context.canvas.transform(
        arr[0],
        arr[1],
        arr[4],
        arr[5],
        arr[12],
        arr[13],
      );
      context.canvas.translate(-offset.x, -offset.y);
    }
    this.defaultPaint(context, offset);
    context.canvas.restore();
  }
}

export default Transform;
