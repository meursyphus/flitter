import _ColoredBox from "./base/BaseColoredBox";

export default function ColoredBox(
  ...props: ConstructorParameters<typeof _ColoredBox>
) {
  return new _ColoredBox(...props);
}
