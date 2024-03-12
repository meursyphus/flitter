import BaseAlignmentScale from "./base/BaseAnimatedScale";

function AnimatedScale(
  ...props: ConstructorParameters<typeof BaseAlignmentScale>
) {
  return new BaseAlignmentScale(...props);
}

export default AnimatedScale;
