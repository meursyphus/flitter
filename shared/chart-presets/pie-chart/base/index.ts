import { SizedBox, type Widget } from "flitter-ui";
import { PieChart as HeadlessPieChart } from "flitter-ui/chart";
import type { PieChartCustom, PieChartData } from "flitter-ui/chart";
import { DataView, Layout, Plot } from "../../_shared/ag/pie-like/index";

export type { PieChartCustom, PieChartData, PieChartContext } from "flitter-ui/chart";
export { PieChartController } from "flitter-ui/chart";

const baseDefaults: Partial<PieChartCustom> = {
	layout: Layout,
	plot: Plot,
	dataView: ({ segments }) => DataView({ items: segments }),
	radialLabel: () => SizedBox.shrink(),
	radialTick: () => SizedBox.shrink(),
	dataLabel: () => SizedBox.shrink(),
	tooltip: () => SizedBox.shrink(),
	tooltipArea: () => SizedBox.shrink(),
};

export function BasePieChart<TConfig = {}>({
	custom,
	...rest
}: {
	custom: Partial<PieChartCustom<TConfig>>;
	data: PieChartData;
	config?: TConfig;
}): Widget {
	return HeadlessPieChart({
		...rest,
		custom: { ...baseDefaults, ...custom } as PieChartCustom<TConfig>,
	});
}
