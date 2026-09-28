import { Layout as PieLikeLayout } from "../../../shared/pie-like";
import type { PieLikeLayoutConfig } from "../../../shared/pie-like/layout";
import type { SunburstCustom } from "../types";

export function Layout<TConfig extends PieLikeLayoutConfig>(
	...[args, context]: Parameters<SunburstCustom<TConfig>["layout"]>
) {
	return PieLikeLayout(args, context);
}
