import BaseAnimatedAlignWidget from "./base/BaseAnimatedAlign";

export default function AnimatedAlignWidget(
  ...props: ConstructorParameters<typeof BaseAnimatedAlignWidget>
) {
  return new BaseAnimatedAlignWidget(...props);
}
