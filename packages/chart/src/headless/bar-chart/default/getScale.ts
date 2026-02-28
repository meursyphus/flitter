import type { BarChartData, BarChartScale } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function getScale(
  { datasets }: Omit<BarChartData, "labels">,
  options?: { roughStepCount?: number },
): BarChartScale {
  return Cartesian.getScale({ datasets }, options);
}
