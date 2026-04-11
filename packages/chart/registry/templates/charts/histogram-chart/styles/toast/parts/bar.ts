import {
  Border,
  BoxDecoration,
  BoxShadow,
  Container,
  ZIndex,
  type Widget,
} from "flitter-core";
import type { HistogramChartCustom } from "@headless/histogram-chart/types";
import type { HistogramChartConfig } from "../config";

export function toastBar(
  ...[{ bin, isHovered }, ctx]: Parameters<HistogramChartCustom<HistogramChartConfig>["bar"]>
): Widget {
  const color = ctx.config.colors[0];

  const barWidget = Container({
    width: Infinity,
    height: Infinity,
    decoration: new BoxDecoration({
      color,
      border: isHovered
        ? Border.all({ color: "white", width: 3, strokeAlign: 1 })
        : undefined,
      boxShadow: isHovered
        ? [new BoxShadow({ color: "rgba(0,0,0,0.22)", blurRadius: 10 })]
        : undefined,
    }),
  });

  return ZIndex({
    zIndex: isHovered ? 1 : 0,
    child: barWidget,
  });
}
