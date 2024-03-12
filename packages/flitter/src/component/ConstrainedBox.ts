import BaseConstrainedBox from "./base/BaseConstrainedBox";

function ConstrainedBox(
  ...props: ConstructorParameters<typeof BaseConstrainedBox>
) {
  return new BaseConstrainedBox(...props);
}

export default ConstrainedBox;
