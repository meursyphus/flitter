import type { CartesianCustom } from "./types";
import {
  Column,
  FractionalTranslation,
  MainAxisAlignment,
  MainAxisSize,
  Offset,
  Row,
  type Widget,
} from "flitter-core";
import { IgnoreSize } from "@utils/index";

export function XAxis(
  ...[{ labels, tick, line }, { type }]: Parameters<CartesianCustom["xAxis"]>
): Widget {
  return Column({
    mainAxisSize: MainAxisSize.min,
    children: [
      line,
      Row({
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: Array.from(
          { length: labels.length + (type === "label" ? 1 : 0) },
          (_, index) =>
            FractionalTranslation({
              translation: new Offset({ x: index === 0 ? -1 : 0, y: 0 }),
              child: tick,
            }),
        ),
      }),
      Row({
        mainAxisAlignment:
          type === "label"
            ? MainAxisAlignment.spaceAround
            : MainAxisAlignment.spaceBetween,
        children: labels.map((child) =>
          IgnoreSize({ child, ignoreWidth: true }),
        ),
      }),
    ],
  });
}
