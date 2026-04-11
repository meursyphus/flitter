import { SizedBox, type Widget } from "flitter-ui";
import { SunburstChart as HeadlessSunburstChart } from "flitter-ui/chart";
import type {
	SunburstChartCustom,
	SunburstChartData,
	SunburstLegacyData,
} from "flitter-ui/chart";
import { DataView as PieLikeDataView } from "../../_shared/toast/pie-like/index";
import { Layout } from "./layout";
import { Plot } from "./plot";

export type {
	SunburstChartContext,
	SunburstChartNode,
	SunburstChartData,
	SunburstLegacyData,
	SunburstResolvedNode,
	SunburstResolvedData,
	SunburstChartCustom,
	SunburstChartSegment,
	SunburstChartSegmentArgs,
	HoveredSunburstSegment,
	FlatSegment,
	SunburstNode,
	SunburstCustom,
} from "flitter-ui/chart";
export { SunburstChartController } from "flitter-ui/chart";

const baseDefaults: Partial<SunburstChartCustom> = {
	layout: Layout,
	plot: Plot,
	dataView: ({ segments }) => PieLikeDataView({ items: segments }),
	title: () => SizedBox.shrink(),
	legend: () => SizedBox.shrink(),
	dataLabel: () => SizedBox.shrink(),
	tooltip: () => SizedBox.shrink(),
	tooltipArea: () => SizedBox.shrink(),
};

export function BaseSunburstChart<TConfig = {}>({
	custom,
	...rest
}: {
	custom: Partial<SunburstChartCustom<TConfig>>;
	data: SunburstChartData | SunburstLegacyData;
	config?: TConfig;
}): Widget {
	return HeadlessSunburstChart({
		...rest,
		custom: { ...baseDefaults, ...custom } as SunburstChartCustom<TConfig>,
	});
}
