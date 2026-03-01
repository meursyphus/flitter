import {
  Container,
  BoxDecoration,
  Opacity,
  type Widget,
} from "flitter-core";
import type { BubbleChartCustom } from "@headless/bubble-chart/types";
import type { AgBubbleChartConfig } from "../config";

export function agBubble(
  ...[{ value, legend, label, index }, ctx]: Parameters<BubbleChartCustom<AgBubbleChartConfig>["bubble"]>
) {
  const { colors, bubble: bubbleConfig } = ctx.config;
  const idx = ctx.legends.indexOf(legend);
  const fillColor = colors.fills[idx % colors.fills.length];

  const { scale } = ctx;
  const normValue = scale != null
    ? (value - scale.value.min) / (scale.value.max - scale.value.min || 1)
    : 0.5;
  const radius = bubbleConfig.minRadius + normValue * (bubbleConfig.maxRadius - bubbleConfig.minRadius);

  return Opacity({
    opacity: bubbleConfig.opacity,
    child: Container({
      width: radius * 2,
      height: radius * 2,
      decoration: new BoxDecoration({
        color: fillColor,
        shape: "circle",
      }),
    }),
  });
}
