import type { Widget } from "flitter-core";
import type { LineChartContext } from "@headless/line-chart/types";
import type { ToastAreaChartConfig } from "../config";
import { toastTitle as sharedTitle } from "@shared/toast";

export function toastTitle(
  { name }: { name: string },
  context: LineChartContext<ToastAreaChartConfig>
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
