import {
  Border,
  BoxDecoration,
  Column,
  Container,
  EdgeInsets,
  MainAxisAlignment,
  Padding,
  SizedBox,
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
  { item, isHovered }: {
    item: WaterfallChartDatum;
    index: number;
    isHovered: boolean;
  },
  ctx: WaterfallChartContext<WaterfallChartConfig>,
): Widget {
  const color = ctx.config.colors.fills[TYPE_INDEX[item.type]] ?? ctx.config.colors.fills[0];
  const dlCfg = ctx.config.waterfall.dataLabel;
  const isPositive = item.end >= item.start;
  const formattedValue = ctx.config.waterfall.valueFormatter(item.value, item.type);

  const dataLabelWidget = dlCfg.visible
    ? Padding({
        padding: EdgeInsets.only({ bottom: isPositive ? 2 : 0, top: isPositive ? 0 : 2 }),
        child: Text(formattedValue, {
          style: new TextStyle({
            fontSize: dlCfg.fontSize,
            color: dlCfg.color,
            fontFamily: dlCfg.fontFamily ?? ctx.config.font.family,
          }),
        }),
      })
    : SizedBox.shrink();

  return SizedBox.expand({
    child: Column({
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        ...(isPositive && dlCfg.visible ? [dataLabelWidget] : []),
        Container({
          width: Infinity,
          height: Infinity,
          decoration: new BoxDecoration({
            color,
            border:
              isHovered
                ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                : undefined,
          }),
        }),
        ...(!isPositive && dlCfg.visible ? [dataLabelWidget] : []),
      ],
    }),
  });
}
