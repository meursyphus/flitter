import {
  Row,
  SizedBox,
  Text,
  TextStyle,
  EdgeInsets,
  Padding,
  MainAxisSize,
  Container,
  BoxDecoration,
  BorderRadius,
  type Widget,
} from "flitter-core";
import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { ToastStackedAreaChartConfig } from "./config";

export function createToastLegend(vc: ToastStackedAreaChartConfig) {
  return function toastLegend(
    ...[{ name, index }]: Parameters<StackedAreaChartCustom["legend"]>
  ): Widget {
    const { colors, font } = vc;
    const color = colors[index % colors.length];

    return Padding({
      padding: EdgeInsets.symmetric({ horizontal: 8 }),
      child: Row({
        mainAxisSize: MainAxisSize.min,
        children: [
          Container({
            width: 12,
            height: 12,
            decoration: new BoxDecoration({
              color,
              borderRadius: BorderRadius.circular(2),
            }),
          }),
          SizedBox({ width: 6 }),
          Text(name, {
            style: new TextStyle({
              fontFamily: font.family,
              fontSize: font.size,
              color: "#333333",
            }),
          }),
        ],
      }),
    });
  };
}
