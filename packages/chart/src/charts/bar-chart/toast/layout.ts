import {
  Text,
  Container,
  EdgeInsets,
  TextStyle,
  SizedBox,
  Column,
  CrossAxisAlignment,
  Expanded,
  type Widget,
} from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

export function toastLayout(
  { plot }: { title: Widget; legends: Widget[]; plot: Widget },
  context: BarChartContext<ToastBarChartConfig>
) {
  const { font } = context.config;
  return Container({
    padding: EdgeInsets.only({ left: 60, bottom: 40, top: 30, right: 20 }),
    child: Column({
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Text("Inspired by Toast", {
          style: new TextStyle({
            fontSize: font.size + 2,
            color: "#999999",
            fontFamily: font.family,
          }),
        }),
        SizedBox({ height: 4 }),
        Expanded({ child: plot }),
      ],
    }),
  });
}
