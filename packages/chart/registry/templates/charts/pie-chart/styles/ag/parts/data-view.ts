import type { Widget } from "flitter-core";
import type { PieChartCustom } from "@headless/pie-chart/types";
import type { AgPieChartConfig } from "../config";
import { DataView } from "../../../base/data-view";

export function agDataView(
	...[args, context]: Parameters<PieChartCustom<AgPieChartConfig>["dataView"]>
): Widget {
	return DataView(args, context);
}
