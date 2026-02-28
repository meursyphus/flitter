import type { Widget } from "flitter-core";
import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { ToastStackedAreaChartConfig } from "../config";
import { toastTitle as sharedTitle } from "@shared/toast";

export function createToastTitle(vc: ToastStackedAreaChartConfig) {
  return function toastTitle(
    ...[{ name }]: Parameters<StackedAreaChartCustom["title"]>
  ): Widget {
    const { title, font } = vc;
    return sharedTitle({
      name,
      fontFamily: title.fontFamily ?? font.family,
      fontSize: title.fontSize,
      fontWeight: title.fontWeight ?? "bold",
      color: title.color,
    });
  };
}
