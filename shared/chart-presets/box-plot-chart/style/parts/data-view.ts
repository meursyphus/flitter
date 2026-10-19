import { type Widget } from "flitterjs";
import type { BoxPlotChartCustom } from "@flitterjs/chart";
import type { AgBoxPlotChartConfig } from "../config";
import { DataView } from "../../base/data-view";

export function agDataView(
	...[args, context]: Parameters<BoxPlotChartCustom<AgBoxPlotChartConfig>["dataView"]>
): Widget {
	return DataView(args, context);
}
