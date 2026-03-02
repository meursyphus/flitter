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
  BoxShadow,
  Radius,
  MainAxisSize,
  CrossAxisAlignment,
  type Widget,
} from "flitter-core";
import type { ToastBaseConfig } from "./cartesian/config";

type TooltipItem = {
  legend: string;
  color: string;
  value: number;
};

export function tooltipContent({
  label,
  items,
  config,
}: {
  label: string;
  items: TooltipItem | TooltipItem[];
  config: ToastBaseConfig;
}): Widget {
  const { tooltip, font } = config;
  const itemList = Array.isArray(items) ? items : [items];

  const rows: Widget[] = itemList.map((item) =>
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
        SizedBox({ width: 10 }),
        Text(item.legend, {
          style: new TextStyle({
            fontFamily: font.family,
            fontSize: 12,
            color: tooltip.textColor,
          }),
        }),
        SizedBox({ width: 16 }),
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
    padding: EdgeInsets.symmetric({ horizontal: tooltip.padding + 2, vertical: tooltip.padding }),
    decoration: new BoxDecoration({
      color: tooltip.backgroundColor,
      borderRadius: tooltip.borderRadius > 0 ? BorderRadius.all(Radius.circular(tooltip.borderRadius)) : undefined,
      boxShadow: [
        new BoxShadow({
          color: "rgba(0,0,0,0.2)",
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
            fontWeight: "bold",
            color: tooltip.textColor,
          }),
        }),
        SizedBox({ height: 14 }),
        ...rows,
      ],
    }),
  });
}
