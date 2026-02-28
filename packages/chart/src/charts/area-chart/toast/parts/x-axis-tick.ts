import type { Widget } from "flitter-core";
import type { LineChartContext } from "@headless/line-chart/types";
import type { ToastAreaChartConfig } from "../config";
import { toastXAxisTick as sharedXAxisTick } from "@shared/toast";

export function toastXAxisTick(
  _args: undefined,
  context: LineChartContext<ToastAreaChartConfig>
): Widget {
  return sharedXAxisTick(_args, context);
}
