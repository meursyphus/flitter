import type { Widget } from "flitter-ui";
import type { AgCartesianBaseConfig } from "./config";
import { AxisCorner } from "flitter-ui/chart";

export function agAxisCorner(
  args: undefined,
  context: { config: AgCartesianBaseConfig },
): Widget {
  const { axis } = context.config;
  return AxisCorner({ color: axis.color, size: axis.thickness });
}
