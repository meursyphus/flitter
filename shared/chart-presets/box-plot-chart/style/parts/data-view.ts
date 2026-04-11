import { type Widget } from "flitter-ui";
import type { BoxPlotChartCustom } from "flitter-ui/chart";
import type { AgBoxPlotChartConfig } from "../config";
import { DataView } from "../../base/data-view";

export function agDataView(
	...[args, context]: Parameters<BoxPlotChartCustom<AgBoxPlotChartConfig>["dataView"]>
): Widget {
	return DataView(args, context);
}
