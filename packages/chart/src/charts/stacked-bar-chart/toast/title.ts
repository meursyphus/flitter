import type { Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastStackedBarChartConfig } from "./config";
import { toastTitle as sharedTitle } from "@shared/toast";

export function toastTitle(
  { name }: { name: string },
  context: BarChartContext<ToastStackedBarChartConfig>
): Widget {
  const { title, font } = context.config;
  return sharedTitle({
    name,
    fontFamily: title.fontFamily ?? font.family,
    fontSize: title.fontSize,
    fontWeight: title.fontWeight,
    color: title.color,
  });
}
