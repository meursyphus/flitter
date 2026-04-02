import {
  Container,
  BoxDecoration,
  Border,
  Opacity,
  type Widget,
} from "flitter-core";
import type { ScatterChartCustom } from "flitter-ui/chart";
import type { AgScatterChartConfig } from "../config";

export function agScatter(
  ...[{ legend, index, isHovered }, ctx]: Parameters<ScatterChartCustom<AgScatterChartConfig>["scatter"]>
) {
  const { colors, scatter: scatterConfig } = ctx.config;
  const idx = ctx.legends.indexOf(legend);
  const fill = colors.fills[idx % colors.fills.length];
  const stroke = colors.strokes[idx % colors.strokes.length];
  const { hoveredPoint } = ctx;

  let opacity = 1;
  if (hoveredPoint != null) {
    if (isHovered) {
      opacity = 1;
    } else if (hoveredPoint.legend === legend) {
      opacity = 0.8;
    } else {
      opacity = 0.3;
    }
  }

  const dot = Container({
    width: scatterConfig.size,
    height: scatterConfig.size,
    decoration: new BoxDecoration({
      color: fill,
      shape: "circle",
      border: Border.all({ color: stroke, width: scatterConfig.strokeWidth }),
    }),
  });

  return opacity < 1 ? Opacity({ opacity, child: dot }) : dot;
}
