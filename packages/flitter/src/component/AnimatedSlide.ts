import BaseAnimatedSlide from "./base/BaseAnimatedSlide";
function AnimatedSlide(
  ...props: ConstructorParameters<typeof BaseAnimatedSlide>
) {
  return new BaseAnimatedSlide(...props);
}

export default AnimatedSlide;
