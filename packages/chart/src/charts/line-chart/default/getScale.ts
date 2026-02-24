import type { LineChartData, LineChartScale } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function getScale({
  datasets,
}: Omit<LineChartData, "labels">): LineChartScale {
  return Cartesian.getScale({
    datasets,
  });
}
