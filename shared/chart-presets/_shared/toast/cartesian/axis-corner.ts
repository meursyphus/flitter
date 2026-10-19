import type { Widget } from "flitterjs";
import type { ToastBaseConfig } from "./config";
import { AxisCorner } from "@flitterjs/chart";

export function toastAxisCorner(
  _args: undefined,
  context: { config: ToastBaseConfig },
): Widget {
  const { axis } = context.config;
  return AxisCorner({ color: axis.color, size: axis.thickness });
}
