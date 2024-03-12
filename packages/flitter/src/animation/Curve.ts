import { assert } from "../utils";

class Curve {
  private transfromInternal: (_: number) => number;
  constructor(transform: (_: number) => number) {
    this.transfromInternal = transform;
  }

  transform(value: number): number {
    assert(
      value >= 0 && value <= 1,
      "parametric value $t is outside of [0, 1] range."
    );

    return this.transfromInternal(value);
  }
}

export default Curve;
