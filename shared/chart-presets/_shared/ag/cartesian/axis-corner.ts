import type { Widget } from "flitterjs";
import type { AgCartesianBaseConfig } from "./config";
import { AxisCorner } from "@flitterjs/chart";

export function agAxisCorner(
  args: undefined,
  context: { config: AgCartesianBaseConfig },
): Widget {
  const { axis } = context.config;
  return AxisCorner({ color: axis.color, size: axis.thickness });
}
