import { Layout as PieLikeLayout } from "../../_styles/toast/pie-like/index";
import type { SunburstCustom } from "../types";

export function Layout(
	...[args, context]: Parameters<SunburstCustom["layout"]>
) {
	return PieLikeLayout(args, context as any);
}
