import type { Widget } from "../widget";
import BasePositioned from "./base/BasePositioned";

function Positioned(...props: ConstructorParameters<typeof BasePositioned>) {
  return new BasePositioned(...props);
}

Positioned.fill = ({ child }: { child: Widget }) =>
  Positioned({ top: 0, left: 0, bottom: 0, right: 0, child });

export default Positioned;
