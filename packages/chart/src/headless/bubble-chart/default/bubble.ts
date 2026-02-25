import type { BubbleChartCustom } from "../types";
import { Container, BoxDecoration } from "flitter-core";

export function Bubble(
  ...[{ value, label, legend, index }, { scale }]: Parameters<BubbleChartCustom["bubble"]>
) {
  const normValue = (value - scale.value.min) / (scale.value.max - scale.value.min);
  const radius = 5 + normValue * 20;

  return Container({
    width: radius * 2,
    height: radius * 2,
    decoration: new BoxDecoration({
      color: "black",
      shape: "circle",
    }),
  });
}
