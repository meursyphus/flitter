import { SizedBox, type Widget } from "flitter-core";
import type { GaugeChartCustom } from "@headless/gauge-chart/types";
import * as Base from "../../base";
import type { GaugeChartConfig } from "../config";

export function agNeedle(
  args: Parameters<GaugeChartCustom<GaugeChartConfig>["needle"]>[0],
  ctx: Parameters<GaugeChartCustom<GaugeChartConfig>["needle"]>[1],
): Widget {
  return ctx.config.gauge.showNeedle
    ? Base.Needle(args, ctx)
    : SizedBox.shrink();
}
