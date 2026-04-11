import { SizedBox, type Widget } from "flitter-core";
import HeadlessSunburstChart from "@headless/sunburst-chart";
import type {
	SunburstChartCustom,
	SunburstChartData,
	SunburstLegacyData,
} from "@headless/sunburst-chart/types";
import { DataView as PieLikeDataView } from "../../../shared/pie-like";
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
} from "@headless/sunburst-chart/types";
export { SunburstChartController } from "@headless/sunburst-chart/controller";

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

export function BaseSunburstChart<TConfig extends object = object>({
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
