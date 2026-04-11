import {
  Alignment,
  Column,
  Container,
  Expanded,
  Flexible,
  MainAxisAlignment,
  Opacity,
  Row,
  Stack,
  type Widget,
} from "flitter-core";
import { CartesianCustom } from "./types";

export function Grid(
  ...[{ x, y, xLine, yLine }]: Parameters<CartesianCustom["grid"]>
): Widget {
  return Stack({
    children: [
      Column({
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: Array.from({ length: y + 1 }, (_,index) =>
          index === y ? Opacity({ child: xLine, opacity: 0 }) : xLine,
        ).flat(),
      }),
      Row({
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: Array.from({ length: x + 1 }, (_, index) =>
          index === 0 ? Opacity({ child: yLine, opacity: 0 }) : yLine,
        ).flat(),
      }),
    ],
  });
}
