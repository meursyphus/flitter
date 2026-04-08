import type { Widget } from "flitter-core";
import type { FunnelChartCustom } from "../types";
import { DataView } from "./data-view";

export function Funnel(
	...[{ stages }, ctx]: Parameters<FunnelChartCustom["funnel"]>
): Widget {
	return DataView({ stages }, ctx);
}
