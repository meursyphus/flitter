import { EdgeInsets } from "../type";
import type Widget from "../widget/Widget";
import _Padding from "./base/BasePadding";
import Expanded from "./Expanded";

export default function Padding({
  padding = EdgeInsets.all(0),
  child,
  key,
}: {
  child?: Widget;
  padding?: EdgeInsets;
  key?: any;
}) {
  if (child instanceof Expanded)
    throw { message: "Padding must not have a Expanded Widget" };
  return new _Padding({ padding, child, key });
}
