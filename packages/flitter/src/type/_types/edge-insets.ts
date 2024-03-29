import Calculable from "./_calculable";
import Rect from "./_rect";

type EdgeInsetsProps = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export class EdgeInsetsGeometry extends Calculable {
  readonly top: number;
  readonly bottom: number;
  readonly left: number;
  readonly right: number;

  plus(other: EdgeInsetsGeometry): EdgeInsetsGeometry {
    return new EdgeInsetsGeometry({
      top: this.top + other.top,
      bottom: this.bottom + other.bottom,
      left: this.left + other.left,
      right: this.right + other.right,
    });
  }

  multiply(value: number): EdgeInsetsGeometry {
    return new EdgeInsetsGeometry({
      top: this.top * value,
      bottom: this.bottom * value,
      left: this.left * value,
      right: this.right * value,
    });
  }

  equals(other: EdgeInsetsGeometry): boolean {
    if (this === other) return;
    return (
      this.top === other.top &&
      this.bottom === other.bottom &&
      this.left === other.left &&
      this.right === other.right
    );
  }

  /**
   * @deprecated The method should not be used
   * Instead use elquals
   */
  eqaul(other: EdgeInsetsGeometry) {
    return this.equals(other);
  }

  get horizontal(): number {
    return this.left + this.right;
  }

  get vertical(): number {
    return this.top + this.bottom;
  }

  constructor({ top, bottom, left, right }: EdgeInsetsProps) {
    super();
    this.top = top;
    this.bottom = bottom;
    this.left = left;
    this.right = right;
  }

  deflateRect(rect: Rect) {
    return Rect.fromLTRB({
      left: rect.left + this.left,
      top: rect.top + this.top,
      bottom: rect.bottom - this.bottom,
      right: rect.right - this.right,
    });
  }

  add(outer: EdgeInsetsGeometry) {
    return new EdgeInsetsGeometry({
      left: this.left + outer.left,
      right: this.right + outer.right,
      bottom: this.bottom + outer.bottom,
      top: this.top + outer.top,
    });
  }
}

class EdgeInsets extends EdgeInsetsGeometry {
  static all(value: number) {
    return new EdgeInsets({
      top: value,
      bottom: value,
      left: value,
      right: value,
    });
  }

  static symmetric({
    horizontal = 0,
    vertical = 0,
  }: {
    horizontal?: number;
    vertical?: number;
  }) {
    return new EdgeInsets({
      top: vertical,
      bottom: vertical,
      left: horizontal,
      right: horizontal,
    });
  }

  static only({
    top = 0,
    bottom = 0,
    left = 0,
    right = 0,
  }: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  }) {
    return new EdgeInsets({
      top,
      bottom,
      left,
      right,
    });
  }

  static fromLTRB({
    left,
    right,
    top,
    bottom,
  }: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }) {
    return new EdgeInsets({
      left,
      right,
      bottom,
      top,
    });
  }
}

export default EdgeInsets;
