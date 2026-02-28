import { Container, EdgeInsets, BoxDecoration, type Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

export function toastBar(
  { legend }: { value: number; label: string; legend: string; index: number },
  context: BarChartContext<ToastBarChartConfig>
): Widget {
  const { colors, bar } = context.config;
  const idx = context.legends.indexOf(legend);
  return Container({
    margin: EdgeInsets.symmetric({ horizontal: bar.gap }),
    decoration: new BoxDecoration({
      color: colors[idx % colors.length],
    }),
  });
}
