import { EdgeInsets } from "../type";
import type Widget from "../widget/Widget";
import _Padding from "./base/BasePadding";

export default function Padding({
  padding = EdgeInsets.all(0),
  child,
  key,
}: {
  child?: Widget;
  padding?: EdgeInsets;
  key?: any;
}) {
  return new _Padding({ padding, child, key });
}
