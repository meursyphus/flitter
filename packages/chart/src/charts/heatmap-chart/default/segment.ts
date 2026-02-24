import { Container, Opacity } from "flitter-core";
import type { HeatmapCustom } from "../types";

export function Segment(
  ...[{ value, xIndex, yIndex }, { scale }]: Parameters<
    HeatmapCustom["segment"]
  >
) {
  return Opacity({
    opacity: (value - scale.min) / (scale.max - scale.min),
    child: Container({
      width: 100,
      height: 100,
      color: "black",
    }),
  });
}
