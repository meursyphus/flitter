import BaseAnimatedFractionallySizedBox from "./base/BaseAnimatedFractionallySizedBox";

export default function AnimatedFractionallySizedBox(
  ...props: ConstructorParameters<typeof BaseAnimatedFractionallySizedBox>
) {
  return new BaseAnimatedFractionallySizedBox(...props);
}
