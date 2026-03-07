import type { Widget } from "flitter-core";
import type { GanttChartCustom, GanttChartData } from "./types";
import { GanttChartProvider } from "./provider";

export default function GanttChart<TConfig = {}>(props: {
	custom: GanttChartCustom<TConfig>;
	data: GanttChartData;
	config?: TConfig;
}): Widget {
	return GanttChartProvider(props as any);
}
