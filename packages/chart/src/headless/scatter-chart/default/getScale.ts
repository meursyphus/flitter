import type { ScatterChartData, ScatterChartScale } from "../types";
import { getValueEdge, refineScale } from "@shared/utils/scale";

export function getScale({ datasets }: ScatterChartData): ScatterChartScale {
  const xValues: number[] = [];
  const yValues: number[] = [];

  datasets.forEach((d) => {
    d.data.forEach((p) => {
      xValues.push(p.x);
      yValues.push(p.y);
    });
  });

  const xEdge = getValueEdge(xValues);
  const yEdge = getValueEdge(yValues);

  const roughStepCount = 10;

  const xScale = refineScale({
    min: xEdge.min,
    max: xEdge.max,
    step: (xEdge.max - xEdge.min) / roughStepCount,
  });

  const yScale = refineScale({
    min: yEdge.min,
    max: yEdge.max,
    step: (yEdge.max - yEdge.min) / roughStepCount,
  });


  return {
    x: xScale,
    y: yScale,
  };
}
