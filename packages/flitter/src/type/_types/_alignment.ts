import Calculable from "./_calculable";
import Offset from "./_offset";
import Rect from "./_rect";
import type Size from "./_size";
import type TextDirection from "./text-direction";

class Alignment extends Calculable {
  x: number; // -1 ~ 1
  y: number; // -1 ~ 1

  plus(other: Alignment): Alignment {
    return new Alignment({
      x: this.x + other.x,
      y: this.y + other.y,
    });
  }

  multiply(value: number): Alignment {
    return new Alignment({ x: this.x * value, y: this.y * value });
  }

  equals(other: Alignment): boolean {
    if (other === this) return true;

    return this.x === other.x && this.y === other.y;
  }

  constructor({ x, y }: { x: number; y: number }) {
    super();
    this.x = x;
    this.y = y;
  }

  /**
   * @deprecated The method should not be used
   */
  equal(other: Alignment) {
    return this.equals(other);
  }

  add(target: Alignment): Alignment {
    return new Alignment({
      x: this.x + target.x,
      y: this.y + target.y,
    });
  }

  alongOffset(other: Offset): Offset {
    const centerX = other.x / 2;
    const centerY = other.y / 2;
    return Offset.raw({
      x: centerX + this.x * centerX,
      y: centerY + this.y * centerY,
    });
  }

  alongSize(other: Size): Offset {
    const centerX = other.width / 2;
    const centerY = other.height / 2;
    return Offset.raw({
      x: centerX + this.x * centerX,
      y: centerY + this.y * centerY,
    });
  }

  withRect(rect: Rect): Offset {
    const halfWidth = rect.width / 2;
    const halfHeight = rect.height / 2;
    return Offset.raw({
      x: rect.left + halfWidth + this.x * halfWidth,
      y: rect.top + halfHeight + this.y * halfHeight,
    });
  }

  /// Returns a rect of the given size, aligned within given rect as specified
  /// by this alignment.
  ///
  /// For example, a 100×100 size inscribed on a 200×200 rect using
  /// [Alignment.topLeft] would be the 100×100 rect at the top left of
  inscribe(size: Size, rect: Rect): Rect {
    const halfWidthDelta = (rect.width - size.width) / 2;
    const halfHeightDelta = (rect.height - size.height) / 2;
    return Rect.fromLTWH({
      left: rect.left + halfWidthDelta + this.x * halfWidthDelta,
      top: rect.top + halfHeightDelta + this.y * halfHeightDelta,
      width: size.width,
      height: size.height,
    });
  }

  static lerp({
    start,
    end,
    t,
  }: {
    start?: Alignment;
    end?: Alignment;
    t: number;
  }): Alignment | undefined {
    if (start == null && end == null) {
      return;
    }

    if (start == null) {
      return new Alignment({
        x: lerpDouble(0, end!.x, t),
        y: lerpDouble(0, end!.y, t),
      });
    }

    if (end == null) {
      return new Alignment({
        x: lerpDouble(start.x, 0, t),
        y: lerpDouble(start.y, 0, t),
      });
    }

    return new Alignment({
      x: lerpDouble(start.x, end.x, t),
      y: lerpDouble(start.y, end.y, t),
    });
  }

  getOffset({
    target,
    current,
  }: {
    target: { width: number; height: number };
    current: { width: number; height: number };
  }): Offset {
    return new Offset({
      x: ((1 + this.x) * (current.width - target.width)) / 2,
      y: ((1 + this.y) * (current.height - target.height)) / 2,
    });
  }

  static of({ x, y }: { x: number; y: number }) {
    return new Alignment({ x, y });
  }

  static topLeft = Alignment.of({ x: -1, y: -1 });
  static topCenter = Alignment.of({ x: 0, y: -1 });
  static topRight = Alignment.of({ x: 1, y: -1 });
  static centerLeft = Alignment.of({ x: -1, y: 0 });
  static center = Alignment.of({ x: 0, y: 0 });
  static centerRight = Alignment.of({ x: 1, y: 0 });
  static bottomLeft = Alignment.of({ x: -1, y: 1 });
  static bottomCenter = Alignment.of({ x: 0, y: 1 });
  static bottomRight = Alignment.of({ x: 1, y: 1 });

  resolve(_?: TextDirection) {
    return this;
  }
}

export default Alignment;

function lerpDouble(a: number, b: number, t: number): number {
  if (t > 1 || t < 0)
    throw new Error("value must be between 0 and 1: " + t.toString());

  return a + (b - a) * t;
}
