import type { BubbleChartCustom } from "../types";
import { Container, BoxDecoration } from "flitter-core";

export function Bubble(
  ...[{ value }, ctx]: Parameters<BubbleChartCustom["bubble"]>
) {
  const { scale } = ctx;
  const normValue = scale != null
    ? (value - scale.value.min) / (scale.value.max - scale.value.min)
    : 0.5;
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
