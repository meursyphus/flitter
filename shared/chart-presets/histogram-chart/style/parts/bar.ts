import {
  Alignment,
  BoxDecoration,
  Container,
  FractionallySizedBox,
  Opacity,
  type Widget,
} from "flitter-core";
import type { HistogramChartCustom } from "flitter-ui/chart";
import type { HistogramChartConfig } from "../config";

export function agBar(
  ...[{ count, index, isHovered }, ctx]: Parameters<HistogramChartCustom<HistogramChartConfig>["bar"]>
): Widget {
  const scale = ctx.scale;
  const ratio =
    scale && scale.max > scale.min ? (count - scale.min) / (scale.max - scale.min) : 0;
  const color = ctx.config.colors.fills[0];
  const { hoveredBin } = ctx;

  let opacity = 1;
  if (hoveredBin != null) {
    opacity = isHovered ? 1 : 0.35;
  }

  const barWidget = Container({
    width: Infinity,
    height: Infinity,
    alignment: Alignment.bottomCenter,
    child: FractionallySizedBox({
      heightFactor: Math.max(0, Math.min(1, ratio)),
      child: Container({
        width: Infinity,
        height: Infinity,
        decoration: new BoxDecoration({ color }),
      }),
    }),
  });

  return opacity < 1 ? Opacity({ opacity, child: barWidget }) : barWidget;
}
