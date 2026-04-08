import type { Widget } from "flitter-core";
import { BaseFunnelChart } from "./base";
import type {
	FunnelChartCustom,
	FunnelChartData,
	FunnelChartDirection,
} from "./base";
import { styleConfig, type FunnelChartConfig } from "./style";
import type { DeepPartial } from "@utils/index";

export type {
	FunnelChartContext,
	FunnelChartStage,
	FunnelChartStageView,
	FunnelChartHoveredStage,
	FunnelChartHoveredStageRect,
	FunnelChartData,
	FunnelChartCustom,
	FunnelChartDirection,
} from "./base";
export { FunnelChartController } from "./base";
export { type FunnelChartConfig } from "./style";

export default function FunnelChart({
	data,
	config,
	custom,
	direction,
}: {
	custom?: Partial<FunnelChartCustom<FunnelChartConfig>>;
	data: FunnelChartData;
	config?: DeepPartial<FunnelChartConfig>;
	direction?: FunnelChartDirection;
}): Widget {
	const resolvedDirection = direction ?? styleConfig.defaultDirection;
	return BaseFunnelChart({
		data,
		direction: resolvedDirection,
		config: styleConfig.createConfig(config),
		custom: {
			...styleConfig.custom,
			...custom,
		} as FunnelChartCustom<FunnelChartConfig>,
	});
}
