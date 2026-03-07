import type { Widget } from "flitter-core";
import type { NetworkChartCustom, NetworkChartData } from "./types";
import { NetworkChartProvider } from "./provider";

export default function NetworkChart<TConfig = {}>(props: {
	custom: NetworkChartCustom<TConfig>;
	data: NetworkChartData;
	config?: TConfig;
}): Widget {
	return NetworkChartProvider(props as any);
}
