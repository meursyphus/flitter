import { Stack, StackFit, type Widget } from "flitterjs";
import type { SunburstCustom } from "../types";

export function Plot(
	...[{ dataView, tooltipArea }]: Parameters<SunburstCustom["plot"]>
): Widget {
	return Stack({
		fit: StackFit.expand,
		clipped: false,
		children: [dataView, tooltipArea],
	});
}
