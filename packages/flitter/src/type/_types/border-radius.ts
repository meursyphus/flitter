import Radius from "./_radius";
import RRect from "./r-rect";
import type Rect from "./_rect";
import BorderRadiusGeometry from "./border-radius-geometry";

export default class BorderRadius extends BorderRadiusGeometry {
  static all(radius: Radius) {
    return this.only({
      topLeft: radius,
      topRight: radius,
      bottomLeft: radius,
      bottomRight: radius,
    });
  }

  static circular(radius: number) {
    return this.all(Radius.circular(radius));
  }

  static vertical({
    top = Radius.zero,
    bottom = Radius.zero,
  }: {
    top?: Radius;
    bottom?: Radius;
  }) {
    return this.only({
      topLeft: top,
      topRight: top,
      bottomLeft: bottom,
      bottomRight: bottom,
    });
  }

  static left({
    left = Radius.zero,
    right = Radius.zero,
  }: {
    left?: Radius;
    right?: Radius;
  }) {
    return this.only({
      topLeft: left,
      bottomLeft: left,
      topRight: right,
      bottomRight: right,
    });
  }

  static only({
    topLeft = Radius.zero,
    topRight = Radius.zero,
    bottomLeft = Radius.zero,
    bottomRight = Radius.zero,
  }: {
    topLeft?: Radius;
    topRight?: Radius;
    bottomLeft?: Radius;
    bottomRight?: Radius;
  }) {
    return new BorderRadius({
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    });
  }

  plus(other: BorderRadiusGeometry): BorderRadiusGeometry {
    return new BorderRadius({
      topLeft: this.topLeft.plus(other.topLeft),
      topRight: this.topRight.plus(other.topRight),
      bottomLeft: this.bottomLeft.plus(other.bottomLeft),
      bottomRight: this.bottomRight.plus(other.bottomRight),
    });
  }

  multiply(value: number): BorderRadiusGeometry {
    return new BorderRadius({
      topLeft: this.topLeft.multiply(value),
      topRight: this.topRight.multiply(value),
      bottomLeft: this.bottomLeft.multiply(value),
      bottomRight: this.bottomRight.multiply(value),
    });
  }

  copyWith({
    topLeft = this.topLeft,
    topRight = this.topRight,
    bottomLeft = this.bottomLeft,
    bottomRight = this.bottomRight,
  }: {
    topLeft?: Radius;
    topRight?: Radius;
    bottomLeft?: Radius;
    bottomRight?: Radius;
  }) {
    return BorderRadius.only({
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    });
  }

  static zero = this.all(Radius.zero);

  toRRect(rect: Rect): RRect {
    return RRect.fromRectAndCorners({
      rect,
      topLeft: this.topLeft.clamp({ minimum: Radius.zero }),
      topRight: this.topRight.clamp({ minimum: Radius.zero }),
      bottomLeft: this.bottomLeft.clamp({ minimum: Radius.zero }),
      bottomRight: this.bottomRight.clamp({ minimum: Radius.zero }),
    });
  }
}
