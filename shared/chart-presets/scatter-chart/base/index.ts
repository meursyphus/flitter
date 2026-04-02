import { SizedBox, type Widget } from "flitter-core";
import { ScatterChart as HeadlessScatterChart } from "flitter-ui/chart";
import type {
  ScatterChartCustom,
  ScatterChartData,
  ScatterChartGetScaleFn as GetScaleFn,
  ScatterChartGetScaleOptionsFn as GetScaleOptionsFn,
} from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";
import { getValueEdge, refineScale } from "flitter-ui/chart";
import { Grid as PointLikeGrid } from "../../_styles/ag/point-like/index";
import { DataView } from "./data-view";

export type { ScatterChartCustom, ScatterChartData, ScatterChartScale, ScatterChartContext, ScatterChartScaleOptions, ScatterChartGetScaleFn as GetScaleFn, ScatterChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
export { ScatterChartController } from "flitter-ui/chart";

/** Structural (non-visual) defaults provided by base */
const baseDefaults: Partial<ScatterChartCustom> = {
  dataView: DataView,
  plot: (...args) => Cartesian.Plot(args[0]),
  dataLabel: (...args) => Cartesian.DataLabel(args[0]),
  grid: (...[{ xLine, yLine }, ctx]) =>
    PointLikeGrid({ xLine, yLine, scale: ctx.scale }),
  tooltip: () => SizedBox.shrink(),
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
