import { Stack, StackFit, type Widget } from "flitter-ui";
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
