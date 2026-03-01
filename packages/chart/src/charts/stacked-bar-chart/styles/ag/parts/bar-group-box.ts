import { GestureDetector, type Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { AgStackedBarChartConfig } from "../config";

export function agBarGroupBox(
  { child, index, label }: { child: Widget; index: number; label: string },
  context: BarChartContext<AgStackedBarChartConfig>,
) {
  return GestureDetector({
    cursor: "default",
    onMouseLeave: () => context.unhoverBar(),
    child,
  });
}
