import type { Widget } from "flitter-core";
import { SizedBox } from "flitter-core";
import HeadlessHeatmapChart from "@headless/heatmap-chart";
import type {
  HeatmapCustom,
  HeatmapData,
  HeatmapScale,
} from "@headless/heatmap-chart/types";
import * as Cartesian from "@shared/cartesian/index";
import { Heatmap } from "./heatmap";

export type { HeatmapCustom, HeatmapData, HeatmapScale, HeatmapContext } from "@headless/heatmap-chart/types";

/** Structural (non-visual) defaults provided by base */
const baseDefaults: Partial<HeatmapCustom> = {
  heatmap: Heatmap,
  plot: (...args) =>
    Cartesian.Plot({
      xAxis: args[0].xAxis,
      yAxis: args[0].yAxis,
      series: args[0].heatmap,
      grid: SizedBox.shrink(),
      axisCorner: args[0].axisCorner,
    }),
};

const defaultGetScale = (data: HeatmapData): HeatmapScale => {
  const flat = data.values.flat();
  return {
    min: Math.min(...flat),
    max: Math.max(...flat),
  };
};

export function BaseHeatmapChart<TConfig = {}>({
  custom,
  getScale = defaultGetScale,
  ...rest
}: {
  custom: Partial<HeatmapCustom<TConfig>>;
  data: HeatmapData;
  getScale?: (data: HeatmapData) => HeatmapScale;
  config?: TConfig;
}): Widget {
  return HeadlessHeatmapChart({
    ...rest,
    getScale,
    custom: { ...baseDefaults, ...custom } as HeatmapCustom<TConfig>,
  });
}
