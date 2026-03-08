import type { Widget } from "flitter-core";
import HeadlessPieChart from "../../_flitter/headless/pie-chart";
import type { PieChartCustom, PieChartData } from "../../_flitter/headless/pie-chart";
import { DataView } from "./data-view";
import { Layout } from "./layout";

export type { PieChartCustom, PieChartData, PieChartContext } from "../../_flitter/headless/pie-chart";
export { PieChartController } from "../../_flitter/headless/pie-chart";

const baseDefaults: Partial<PieChartCustom> = {
	layout: Layout,
	dataView: DataView,
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
