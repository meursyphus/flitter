import type { Widget } from "flitter-core";
import type { ToastBaseConfig } from "./config";
import { GridXLine, GridYLine } from "flitter-ui/chart";

export function toastGridXLine(
  args: undefined,
  context: { config: ToastBaseConfig },
): Widget {
  const { grid } = context.config;
  return GridXLine({ thickness: grid.thickness, color: grid.color });
}

export function toastGridYLine(
  args: undefined,
  context: { config: ToastBaseConfig },
): Widget {
  const { grid } = context.config;
  return GridYLine({ thickness: grid.thickness, color: grid.color });
}
