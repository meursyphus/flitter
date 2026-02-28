import { Container, BoxDecoration } from "flitter-core";
import type { ScatterChartCustom } from "@headless/scatter-chart/types";
import type { ToastScatterChartConfig } from "./config";

export function toastScatter(
  ...[{ legend }, ctx]: Parameters<ScatterChartCustom<ToastScatterChartConfig>["scatter"]>
) {
  const { colors, scatter: scatterConfig } = ctx.config;
  const idx = ctx.legends.indexOf(legend);
  const color = colors[idx % colors.length];

  return Container({
    width: scatterConfig.size,
    height: scatterConfig.size,
    decoration: new BoxDecoration({
      color,
      shape: "circle",
    }),
  });
}
