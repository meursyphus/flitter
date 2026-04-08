import { Layout as PieLikeLayout } from "../../../shared/pie-like";
import type { SunburstCustom } from "../types";

export function Layout(
	...[args, context]: Parameters<SunburstCustom["layout"]>
) {
	return PieLikeLayout(args, context as any);
}
