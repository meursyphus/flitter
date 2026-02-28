import type { Widget } from "flitter-core";
import HeadlessBubbleChart from "@headless/bubble-chart";
import type {
  BubbleChartCustom,
  BubbleChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "@headless/bubble-chart/types";
import * as Cartesian from "@shared/cartesian/index";
import { getValueEdge, refineScale } from "@shared/utils/scale";
import { Series } from "./series";
import { Grid } from "./grid";

export type { BubbleChartCustom, BubbleChartData, BubbleChartScale, BubbleChartContext, BubbleChartScaleOptions, GetScaleFn, GetScaleOptionsFn } from "@headless/bubble-chart/types";
export { BubbleChartController } from "@headless/bubble-chart/controller";

/** Structural (non-visual) defaults provided by base */
const baseDefaults: Partial<BubbleChartCustom> = {
  series: Series,
  plot: (...args) => Cartesian.Plot(args[0]),
  dataLabel: (...args) => Cartesian.DataLabel(args[0]),
  grid: Grid,
};

const defaultGetScale: GetScaleFn = ({ datasets }, options) => {
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

  return { x: xScale, y: yScale, value: valueScale };
};

export function BaseBubbleChart<TConfig = {}>({
  custom,
  getScale = defaultGetScale,
  ...rest
}: {
  custom: Partial<BubbleChartCustom<TConfig>>;
  title?: string;
  data: BubbleChartData;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  return HeadlessBubbleChart({
    ...rest,
    getScale,
    custom: { ...baseDefaults, ...custom } as BubbleChartCustom<TConfig>,
  });
}
