import { Padding, EdgeInsets, Text, TextStyle, type Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

export function toastYAxisLabel(
  { name }: { name: string; index: number },
  context: BarChartContext<ToastBarChartConfig>
): Widget {
  const { axis, font } = context.config;
  return Padding({
    padding: EdgeInsets.only({ right: axis.label.gap }),
    child: Text(name, {
      style: new TextStyle({
        fontFamily: font.family,
        fontSize: axis.label.fontSize,
        color: axis.label.color,
      }),
    }),
  });
}
