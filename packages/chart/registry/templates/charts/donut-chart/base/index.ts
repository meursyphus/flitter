import { SizedBox, type Widget } from "flitter-core";
import HeadlessDonutChart from "@headless/donut-chart";
import type { DonutChartCustom, DonutChartData } from "@headless/donut-chart/types";
import { DataView, Layout, Plot } from "../../../shared/pie-like";

export type {
	DonutChartCustom,
	DonutChartData,
	DonutChartContext,
	HoveredDonutChartSegment,
} from "@headless/donut-chart/types";
export { DonutChartController } from "@headless/donut-chart/controller";

const baseDefaults: Partial<DonutChartCustom> = {
	layout: Layout,
	plot: Plot,
	dataView: ({ segments, dataCenter }) => DataView({ items: segments, overlay: dataCenter }),
	radialLabel: () => SizedBox.shrink(),
	radialTick: () => SizedBox.shrink(),
	dataLabel: () => SizedBox.shrink(),
	dataCenter: () => SizedBox.shrink(),
	tooltip: () => SizedBox.shrink(),
	tooltipArea: () => SizedBox.shrink(),
};

export function BaseDonutChart<TConfig extends object = object>({
	custom,
	...rest
}: {
	custom: Partial<DonutChartCustom<TConfig>>;
	data: DonutChartData;
	config?: TConfig;
}): Widget {
	return HeadlessDonutChart({
		...rest,
		custom: { ...baseDefaults, ...custom } as DonutChartCustom<TConfig>,
	});
}
