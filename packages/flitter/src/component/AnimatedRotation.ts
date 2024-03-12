import BaseAnimatedRotation from "./base/BaseAnimatedRotation";
function AnimatedOpacity(
  ...props: ConstructorParameters<typeof BaseAnimatedRotation>
) {
  return new BaseAnimatedRotation(...props);
}

export default AnimatedOpacity;
