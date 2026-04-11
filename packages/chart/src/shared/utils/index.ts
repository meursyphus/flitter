import {
  Alignment,
  ConstraintsTransformBox,
  Widget,
  SizedBox,
} from "flitter-core";
export * from "./scale";
export * from "./draw-spline-line";
export * from "./color";
export * from "./angle";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function classToFn<V extends new (...arr: any[]) => any>(
  Constructor: V,
) {
  return (...arr: ConstructorParameters<V>) =>
    new Constructor(...arr) as InstanceType<V>;
}

type NoInfer<T> = [T][T extends any ? 0 : never];

export type DeepPartial<T> = T extends (...args: any[]) => any
  ? T
  : T extends Date
    ? Date
    : T extends Array<infer U>
      ? DeepPartial<U>[]
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

export type PickPartial<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function deepMerge<T extends object>(
  base: T,
  override?: DeepPartial<NoInfer<T>>,
): T {
  if (!override) return base;
  const result = { ...base } as Record<string, unknown>;
  for (const key of Object.keys(override as Record<string, unknown>)) {
    const ov = (override as Record<string, unknown>)[key];
    const current = result[key];
    if (isPlainObject(ov) && isPlainObject(current)) {
      result[key] = deepMerge(current, ov as Record<string, unknown>);
    } else if (ov !== undefined) {
      result[key] = ov;
    }
  }
  return result as T;
}

export function IgnoreSize({
  ignoreHeight = false,
  ignoreWidth = false,
  child,
  alignment,
}: {
  ignoreWidth?: boolean;
  ignoreHeight?: boolean;
  child?: Widget;
  alignment?: Alignment;
}) {
  let constraintsTransform;

  if (ignoreWidth && ignoreHeight) {
    constraintsTransform = ConstraintsTransformBox.maxUnconstrained;
  } else if (ignoreWidth) {
    constraintsTransform = ConstraintsTransformBox.maxWidthUnconstrained;
  } else if (ignoreHeight) {
    constraintsTransform = ConstraintsTransformBox.maxHeightUnconstrained;
  } else {
    constraintsTransform = ConstraintsTransformBox.unmodified;
  }

  return SizedBox({
    width: ignoreWidth ? 0 : undefined,
    height: ignoreHeight ? 0 : undefined,
    child: ConstraintsTransformBox({
      alignment,
      constraintsTransform,
      child,
    }),
  });
}
