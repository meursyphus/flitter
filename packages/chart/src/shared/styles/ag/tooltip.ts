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
  type Widget,
} from "flitter-core";
import type { AgBaseConfig } from "./config";

/**
 * AG Charts tooltip: white background, border, shadow.
 * Different from toast (which uses dark semi-transparent bg).
 */
export function tooltipContent({
  label,
  legend,
  color,
  value,
  config,
}: {
  label: string;
  legend: string;
  color: string;
  value: number;
  config: AgBaseConfig;
}): Widget {
  const { tooltip, font } = config;

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
        Row({
          mainAxisSize: MainAxisSize.min,
          children: [
            Container({
              width: 12,
              height: 12,
              decoration: new BoxDecoration({
                color,
                borderRadius: BorderRadius.all(Radius.circular(2)),
              }),
            }),
            SizedBox({ width: 8 }),
            Text(legend, {
              style: new TextStyle({
                fontFamily: font.family,
                fontSize: 12,
                color: tooltip.textColor,
              }),
            }),
            SizedBox({ width: 12 }),
            Text(`${value}`, {
              style: new TextStyle({
                fontFamily: font.family,
                fontSize: 12,
                fontWeight: "bold",
                color: tooltip.textColor,
              }),
            }),
          ],
        }),
      ],
    }),
  });
}
