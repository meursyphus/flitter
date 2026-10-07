import {
  Align,
  Alignment,
  BoxDecoration,
  Container,
  EdgeInsets,
  Opacity,
  Padding,
  Stack,
  StackFit,
  Text,
  TextStyle,
  type Widget,
} from "flitter-ui";
import type {
  WaterfallBarType,
  WaterfallChartContext,
  WaterfallChartDatum,
} from "flitter-ui/chart";
import type { WaterfallChartConfig } from "../config";

const TYPE_INDEX: Record<WaterfallBarType, number> = {
  increase: 0,
  decrease: 1,
  total: 2,
  subtotal: 2,
};

export function agBar(
  {
    item,
    isHovered,
  }: { item: WaterfallChartDatum; index: number; isHovered: boolean },
  ctx: WaterfallChartContext<WaterfallChartConfig>,
): Widget {
  const colors = ctx.config.colors.fills;
  const color = colors[TYPE_INDEX[item.type]] ?? colors[0];
  const label = ctx.config.waterfall.dataLabel;
  return Opacity({
    opacity: ctx.hoveredBar != null && !isHovered ? 0.35 : 1,
    child: Stack({
      fit: StackFit.expand,
      clipped: false,
      children: [
        Container({
          width: Infinity,
          height: Infinity,
          decoration: new BoxDecoration({
            color,
          }),
        }),
        ...(label.visible
          ? [
              Align({
                alignment:
                  item.end >= item.start
                    ? Alignment.topCenter
                    : Alignment.bottomCenter,
                child: Padding({
                  padding: EdgeInsets.symmetric({ vertical: 4 }),
                  child: Text(
                    ctx.config.waterfall.valueFormatter(item.value, item.type),
                    {
                      style: new TextStyle({
                        fontFamily: label.fontFamily ?? ctx.config.font.family,
                        fontSize: label.fontSize,
                        color: label.color,
                      }),
                    },
                  ),
                }),
              }),
            ]
          : []),
      ],
    }),
  });
}
