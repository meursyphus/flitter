import type { RRect, Size } from "../type";
import { BorderRadius, Path, Rect } from "../type";
import type Widget from "../widget/Widget";
import ClipPath from "./ClipPath";

export default function ClipOval({
  child,
  borderRadius = BorderRadius.zero,
  clipped = true,
  clipper,
  key,
}: {
  child: Widget;
  borderRadius?: BorderRadius;
  clipped?: boolean;
  clipper?: (size: Size) => RRect;
  key?: any;
}) {
  return ClipPath({
    child,
    key,
    clipped,
    clipper: (size) =>
      new Path().addRRect(
        clipper
          ? clipper(size)
          : borderRadius.toRRect(
              Rect.fromLTWH({
                left: 0,
                top: 0,
                width: size.width,
                height: size.height,
              })
            )
      ),
  });
}
