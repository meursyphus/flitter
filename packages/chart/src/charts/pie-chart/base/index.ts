import type { Widget } from "flitter-core";
import HeadlessPieChart from "@headless/pie-chart";
import type { PieChartCustom, PieChartData } from "@headless/pie-chart/types";
import { Series } from "./series";
import { Layout } from "./layout";

export type { PieChartCustom, PieChartData, PieChartContext } from "@headless/pie-chart/types";
export { PieChartController } from "@headless/pie-chart/controller";

const baseDefaults: Partial<PieChartCustom> = {
	layout: Layout,
	series: Series,
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
