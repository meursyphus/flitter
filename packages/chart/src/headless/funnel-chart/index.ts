import type { Widget } from "flitter-core";
import type { FunnelChartCustom, FunnelChartData } from "./types";
import { FunnelChartProvider } from "./provider";

export default function FunnelChart<TConfig = {}>(props: {
	custom: FunnelChartCustom<TConfig>;
	data: FunnelChartData;
	config?: TConfig;
}): Widget {
	return FunnelChartProvider(props as any);
}
