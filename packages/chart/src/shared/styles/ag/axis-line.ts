import type { Widget } from "flitter-core";
import type { AgBaseConfig } from "./config";
import { XAxisLine, YAxisLine } from "../../cartesian";

export function agXAxisLine(
  args: undefined,
  context: { config: AgBaseConfig },
): Widget {
  const { axis } = context.config;
  return XAxisLine({ color: axis.color, thickness: axis.thickness });
}

export function agYAxisLine(
  args: undefined,
  context: { config: AgBaseConfig },
): Widget {
  const { axis } = context.config;
  return YAxisLine({ color: axis.color, thickness: axis.thickness });
}
