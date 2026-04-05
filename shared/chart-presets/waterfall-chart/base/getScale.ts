import type { GetScaleFn } from "../types";
import { refineScale } from "flitter-ui/chart";

export const getScale: GetScaleFn = (
  items,
  { roughStepCount = 10 } = {},
) => {
  if (items.length === 0) {
    return { min: 0, max: 0, step: 1 };
  }

  let min = Infinity;
  let max = -Infinity;

  for (const item of items) {
    min = Math.min(min, item.start, item.end);
    max = Math.max(max, item.start, item.end);
  }

  const roughMin = min > 0 ? 0 : min;
  const roughMax = max < 0 ? 0 : max;

  return refineScale({
    min: roughMin,
    max: roughMax,
    step: (roughMax - roughMin || 1) / roughStepCount,
  });
};
