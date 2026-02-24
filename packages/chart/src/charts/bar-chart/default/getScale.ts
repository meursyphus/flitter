import type { BarChartData, BarChartScale } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function getScale({
  datasets,
}: Omit<BarChartData, "labels">): BarChartScale {
  return Cartesian.getScale({
    datasets,
  });
}
