import { type Widget } from "flitter-core";
import type { BoxPlotChartCustom } from "@headless/box-plot-chart/types";
import type { AgBoxPlotChartConfig } from "../config";
import { DataView } from "../../../base/data-view";

export function agDataView(
	...[args, context]: Parameters<BoxPlotChartCustom<AgBoxPlotChartConfig>["dataView"]>
): Widget {
	return DataView(args, context);
}
