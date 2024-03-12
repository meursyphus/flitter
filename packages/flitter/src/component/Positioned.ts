import { classToFunction } from "../utils";
import type { Widget } from "../widget";
import BasePositioned from "./base/BasePositioned";

interface PositionedFunction {
  (props: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    child: Widget;
  }): Widget;
  fill: (props: { child: Widget }) => Widget;
}

const Positioned: PositionedFunction = classToFunction(
  BasePositioned
) as PositionedFunction;

Positioned.fill = ({ child }: { child: Widget }) =>
  Positioned({ top: 0, left: 0, bottom: 0, right: 0, child });

export default Positioned;
