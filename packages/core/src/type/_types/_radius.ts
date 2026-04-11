import Utils from "../../utils";
import Calculable from "./_calculable";

export class Radius extends Calculable {
  readonly x: number;
  readonly y: number;
  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }
  static circular(r: number) {
    return Radius.elliptical({ x: r, y: r });
  }
  static elliptical({ x, y }: { x: number; y: number }) {
    return new Radius(x, y);
  }
  static zero = Radius.circular(0);

  plus(other: Radius): Radius {
    return new Radius(this.x + other.x, this.y + other.y);
  }

  multiply(value: number): Radius {
    return new Radius(this.x * value, this.y * value);
  }

  equals(other: Radius): boolean {
    if (this === other) return true;
    return this.x === other.x && this.y === other.y;
  }

  /**
   * @deprecated The method should not be used
   */
  equal(other: Radius): boolean {
    return this.equals(other);
  }

  clamp({ minimum, maximum }: { minimum?: Radius; maximum?: Radius }) {
    minimum ??= Radius.circular(-Infinity);
    maximum ??= Radius.circular(Infinity);
    return Radius.elliptical({
      x: Utils.clampDouble(this.x, minimum.x, maximum.x),
      y: Utils.clampDouble(this.y, minimum.y, maximum.y),
    });
  }

  clampValues({
    maximumX = Infinity,
    maximumY = Infinity,
    minimumX = -Infinity,
    minimumY = -Infinity,
  }: {
    minimumX?: number;
    minimumY?: number;
    maximumX?: number;
    maximumY?: number;
  }) {
    return Radius.elliptical({
      x: Utils.clampDouble(this.x, minimumX, maximumX),
      y: Utils.clampDouble(this.y, minimumY, maximumY),
    });
  }
}

export default Radius;
