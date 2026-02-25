import { Padding, EdgeInsets, Text, TextStyle, type Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

export function toastYAxisLabel(
  { name }: { name: string; index: number },
  context: BarChartContext<ToastBarChartConfig>
): Widget {
  const { font, labelColor } = context.config;
  return Padding({
    padding: EdgeInsets.only({ right: 1 }),
    child: Text(name, {
      style: new TextStyle({
        fontFamily: font.family,
        fontSize: font.size,
        color: labelColor,
      }),
    }),
  });
}
