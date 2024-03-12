import Utils from "../../utils";
import Calculable from "./_calculable";
import Color from "./_color";
import Offset from "./_offset";

class BoxShadow extends Calculable {
  readonly color: Color;
  readonly offset: Offset;
  readonly blurRadius: number;

  constructor({
    color = "black",
    offset = { x: 0, y: 0 },
    blurRadius = 0,
  }: {
    color?: string | Color;
    offset?: { x: number; y: number };
    blurRadius?: number;
  } = {}) {
    super();
    this.color = typeof color === "string" ? Color.of(color) : color;
    this.offset = new Offset({ x: offset.x, y: offset.y });
    this.blurRadius = blurRadius;
  }

  static equals(targets: BoxShadow[], others: BoxShadow[]): boolean {
    if (targets.length !== others.length) {
      return false;
    }
    for (let i = 0; i < targets.length; i++) {
      if (!targets[i].equals(others[i])) {
        return false;
      }
    }
    return true;
  }

  static lerp(a: BoxShadow[], b: BoxShadow[], t: number) {
    const diff = a.length - b.length;
    let froms = a;
    let tos = b;

    if (diff < 0) {
      froms = [...a, ...Array.from({ length: -diff }, () => new BoxShadow())];
    } else {
      tos = [...b, ...Array.from({ length: diff }, () => new BoxShadow())];
    }

    return froms.map((from, i) => {
      const to = tos[i];
      return Utils.lerp(from, to, t);
    });
  }

  plus(other: BoxShadow): BoxShadow {
    return new BoxShadow({
      color: this.color.plus(other.color),
      offset: this.offset.plus(other.offset),
      blurRadius: this.blurRadius + other.blurRadius,
    });
  }

  multiply(value: number): BoxShadow {
    return new BoxShadow({
      color: this.color.multiply(value),
      offset: this.offset.multiply(value),
      blurRadius: this.blurRadius * value,
    });
  }

  equals(other: BoxShadow): boolean {
    if (this === other) return true;

    return (
      this.color === other.color &&
      this.offset.equals(other.offset) &&
      this.blurRadius === other.blurRadius
    );
  }

  /**
   * @deprecated The method should not be used
   */
  eqaul(other: BoxShadow): boolean {
    return this.equals(other);
  }
}

export default BoxShadow;
