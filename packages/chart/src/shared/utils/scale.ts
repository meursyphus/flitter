const SNAP_VALUES = [1, 2, 5, 10];

export type ValueEdge = {
  min: number;
  max: number;
};

export type Scale = {
  min: number;
  max: number;
  step: number;
};

export function getValueEdge(values: number[]) {
  let min: number = Infinity;
  let max: number = -Infinity;
  values.forEach((value) => {
    min = Math.min(value, min);
    max = Math.max(value, max);
  });

  return {
    min,
    max,
  };
}

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

function getNormalizedLimit(limit: ValueEdge, stepSize: number): ValueEdge {
  let { min, max } = limit;
  const minNumber = Math.min(getDigits(max), getDigits(stepSize));
  const placeNumber = minNumber > 1 ? 1 : 1 / minNumber;
  const fixedStep = stepSize * placeNumber;

  max = (Math.ceil((max * placeNumber) / fixedStep) * fixedStep) / placeNumber;

  if (min > stepSize) {
    min =
      (Math.floor((min * placeNumber) / fixedStep) * fixedStep) / placeNumber;
  } else if (min < 0) {
    min =
      -(Math.ceil((Math.abs(min) * placeNumber) / fixedStep) * fixedStep) /
      placeNumber;
  } else {
    min = 0;
  }

  return { min, max };
}

export function refineScale(roughScale: Scale): Scale {
  const step = getNormalizedStep(roughScale.step);
  const edge = getNormalizedLimit(
    { min: roughScale.min, max: roughScale.max },
    step
  );

  return {
    max: edge.max,
    min: edge.min,
    step,
  };
}
