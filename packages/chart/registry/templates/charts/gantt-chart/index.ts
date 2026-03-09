import type { Widget } from "flitter-core";
import { GanttChart as HeadlessGanttChart } from "flitter-ui/chart";
import type { GanttChartCustom, GanttChartData } from "./types";
import { styleConfig, type GanttChartConfig } from "./style";
import type { DeepPartial } from "@utils/index";

export type {
  GanttChartContext,
  GanttTask,
  GanttChartData,
  GanttChartScale,
  GanttChartCustom,
} from "./types";
export { GanttChartController } from "./types";
export { type GanttChartConfig } from "./style";

export default function GanttChart({
  data,
  config,
  custom,
}: {
  custom?: Partial<GanttChartCustom<GanttChartConfig>>;
  data: GanttChartData;
  config?: DeepPartial<GanttChartConfig>;
}): Widget {
  return HeadlessGanttChart({
    data,
    config: styleConfig.createConfig(config),
    custom: { ...styleConfig.custom, ...custom } as GanttChartCustom<GanttChartConfig>,
  });
}
