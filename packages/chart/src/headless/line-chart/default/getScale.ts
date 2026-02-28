import type { LineChartData, LineChartScale, LineChartScaleOptions } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function getScale(
  { datasets }: LineChartData,
  options?: LineChartScaleOptions,
): LineChartScale {
  return Cartesian.getScale(
    { datasets },
    { roughStepCount: options?.roughStepCount },
  );
}
