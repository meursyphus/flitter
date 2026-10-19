import { SizedBox, type Widget } from "flitterjs";
import { DonutChart as HeadlessDonutChart } from "@flitterjs/chart";
import type { DonutChartCustom, DonutChartData } from "@flitterjs/chart";
import { DataView, Layout, Plot } from "../../_shared/toast/pie-like/index";

export type {
	DonutChartCustom,
	DonutChartData,
	DonutChartContext,
	HoveredDonutChartSegment,
} from "@flitterjs/chart";
export { DonutChartController } from "@flitterjs/chart";

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
