import type { BoxPlotChartData, BoxPlotChartScale } from "../types";

export function getScale({
  datasets,
}: Omit<BoxPlotChartData, "labels">): BoxPlotChartScale {
  let min = Infinity;
  let max = -Infinity;

  for (const dataset of datasets) {
    for (const point of dataset.data) {
      min = Math.min(min, point.min);
      max = Math.max(max, point.max);
      if (point.outliers) {
        for (const outlier of point.outliers) {
          min = Math.min(min, outlier);
          max = Math.max(max, outlier);
        }
      }
    }
  }

  const roughMin = min > 0 ? 0 : min;
  const roughMax = max < 0 ? 0 : max;
  const roughStep = (roughMax - roughMin) / 10;

  return refineScale({ min: roughMin, max: roughMax, step: roughStep });
}

const SNAP_VALUES = [1, 2, 5, 10];

function getDigits(num: number): number {
  const logNumberDividedLN10 =
    num === 0 ? 1 : Math.log(Math.abs(num)) / Math.LN10;
  return 10 ** Math.floor(logNumberDividedLN10);
}

function getSnappedNumber(num: number): number {
  let snapNumber = 0;
  for (let i = 0, t = SNAP_VALUES.length; i < t; i += 1) {
    snapNumber = SNAP_VALUES[i];
    const guideValue = (snapNumber + (SNAP_VALUES[i + 1] || snapNumber)) / 2;
    if (num <= guideValue) {
      break;
    }
  }
  return snapNumber;
}

function getNormalizedStep(stepSize: number) {
  const placeNumber = getDigits(stepSize);
  const simplifiedStepValue = stepSize / placeNumber;
  return getSnappedNumber(simplifiedStepValue) * placeNumber;
}

function getNormalizedLimit(limit: { min: number; max: number }, stepSize: number) {
  let { min, max } = limit;
  const minNumber = Math.min(getDigits(max), getDigits(stepSize));
  const placeNumber = minNumber > 1 ? 1 : 1 / minNumber;
  const fixedStep = stepSize * placeNumber;

  max = (Math.ceil((max * placeNumber) / fixedStep) * fixedStep) / placeNumber;

  if (min > stepSize) {
    min = (Math.floor((min * placeNumber) / fixedStep) * fixedStep) / placeNumber;
  } else if (min < 0) {
    min = -(Math.ceil((Math.abs(min) * placeNumber) / fixedStep) * fixedStep) / placeNumber;
  } else {
    min = 0;
  }

  return { min, max };
}

function refineScale(roughScale: { min: number; max: number; step: number }): BoxPlotChartScale {
  const step = getNormalizedStep(roughScale.step);
  const edge = getNormalizedLimit({ min: roughScale.min, max: roughScale.max }, step);
  return {
    min: edge.min,
    max: edge.max,
    step,
  };
}
