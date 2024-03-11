import BaseAnimatedPadding from "./base/BaseAnimatedPadding";

export default function Padding(
  ...props: ConstructorParameters<typeof BaseAnimatedPadding>
) {
  return new BaseAnimatedPadding(...props);
}
