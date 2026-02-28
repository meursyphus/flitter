import {
  Container,
  EdgeInsets,
  BoxDecoration,
  type Widget,
} from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastStackedBarChartConfig } from "../config";

export function toastBar(
  { legend, index }: { value: number; label: string; legend: string; index: number },
  context: BarChartContext<ToastStackedBarChartConfig>,
): Widget {
  const { colors } = context.config;
  const idx = context.legends.indexOf(legend);

  return Container({
    margin: EdgeInsets.symmetric({ horizontal: 1 }),
    decoration: new BoxDecoration({
      color: colors[idx % colors.length],
    }),
  });
}
