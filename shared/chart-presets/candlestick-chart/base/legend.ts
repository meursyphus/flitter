import type { CandlestickChartCustom } from "../types";
import { SizedBox } from "flitter-ui";

export function Legend(..._: Parameters<CandlestickChartCustom["legend"]>) {
	return SizedBox.shrink();
}
