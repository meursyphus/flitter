import {
  Container,
  EdgeInsets,
  BoxDecoration,
  Border,
  BoxShadow,
  type Widget,
} from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastStackedBarChartConfig } from "../config";

export function toastBar(
  { legend, value, label, index, isHovered }: { value: number; label: string; legend: string; index: number; isHovered: boolean },
  context: BarChartContext<ToastStackedBarChartConfig>,
): Widget {
  const { colors, bar } = context.config;
  const idx = context.legends.indexOf(legend);
  const color = colors[idx % colors.length];

  const decoration = isHovered
    ? new BoxDecoration({
      color,
      border: Border.all({ color: "white", width: 4, strokeAlign: 1 }),
      boxShadow: [
        new BoxShadow({ color: "rgba(0,0,0,0.3)", blurRadius: 8 }),
      ],
    })
    : new BoxDecoration({ color });

  return Container({
    margin: EdgeInsets.symmetric({ horizontal: bar.gap }),
    decoration,
  });
}
