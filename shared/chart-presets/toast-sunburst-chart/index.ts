import type { Widget } from "flitter-core";
import { BaseSunburstChart } from "./base";
import type {
	SunburstChartCustom,
	SunburstChartData,
	SunburstLegacyData,
} from "./base";
import { styleConfig, type SunburstChartConfig } from "./style";
import type { DeepPartial } from "flitter-ui/chart";

export type {
	SunburstChartContext,
	SunburstChartNode,
	SunburstChartData,
	SunburstLegacyData,
	SunburstResolvedNode,
	SunburstResolvedData,
	SunburstChartCustom,
	SunburstChartSegmentArgs,
	SunburstChartSegment,
	HoveredSunburstSegment,
	FlatSegment,
	SunburstNode,
	SunburstCustom,
} from "./base";
export { SunburstChartController } from "./base";
export { type SunburstChartConfig } from "./style";

export default function SunburstChart({
	data,
	config,
	custom,
}: {
	custom?: Partial<SunburstChartCustom<SunburstChartConfig>>;
	data: SunburstChartData | SunburstLegacyData;
	config?: DeepPartial<SunburstChartConfig>;
}): Widget {
	return BaseSunburstChart({
		data,
		config: styleConfig.createConfig(config),
		custom: { ...styleConfig.custom, ...custom } as SunburstChartCustom<SunburstChartConfig>,
	});
}
