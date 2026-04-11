import { Layout as PieLikeLayout } from "../../_shared/toast/pie-like/index";
import type { PieLikeLayoutConfig } from "../../_shared/toast/pie-like/layout";
import type { SunburstCustom } from "../types";

export function Layout<TConfig extends PieLikeLayoutConfig>(
	...[args, context]: Parameters<SunburstCustom<TConfig>["layout"]>
) {
	return PieLikeLayout(args, context);
}
