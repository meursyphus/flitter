import _DecoratedBox from "./base/BaseDecoratedBox";

export default function DecoratedBox(
  ...props: ConstructorParameters<typeof _DecoratedBox>
) {
  return new _DecoratedBox(...props);
}
