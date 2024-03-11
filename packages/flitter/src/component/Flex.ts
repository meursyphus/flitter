import { Rect } from "../type";
import type Widget from "../widget/Widget";
import ClipRect from "./ClipRect";
import BaseFlex from "./base/BaseFlex";
import type {
  CrossAxisAlignment,
  MainAxisAlignment,
  Axis,
  VerticalDirection,
  MainAxisSize,
} from "../type";

export default function Flex({
  children,
  mainAxisAlignment,
  crossAxisAlignment,
  direction,
  clipped = false,
  verticalDirection,
  mainAxisSize,
  key,
}: {
  children: Widget[];
  mainAxisAlignment?: MainAxisAlignment;
  crossAxisAlignment?: CrossAxisAlignment;
  verticalDirection?: VerticalDirection;
  mainAxisSize?: MainAxisSize;
  clipped?: boolean;
  direction: Axis;
  key?: any;
}) {
  return ClipRect({
    clipped,
    key,
    clipper: (size) =>
      Rect.fromLTWH({
        left: 0,
        top: 0,
        width: size.width,
        height: size.height,
      }),
    child: new BaseFlex({
      key,
      children,
      direction,
      verticalDirection,
      mainAxisSize,
      mainAxisAlignment,
      crossAxisAlignment,
    }),
  });
}
