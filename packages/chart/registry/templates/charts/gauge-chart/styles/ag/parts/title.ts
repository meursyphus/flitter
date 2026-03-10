import { SizedBox, type Widget } from "flitter-core";
import type { GaugeChartCustom } from "@headless/gauge-chart/types";
import type { GaugeChartConfig } from "../config";
import { agTitle } from "@styles/ag";
import { gaugeHasTitle } from "./layout";

export function agGaugeTitle(
  args: Parameters<GaugeChartCustom<GaugeChartConfig>["title"]>[0],
  ctx: Parameters<GaugeChartCustom<GaugeChartConfig>["title"]>[1],
): Widget {
  return gaugeHasTitle(ctx.config) ? agTitle(args as any, ctx as any) : SizedBox.shrink();
}
