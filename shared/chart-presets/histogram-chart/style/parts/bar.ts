import {
  BoxDecoration,
  Container,
  Opacity,
  type Widget,
} from "flitter-ui";
import type { HistogramChartCustom } from "flitter-ui/chart";
import type { HistogramChartConfig } from "../config";

export function agBar(
  ...[{ bin, isHovered }, ctx]: Parameters<HistogramChartCustom<HistogramChartConfig>["bar"]>
): Widget {
  const color = ctx.config.colors.fills[0];
  const { hoveredBin } = ctx;

  let opacity = 1;
  if (hoveredBin != null) {
    opacity = isHovered ? 1 : 0.35;
  }

  const barWidget = Container({
    width: Infinity,
    height: Infinity,
    decoration: new BoxDecoration({ color }),
  });

  return opacity < 1 ? Opacity({ opacity, child: barWidget }) : barWidget;
}
