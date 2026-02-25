import { Container, EdgeInsets, BoxDecoration } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

export function toastBar(
  { legend }: { value: number; label: string; legend: string; index: number },
  context: BarChartContext<ToastBarChartConfig>
) {
  const { colors } = context.config;
  const idx = context.data.datasets.findIndex((d) => d.legend === legend);
  return Container({
    margin: EdgeInsets.symmetric({ horizontal: 1 }),
    decoration: new BoxDecoration({
      color: colors[idx % colors.length],
    }),
  });
}
