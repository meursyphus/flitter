import {
  Alignment,
  Border,
  BoxDecoration,
  BoxShadow,
  Container,
  FractionallySizedBox,
  type Widget,
} from "flitter-core";
import type { HistogramChartCustom } from "@headless/histogram-chart/types";
import type { HistogramChartConfig } from "../config";

export function toastBar(
  ...[{ binMin, binMax, count, index, isHovered }, ctx]: Parameters<HistogramChartCustom<HistogramChartConfig>["bar"]>
): Widget {
  const scale = ctx.scale;
  const ratio =
    scale && scale.max > scale.min ? (count - scale.min) / (scale.max - scale.min) : 0;
  const color = ctx.config.colors[0];

  const barWidget = Container({
    width: Infinity,
    height: Infinity,
    alignment: Alignment.bottomCenter,
    child: FractionallySizedBox({
      heightFactor: Math.max(0, Math.min(1, ratio)),
      child: Container({
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
      }),
    }),
  });
  return barWidget;
}
