import BaseAnimatedContainer from "./base/BaseAnimatedContainer";

export default function AnimatedContainer(
  ...props: ConstructorParameters<typeof BaseAnimatedContainer>
) {
  return new BaseAnimatedContainer(...props);
}
