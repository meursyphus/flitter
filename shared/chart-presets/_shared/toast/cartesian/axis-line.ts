import type { Widget } from "flitter-ui";
import type { ToastBaseConfig } from "./config";
import { XAxisLine, YAxisLine } from "flitter-ui/chart";

export function toastXAxisLine(
  _args: undefined,
  context: { config: ToastBaseConfig },
): Widget {
  const { axis } = context.config;
  return XAxisLine({ color: axis.color, thickness: axis.thickness });
}

export function toastYAxisLine(
  _args: undefined,
  context: { config: ToastBaseConfig },
): Widget {
  const { axis } = context.config;
  return YAxisLine({ color: axis.color, thickness: axis.thickness });
}
