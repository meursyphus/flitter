import {
  Container,
  Row,
  Column,
  Text,
  TextStyle,
  EdgeInsets,
  SizedBox,
  BoxDecoration,
  BorderRadius,
  Border,
  BorderSide,
  BoxShadow,
  Radius,
  MainAxisSize,
  CrossAxisAlignment,
  Transform,
  Offset,
  type Widget,
} from "flitter-core";
import type { AgBaseConfig } from "./cartesian/config";
import { tooltipArrow } from "./tooltip-arrow";

const ARROW_WIDTH = 16;
const ARROW_HEIGHT = 8;

type TooltipItem = {
  legend: string;
  color: string;
  value: number;
};

/**
 * Tooltip box: white background, border, shadow.
 */
function tooltipBox({
  label,
  items,
  config,
}: {
  label: string;
  items: TooltipItem[];
  config: AgBaseConfig;
}): Widget {
  const { tooltip, font } = config;

  const rows: Widget[] = items.map((item) =>
    Row({
      mainAxisSize: MainAxisSize.min,
      children: [
        Container({
          width: 12,
          height: 12,
          decoration: new BoxDecoration({
            color: item.color,
            borderRadius: BorderRadius.all(Radius.circular(2)),
          }),
        }),
        SizedBox({ width: 8 }),
        Text(item.legend, {
          style: new TextStyle({
            fontFamily: font.family,
            fontSize: 12,
            color: tooltip.textColor,
          }),
        }),
        SizedBox({ width: 12 }),
        Text(`${item.value}`, {
          style: new TextStyle({
            fontFamily: font.family,
            fontSize: 12,
            fontWeight: "bold",
            color: tooltip.textColor,
          }),
        }),
      ],
    }),
  );

  return Container({
    padding: EdgeInsets.symmetric({ horizontal: tooltip.padding, vertical: tooltip.padding }),
    decoration: new BoxDecoration({
      color: tooltip.backgroundColor,
      borderRadius: tooltip.borderRadius > 0 ? BorderRadius.all(Radius.circular(tooltip.borderRadius)) : undefined,
      border: Border.all({ color: tooltip.borderColor, width: 1 }),
      boxShadow: [
        new BoxShadow({
          color: "rgba(0,0,0,0.15)",
          blurRadius: 16,
        }),
      ],
    }),
    child: Column({
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, {
          style: new TextStyle({
            fontFamily: font.family,
            fontSize: 13,
            fontWeight: "600",
            color: tooltip.textColor,
          }),
        }),
        SizedBox({ height: 10 }),
        ...rows,
      ],
    }),
  });
}

/**
 * AG Charts tooltip with downward-pointing arrow.
 * The arrow overlaps the tooltip border by 1px for a seamless look.
 */
export function tooltipContent({
  label,
  items,
  config,
}: {
  label: string;
  items: TooltipItem | TooltipItem[];
  config: AgBaseConfig;
}): Widget {
  const { tooltip } = config;
  const itemList = Array.isArray(items) ? items : [items];

  return Column({
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.center,
    children: [
      tooltipBox({ label, items: itemList, config }),
      Transform.translate({
        offset: new Offset({ x: 0, y: -1 }),
        child: tooltipArrow({
          width: ARROW_WIDTH,
          height: ARROW_HEIGHT,
          fillColor: tooltip.backgroundColor,
          borderColor: tooltip.borderColor,
        }),
      }),
    ],
  });
}
