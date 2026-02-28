import type { BubbleChartData, BubbleChartScale, BubbleChartScaleOptions } from "../types";
import { getValueEdge, refineScale } from "@shared/utils/scale";

export function getScale(
  { datasets }: BubbleChartData,
  options?: BubbleChartScaleOptions,
): BubbleChartScale {
  const xValues: number[] = [];
  const yValues: number[] = [];
  const values: number[] = [];

  const roughStepCount = options?.roughStepCount ?? 10;

  datasets.forEach((d) => {
    d.data.forEach((p) => {
      xValues.push(p.x);
      yValues.push(p.y);
      values.push(p.value);
    });
  });

  const xEdge = getValueEdge(xValues);
  const yEdge = getValueEdge(yValues);
  const valueEdge = getValueEdge(values);

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

  const valueScale = refineScale({
    min: valueEdge.min,
    max: valueEdge.max,
    step: (valueEdge.max - valueEdge.min) / roughStepCount,
  });

  return {
    x: xScale,
    y: yScale,
    value: valueScale,
  };
}
