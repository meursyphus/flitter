import { Text, TextStyle, type Widget } from "flitter-core";
import type { GaugeChartCustom } from "flitter-ui/chart";
import type { GaugeChartConfig } from "../config";

export function agValueLabel(
  { value }: Parameters<GaugeChartCustom<GaugeChartConfig>["valueLabel"]>[0],
  ctx: Parameters<GaugeChartCustom<GaugeChartConfig>["valueLabel"]>[1],
): Widget {
  return Text(value.toString(), {
    style: new TextStyle({
      fontFamily: ctx.config.font.family,
      fontSize: 22,
      fontWeight: "600",
      color: ctx.config.gauge.valueColor,
    }),
  });
}
