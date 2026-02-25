import { Text, TextStyle, type Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

export function toastTitle(
  { name }: { name: string },
  context: BarChartContext<ToastBarChartConfig>
): Widget {
  const { title: titleConfig, font } = context.config;
  return Text(name, {
    style: new TextStyle({
      fontFamily: titleConfig.fontFamily ?? font.family,
      fontSize: titleConfig.fontSize,
      fontWeight: titleConfig.fontWeight,
      color: titleConfig.color,
    }),
  });
}
