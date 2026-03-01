import {
  Container,
  EdgeInsets,
  BoxDecoration,
  type Widget,
} from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { AgBarChartConfig } from "../config";

export function agBar(
  { legend }: { value: number; label: string; legend: string; index: number },
  context: BarChartContext<AgBarChartConfig>,
): Widget {
  const { colors, bar } = context.config;
  const idx = context.legends.indexOf(legend);
  const color = colors.fills[idx % colors.fills.length];

  return Container({
    margin: EdgeInsets.symmetric({ horizontal: bar.gap }),
    decoration: new BoxDecoration({ color }),
  });
}
