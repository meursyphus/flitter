import type { RadarChartData, RadarChartScale } from "../types";

export function getScale(data: RadarChartData): RadarChartScale {
  const allValues = data.datasets.flatMap((ds) => ds.values);
  const max = Math.max(...allValues);
  const min = 0;

  const range = max - min;
  const rawStep = range / 5;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalized = rawStep / magnitude;

  let step: number;
  if (normalized <= 1) step = magnitude;
  else if (normalized <= 2) step = 2 * magnitude;
  else if (normalized <= 5) step = 5 * magnitude;
  else step = 10 * magnitude;

  const adjustedMax = Math.ceil(max / step) * step;

  return {
    min,
    max: adjustedMax,
    step,
  };
}
