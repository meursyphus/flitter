import type { AreaChartData, AreaChartScale } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function getScale({
  datasets,
}: Omit<AreaChartData, "labels">): AreaChartScale {
  return Cartesian.getScale({
    datasets,
  });
}
