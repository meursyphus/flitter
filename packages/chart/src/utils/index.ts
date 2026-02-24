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
