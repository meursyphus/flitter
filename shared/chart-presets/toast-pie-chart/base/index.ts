import { SizedBox, type Widget } from "flitter-core";
import { PieChart as HeadlessPieChart } from "flitter-ui/chart";
import type { PieChartCustom, PieChartData } from "flitter-ui/chart";
import { DataView } from "./data-view";
import { Layout } from "./layout";

export type { PieChartCustom, PieChartData, PieChartContext } from "flitter-ui/chart";
export { PieChartController } from "flitter-ui/chart";

const baseDefaults: Partial<PieChartCustom> = {
	layout: Layout,
	dataView: DataView,
	dataLabel: () => SizedBox.shrink(),
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
