import { SizedBox, type Widget } from "flitterjs";
import { PieChart as HeadlessPieChart } from "@flitterjs/chart";
import type { PieChartCustom, PieChartData } from "@flitterjs/chart";
import { DataView, Layout, Plot } from "../../_shared/toast/pie-like/index";

export type { PieChartCustom, PieChartData, PieChartContext } from "@flitterjs/chart";
export { PieChartController } from "@flitterjs/chart";

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

export function BasePieChart<TConfig extends object = object>({
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
