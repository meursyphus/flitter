import type { Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { AgBarChartConfig } from "../config";

export function agBarGroupBox(
  { child, index, label }: { child: Widget; index: number; label: string },
  context: BarChartContext<AgBarChartConfig>,
) {
  return child;
}
