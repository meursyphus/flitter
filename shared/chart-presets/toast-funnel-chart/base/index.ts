import { SizedBox, type Widget } from "flitter-core";
import { FunnelChart as HeadlessFunnelChart } from "flitter-ui/chart";
import type {
	FunnelChartCustom,
	FunnelChartData,
	FunnelChartDirection,
} from "flitter-ui/chart";
import { Layout } from "./layout";
import { Plot } from "./plot";
import { DataView } from "./data-view";
import { Stage } from "./stage";
import { Segment } from "./segment";
import { Connector } from "./connector";
import { Title } from "./title";
import { Legend } from "./legend";
import { StageLabel } from "./stageLabel";
import { DataLabel } from "./dataLabel";

export type {
	FunnelChartContext,
	FunnelChartStage,
	FunnelChartStageView,
	FunnelChartHoveredStage,
	FunnelChartHoveredStageRect,
	FunnelChartData,
	FunnelChartCustom,
	FunnelChartDirection,
} from "flitter-ui/chart";
export { FunnelChartController } from "flitter-ui/chart";

export * from "./layout";
export * from "./plot";
export * from "./data-view";
export * from "./funnel";
export * from "./stage";
export * from "./segment";
export * from "./connector";
export * from "./stageLabel";
export * from "./dataLabel";
export * from "./legend";
export * from "./title";

const baseDefaults: Partial<FunnelChartCustom> = {
	layout: Layout,
	plot: Plot,
	funnel: DataView,
	dataView: DataView,
	stage: Stage,
	segment: Segment,
	connector: Connector,
	stageLabel: StageLabel,
	dataLabel: DataLabel,
	legend: Legend,
	title: Title,
	tooltip: () => SizedBox.shrink(),
	tooltipArea: () => SizedBox.shrink(),
};

export function BaseFunnelChart<TConfig = {}>({
	custom,
	direction = "vertical",
	...rest
}: {
	custom: Partial<FunnelChartCustom<TConfig>>;
	data: FunnelChartData;
	direction?: FunnelChartDirection;
	config?: TConfig;
}): Widget {
	return HeadlessFunnelChart({
		...rest,
		direction,
		custom: { ...baseDefaults, ...custom } as FunnelChartCustom<TConfig>,
	});
}
