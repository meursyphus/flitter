import type { Data } from "../type";
import Animatable from "./Animatable";

class Tween<T extends number | Data = number | Data> extends Animatable<T> {
  begin: T;
  end: T;
  constructor({ begin, end }: { begin: T; end?: T }) {
    super();
    this.begin = begin;
    this.end = end ?? begin;
  }

  transform(value: number): T {
    if (value === 0) return this.begin;
    if (value === 1) return this.end;
    return this.lerp(value);
  }

  protected lerp(t: number): T {
    const { begin } = this;
    if (typeof begin === "number") {
      const end = this.end as number;
      return (begin + (end - begin) * t) as T;
    } else {
      throw new Error("not implemented lerp on tween");
    }
  }
}

export default Tween;
