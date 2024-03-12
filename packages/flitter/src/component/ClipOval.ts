import type { Rect, Size } from "../type";
import { Path } from "../type";
import type Widget from "../widget/Widget";
import ClipPath from "./ClipPath";

export default function ClipOval({
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
    clipped,
    child,
    key,
    clipper: (size) => new Path().addOval(clipper(size)),
  });
}
