import Calculable from "./_calculable";
import rgba from "color-rgba";

class Color extends Calculable {
  private readonly r: number;
  private readonly g: number;
  private readonly b: number;
  private readonly a: number;

  static of(value: string) {
    const [r, g, b, a] = rgba(value);
    return new Color({ r, g, b, a });
  }

  constructor({ r, g, b, a }: { r: number; g: number; b: number; a: number }) {
    super();
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  get value(): string {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  multiply(value: number): Color {
    return new Color({
      r: this.r * value,
      g: this.g * value,
      b: this.b * value,
      a: this.a * value,
    });
  }

  plus(other: Color): Color {
    return new Color({
      r: this.r + other.r,
      g: this.g + other.g,
      b: this.b + other.b,
      a: this.a + other.a,
    });
  }

  equals(other: Color): boolean {
    if (this === other) return true;

    return (
      this.r === other.r &&
      this.g === other.g &&
      this.b === other.b &&
      this.a === other.a
    );
  }
}

export default Color;
