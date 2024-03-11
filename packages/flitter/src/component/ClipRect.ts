import type { Rect, Size } from "../type";
import { Path } from "../type";
import type Widget from "../widget/Widget";
import ClipPath from "./ClipPath";

export default function ClipRect({
  child,
  clipper,
  clipped = true,
  key,
}: {
  child: Widget;
  clipper: (size: Size) => Rect;
  clipped?: boolean;
  key?: any;
}) {
  return ClipPath({
    child,
    clipped,
    key,
    clipper: (size) => new Path().addRect(clipper(size)),
  });
}
