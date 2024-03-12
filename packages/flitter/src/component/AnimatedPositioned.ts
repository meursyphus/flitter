import BaseAnimatedPositioned from "./base/BaseAnimatedPositioned";

export default function AnimatedPositioned(
  ...props: ConstructorParameters<typeof BaseAnimatedPositioned>
) {
  return new BaseAnimatedPositioned(...props);
}
