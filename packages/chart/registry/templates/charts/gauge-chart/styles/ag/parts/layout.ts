import {
  Alignment,
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  MainAxisSize,
  SizedBox,
  Stack,
  type Widget,
} from "flitter-core";
import type { GaugeChartCustom } from "@headless/gauge-chart/types";
import type { GaugeChartConfig } from "../config";

export function gaugeHasTitle(config: GaugeChartConfig): boolean {
  return Boolean(config.title.text) || (config.subtitle.visible && Boolean(config.subtitle.text));
}

export function agGaugeLayout(
  args: Parameters<GaugeChartCustom<GaugeChartConfig>["layout"]>[0],
  ctx: Parameters<GaugeChartCustom<GaugeChartConfig>["layout"]>[1],
): Widget {
  return Container({
    padding: EdgeInsets.all(20),
    child: Column({
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        gaugeHasTitle(ctx.config) ? args.title : SizedBox.shrink(),
        gaugeHasTitle(ctx.config) ? SizedBox({ height: 8 }) : SizedBox.shrink(),
        SizedBox({
          width: 260,
          height: 180,
          child: Stack({
            alignment: Alignment.center,
            clipped: false,
            children: [
              args.gauge,
              Container({
                padding: EdgeInsets.only({ top: 34 }),
                child: args.valueLabel,
              }),
            ],
          }),
        }),
      ],
    }),
  });
}
