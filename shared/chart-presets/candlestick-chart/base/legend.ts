import type { CandlestickChartCustom } from "../types";
import { SizedBox } from "flitter-core";

export function Legend(..._: Parameters<CandlestickChartCustom["legend"]>) {
	return SizedBox.shrink();
}
