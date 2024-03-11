import BaseAnimatedOpacity from "./base/BaseAnimatedOpacity";
function AnimatedOpacity(
  ...props: ConstructorParameters<typeof BaseAnimatedOpacity>
) {
  return new BaseAnimatedOpacity(...props);
}

export default AnimatedOpacity;
