import {
  Container,
  BoxDecoration,
  Opacity,
  type Widget,
} from "flitter-core";
import type { BubbleChartCustom } from "flitter-ui/chart";
import type { AgBubbleChartConfig } from "../config";

export function agBubble(
  ...[{ value, legend, label, index, isHovered }, ctx]: Parameters<BubbleChartCustom<AgBubbleChartConfig>["bubble"]>
) {
  const { colors, bubble: bubbleConfig } = ctx.config;
  const idx = ctx.legends.indexOf(legend);
  const fillColor = colors.fills[idx % colors.fills.length];
  const { hoveredBubble } = ctx;

  const { scale } = ctx;
  const normValue = scale != null
    ? (value - scale.value.min) / (scale.value.max - scale.value.min || 1)
    : 0.5;
  const radius = bubbleConfig.minRadius + normValue * (bubbleConfig.maxRadius - bubbleConfig.minRadius);

  // Hovered bubble gets full opacity; others use base x hover
  let finalOpacity = bubbleConfig.opacity;
  if (hoveredBubble != null) {
    if (isHovered) {
      finalOpacity = 1;
    } else if (hoveredBubble.legend === legend) {
      finalOpacity = bubbleConfig.opacity * 0.8;
    } else {
      finalOpacity = bubbleConfig.opacity * 0.3;
    }
  }

  const bubble = Container({
    width: radius * 2,
    height: radius * 2,
    decoration: new BoxDecoration({
      color: fillColor,
      shape: "circle",
    }),
  });

  return finalOpacity < 1 ? Opacity({ opacity: finalOpacity, child: bubble }) : bubble;
}
