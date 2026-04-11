import type { Calculable } from "../type";
import Tween from "./Tween";

class CalculableTween<T extends Calculable> extends Tween<T> {
  protected lerp(t: number): T {
    const { begin, end } = this;
    return begin.plus(end.minus(begin).multiply(t)) as T;
  }
}

export default CalculableTween;
