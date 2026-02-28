import { Container, BoxDecoration, Opacity } from "flitter-core";
import type { BubbleChartCustom } from "@headless/bubble-chart/types";
import type { ToastBubbleChartConfig } from "../config";

export function toastBubble(
  ...[{ value, legend }, ctx]: Parameters<BubbleChartCustom<ToastBubbleChartConfig>["bubble"]>
) {
  const { colors, bubble: bubbleConfig } = ctx.config;
  const idx = ctx.legends.indexOf(legend);
  const color = colors[idx % colors.length];

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
        color,
        shape: "circle",
      }),
    }),
  });
}
