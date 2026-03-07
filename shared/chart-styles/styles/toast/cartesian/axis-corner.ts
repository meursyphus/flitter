import type { Widget } from "flitter-core";
import type { ToastBaseConfig } from "./config";
import { AxisCorner } from "@shared/cartesian";

export function toastAxisCorner(
  args: undefined,
  context: { config: ToastBaseConfig },
): Widget {
  const { axis } = context.config;
  return AxisCorner({ color: axis.color, size: axis.thickness });
}
