import type { Widget } from "flitterjs";
import type {
	BoxPlotChartCustom,
	BoxPlotChartData,
	BoxPlotChartDirection,
	GetScaleFn,
	GetScaleOptionsFn,
} from "./types";
import { BoxPlotChartProvider } from "./provider";

export default function BoxPlotChart<TConfig extends object = object>(props: {
	custom: BoxPlotChartCustom<TConfig>;
	data: BoxPlotChartData;
	direction?: BoxPlotChartDirection;
	getScale: GetScaleFn;
	getScaleOptions?: GetScaleOptionsFn;
	config?: TConfig;
}): Widget {
	return BoxPlotChartProvider(props);
}
