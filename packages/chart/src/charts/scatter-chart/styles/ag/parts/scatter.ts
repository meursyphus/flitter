import {
  Container,
  BoxDecoration,
  Border,
  type Widget,
} from "flitter-core";
import type { ScatterChartCustom } from "@headless/scatter-chart/types";
import type { AgScatterChartConfig } from "../config";

export function agScatter(
  ...[{ legend }, ctx]: Parameters<ScatterChartCustom<AgScatterChartConfig>["scatter"]>
) {
  const { colors, scatter: scatterConfig } = ctx.config;
  const idx = ctx.legends.indexOf(legend);
  const fill = colors.fills[idx % colors.fills.length];
  const stroke = colors.strokes[idx % colors.strokes.length];

  return Container({
    width: scatterConfig.size,
    height: scatterConfig.size,
    decoration: new BoxDecoration({
      color: fill,
      shape: "circle",
      border: Border.all({ color: stroke, width: scatterConfig.strokeWidth }),
    }),
  });
}
