import Offset from "./_offset";

export class Rect {
  private constructor(
    public left: number,
    public top: number,
    public right: number,
    public bottom: number
  ) {}

  get width() {
    return this.right - this.left;
  }

  get height() {
    return this.bottom - this.top;
  }

  get shortestSide(): number {
    return Math.min(Math.abs(this.width), Math.abs(this.height));
  }

  get longestSide(): number {
    return Math.max(Math.abs(this.width), Math.abs(this.height));
  }

  get topLeft(): Offset {
    return new Offset({ x: this.left, y: this.top });
  }

  get topCenter(): Offset {
    return new Offset({ x: this.left + this.width / 2, y: this.top });
  }

  get topRight(): Offset {
    return new Offset({ x: this.right, y: this.top });
  }

  get center(): Offset {
    return new Offset({
      x: this.left + this.width / 2,
      y: this.top + this.height / 2,
    });
  }

  static fromLTRB({
    left,
    top,
    right,
    bottom,
  }: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  }) {
    return new Rect(left, top, right, bottom);
  }

  static fromLTWH({
    left,
    top,
    width,
    height,
  }: {
    left: number;
    top: number;
    width: number;
    height: number;
  }) {
    return Rect.fromLTRB({
      left,
      top,
      right: left + width,
      bottom: top + height,
    });
  }

  static fromCircle({ center, radius }: { center: Offset; radius: number }) {
    return Rect.fromCenter({ center, width: 2 * radius, height: 2 * radius });
  }

  static fromCenter({
    center,
    width,
    height,
  }: {
    center: Offset;
    width: number;
    height: number;
  }) {
    return Rect.fromLTRB({
      left: center.x - width / 2,
      top: center.y - height / 2,
      right: center.x + width / 2,
      bottom: center.y + height / 2,
    });
  }

  static fromPoints(a: Offset, b: Offset) {
    return Rect.fromLTRB({
      left: Math.min(a.x, b.x),
      top: Math.min(a.y, b.y),
      right: Math.max(a.x, b.x),
      bottom: Math.max(a.y, b.y),
    });
  }

  inflate(delta: number) {
    return Rect.fromLTRB({
      left: this.left - delta,
      top: this.top - delta,
      right: this.right + delta,
      bottom: this.bottom + delta,
    });
  }

  deflate(delta: number) {
    return this.inflate(-delta);
  }
}

export default Rect;
