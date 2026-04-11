import { SizedBox, type Widget } from "flitter-core";
import HeadlessPieChart from "@headless/pie-chart";
import type { PieChartCustom, PieChartData } from "@headless/pie-chart/types";
import { DataView, Layout, Plot } from "../../../shared/pie-like";

export type { PieChartCustom, PieChartData, PieChartContext } from "@headless/pie-chart/types";
export { PieChartController } from "@headless/pie-chart/controller";

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
