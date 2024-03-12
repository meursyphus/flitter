import Calculable from "./_calculable";

type OffsetProps = {
  x: number;
  y: number;
};

class Offset extends Calculable {
  readonly x: number;
  readonly y: number;
  constructor({ x, y }: OffsetProps) {
    super();
    this.x = x;
    this.y = y;
  }

  static raw({ x, y }: { x: number; y: number }) {
    return new Offset({ x: x, y: y });
  }

  static zero() {
    return Offset.raw({ x: 0, y: 0 });
  }

  plus({ x, y }: Offset) {
    return Offset.raw({ x: this.x + x, y: this.y + y });
  }

  multiply(value: number): Offset {
    return Offset.raw({ x: this.x * value, y: this.y * value });
  }

  equals(other: Offset): boolean {
    return this.x === other.x && this.y === other.y;
  }

  minus(other: Offset): Offset {
    return super.minus(other) as Offset;
  }
}

export default Offset;
