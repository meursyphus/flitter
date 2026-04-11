import type { Size } from "../type";
import { Constraints } from "../type";
import type Widget from "../widget/Widget";
import ConstrainedBox from "./ConstrainedBox";

function SizedBox({
  width,
  height,
  child,
  key,
}: {
  width?: number;
  height?: number;
  child?: Widget;
  key?: any;
}) {
  return ConstrainedBox({
    child,
    key,
    constraints: Constraints.tightFor({ width, height }),
  });
}

SizedBox.shrink = ({
  child,
  width = 0,
  height = 0,
}: { child?: Widget; width?: number; height?: number } = {}) =>
  SizedBox({ width, height, child });

SizedBox.expand = ({
  child,
  width = Infinity,
  height = Infinity,
}: { child?: Widget; width?: number; height?: number } = {}) =>
  SizedBox({ width, height, child });

SizedBox.fromSize = ({ child, size }: { child?: Widget; size?: Size } = {}) =>
  SizedBox({ width: size?.width, height: size?.height, child });

SizedBox.square = ({
  child,
  dimension,
}: {
  child?: Widget;
  dimension?: number;
} = {}) => SizedBox({ width: dimension, height: dimension, child });

export default SizedBox;
