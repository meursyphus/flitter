import type { Widget } from "flitter-core";
import HeadlessScatterChart from "@headless/scatter-chart";
import type {
  ScatterChartCustom,
  ScatterChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "@headless/scatter-chart/types";
import * as Cartesian from "@shared/cartesian/index";
import { getValueEdge, refineScale } from "@shared/utils/scale";
import { Series } from "./series";
import { Grid } from "./grid";

export type { ScatterChartCustom, ScatterChartData, ScatterChartScale, ScatterChartContext, ScatterChartScaleOptions, GetScaleFn, GetScaleOptionsFn } from "@headless/scatter-chart/types";
export { ScatterChartController } from "@headless/scatter-chart/controller";

/** Structural (non-visual) defaults provided by base */
const baseDefaults: Partial<ScatterChartCustom> = {
  series: Series,
  plot: (...args) => Cartesian.Plot(args[0]),
  dataLabel: (...args) => Cartesian.DataLabel(args[0]),
  grid: Grid,
};

const defaultGetScale: GetScaleFn = ({ datasets }, options) => {
  const xValues: number[] = [];
  const yValues: number[] = [];

  const roughStepCount = options?.roughStepCount ?? 10;

  datasets.forEach((d) => {
    d.data.forEach((p) => {
      xValues.push(p.x);
      yValues.push(p.y);
    });
  });

  const xEdge = getValueEdge(xValues);
  const yEdge = getValueEdge(yValues);

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

  return { x: xScale, y: yScale };
};

export function BaseScatterChart<TConfig = {}>({
  custom,
  getScale = defaultGetScale,
  ...rest
}: {
  custom: Partial<ScatterChartCustom<TConfig>>;
  title?: string;
  data: ScatterChartData;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  return HeadlessScatterChart({
    ...rest,
    getScale,
    custom: { ...baseDefaults, ...custom } as ScatterChartCustom<TConfig>,
  });
}
