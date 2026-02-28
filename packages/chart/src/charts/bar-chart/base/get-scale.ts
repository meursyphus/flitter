import type { BarChartData, BarChartScale } from "@headless/bar-chart/types";
import * as Cartesian from "@shared/cartesian/index";

export function getScale(
  { datasets }: Omit<BarChartData, "labels">,
  options?: { roughStepCount?: number },
): BarChartScale {
  return Cartesian.getScale({ datasets }, options);
}
