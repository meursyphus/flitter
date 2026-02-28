import {
  Alignment,
  ConstraintsTransformBox,
  Widget,
  SizedBox,
} from "flitter-core";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function classToFn<V extends new (...arr: any[]) => any>(
  Constructor: V,
) {
  return (...arr: ConstructorParameters<V>) =>
    new Constructor(...arr) as InstanceType<V>;
}

export type PickPartial<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override?: Partial<T>,
): T {
  if (!override) return base;
  const result = { ...base } as Record<string, unknown>;
  for (const key of Object.keys(override)) {
    const ov = override[key as keyof typeof override];
    if (isPlainObject(ov) && isPlainObject(result[key])) {
      result[key] = deepMerge(result[key] as Record<string, unknown>, ov as Record<string, unknown>);
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
