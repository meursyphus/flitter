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
  ZIndex,
  type Widget,
} from "flitter-core";
import type { ToastBaseConfig } from "./config";

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
  config: ToastBaseConfig;
}): Widget {
  const { tooltip, font } = config;

  return ZIndex({
    zIndex: 0,
    child: Container({
      padding: EdgeInsets.all(tooltip.padding),
      decoration: new BoxDecoration({
        color: tooltip.backgroundColor,
        borderRadius: BorderRadius.all(Radius.circular(tooltip.borderRadius)),
        boxShadow: [
          new BoxShadow({
            color: "rgba(0,0,0,0.15)",
            blurRadius: 12,
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
              fontSize: 12,
              fontWeight: "bold",
              color: tooltip.textColor,
            }),
          }),
          SizedBox({ height: 6 }),
          Row({
            mainAxisSize: MainAxisSize.min,
            children: [
              Container({
                width: 10,
                height: 10,
                decoration: new BoxDecoration({ color }),
              }),
              SizedBox({ width: 8 }),
              Text(legend, {
                style: new TextStyle({
                  fontFamily: font.family,
                  fontSize: 11,
                  color: tooltip.textColor,
                }),
              }),
              SizedBox({ width: 12 }),
              Text(`${value}`, {
                style: new TextStyle({
                  fontFamily: font.family,
                  fontSize: 11,
                  fontWeight: "bold",
                  color: tooltip.textColor,
                }),
              }),
            ],
          }),
        ],
      }),
    }),
  });
}
