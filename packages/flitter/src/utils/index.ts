import applyMixins from "./applyMixins";
import assert from "./assert";
import lerp from "./lerp";
import { getTextHeight, getTextWidth } from "./getTextSize";
import functionalizeClass from "./functionalizeClass";
import { Calculable } from "../type";
export { default as createUniqueId } from "./createUniqueId";
export { default as TypedObject } from "./TypedObject";

export { assert, applyMixins, getTextHeight, getTextWidth, functionalizeClass };

export default class Utils {
  static sumReducer = (acc: number, value: number) => acc + value;
  static maxReducer = (acc: number, value: number) => Math.max(acc, value);
  static minReducer = (acc: number, value: number) => Math.min(acc, value);

  static sum(values: number[]) {
    return values.reduce(Utils.sumReducer, 0);
  }

  static repeat<T>(value: T, count: number) {
    return Array.from({ length: count }, () => value);
  }

  static clampDouble(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
  }

  static arrayEqual(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;

    return a.every((value, i) => value === b[i]);
  }

  static lerp<T extends Calculable | number>(a: T, b: T, t: number): T {
    assert(t >= 0 && t <= 1);
    if (typeof a === "number") {
      return lerp(a, b as number, t) as T;
    }

    assert(b instanceof Calculable);

    return a.plus((b as Calculable).minus(a).multiply(t)) as T;
  }
}
