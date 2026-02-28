import type { Widget } from "flitter-core";
import type { ScatterChartContext } from "@headless/scatter-chart/types";
import type { ToastScatterChartConfig } from "./config";
import { toastTitle as sharedTitle } from "@shared/toast";

export function toastTitle(
  { name }: { name: string },
  context: ScatterChartContext<ToastScatterChartConfig>
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
