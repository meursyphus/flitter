import type { StackFit } from "../type";
import { Alignment, Rect } from "../type";
import type Widget from "../widget/Widget";
import BaseStack from "./base/BaseStack";
import ClipRect from "./ClipRect";

export default function Stack({
  clipped = false,
  children,
  alignment = Alignment.topLeft,
  fit,
  key,
}: {
  children: Widget[];
  clipped?: boolean;
  alignment?: Alignment;
  fit?: StackFit;
  key?: any;
}) {
  return ClipRect({
    key,
    clipped,
    clipper: (size) =>
      Rect.fromLTWH({
        left: 0,
        top: 0,
        width: size.width,
        height: size.height,
      }),
    child: new BaseStack({ children, alignment, fit }),
  });
}
