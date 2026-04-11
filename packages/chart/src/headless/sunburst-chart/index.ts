import type { Widget } from "flitter-core";
import type {
	SunburstChartCustom,
	SunburstChartData,
	SunburstLegacyData,
} from "./types";
import { SunburstChartProvider } from "./provider";

export default function SunburstChart<TConfig extends object = object>(props: {
	custom: SunburstChartCustom<TConfig>;
	data: SunburstChartData | SunburstLegacyData;
	config?: TConfig;
}): Widget {
	return SunburstChartProvider(props);
}
