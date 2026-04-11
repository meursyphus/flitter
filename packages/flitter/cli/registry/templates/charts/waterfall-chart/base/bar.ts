import type { WaterfallBarType, WaterfallChartCustom } from "../types";
import {
	BoxDecoration,
	Border,
	BoxShadow,
	Container,
	SizedBox,
} from "flitter-core";

const COLORS: Record<WaterfallBarType, string> = {
	increase: "#4CAF50",
	decrease: "#F44336",
	total: "#2196F3",
	subtotal: "#2196F3",
};

export function Bar(
	...[{ item, isHovered }]: Parameters<WaterfallChartCustom["bar"]>
) {
	return SizedBox.expand({
		child: Container({
			width: Infinity,
			height: Infinity,
			decoration: new BoxDecoration({
				color: COLORS[item.type],
				border:
					isHovered
						? Border.all({ color: "white", width: 3, strokeAlign: 1 })
						: undefined,
				boxShadow: isHovered
					? [new BoxShadow({ color: "rgba(0,0,0,0.18)", blurRadius: 12 })]
					: undefined,
			}),
		}),
	});
}
