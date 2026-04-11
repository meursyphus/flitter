import {
  Alignment,
  AnimatedScale,
  Border,
  BoxDecoration,
  BoxShadow,
  Container,
  EdgeInsets,
  Padding,
  SizedBox,
	Text,
	TextStyle,
	type Widget,
} from "flitter-core";
import type {
  WaterfallBarType,
  WaterfallChartContext,
  WaterfallChartDatum,
} from "@headless/waterfall-chart/types";
import type { WaterfallChartConfig } from "../config";

const TYPE_INDEX: Record<WaterfallBarType, number> = {
  increase: 0,
  decrease: 1,
  total: 2,
  subtotal: 2,
};

export function toastBar(
  { item, isHovered }: {
    item: WaterfallChartDatum;
    index: number;
    isHovered: boolean;
  },
  ctx: WaterfallChartContext<WaterfallChartConfig>,
): Widget {
  const color = ctx.config.colors[TYPE_INDEX[item.type]] ?? ctx.config.colors[0];
  const dlCfg = ctx.config.waterfall.dataLabel;
  const label =
    dlCfg.visible
      ? Padding({
          padding: EdgeInsets.only({ top: item.end >= item.start ? 0 : 4, bottom: item.end >= item.start ? 4 : 0 }),
          child: Text(ctx.config.waterfall.valueFormatter(item.value, item.type), {
            style: new TextStyle({
              fontFamily: dlCfg.fontFamily ?? ctx.config.font.family,
              fontSize: dlCfg.fontSize,
              color: dlCfg.color,
            }),
          }),
        })
      : SizedBox.shrink();

  return SizedBox.expand({
    child: Container({
      width: Infinity,
      height: Infinity,
      child: AnimatedScale({
        duration: ctx.config.animation.duration,
        scale: isHovered ? 1.02 : 1,
        alignment: item.end >= item.start ? Alignment.bottomCenter : Alignment.topCenter,
        child: Container({
          width: Infinity,
          height: Infinity,
          decoration: new BoxDecoration({
            color,
            border:
              isHovered
                ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                : undefined,
            boxShadow:
              isHovered
                ? [new BoxShadow({ color: "rgba(0,0,0,0.24)", blurRadius: 12 })]
                : undefined,
          }),
          child: label,
        }),
      }),
    }),
  });
}
