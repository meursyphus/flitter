import type { Widget } from "flitter-ui";
import type { ToastBaseConfig } from "./config";
import { GridXLine, GridYLine } from "flitter-ui/chart";

export function toastGridXLine(
  _args: undefined,
  context: { config: ToastBaseConfig },
): Widget {
  const { grid } = context.config;
  return GridXLine({ thickness: grid.thickness, color: grid.color });
}

export function toastGridYLine(
  _args: undefined,
  context: { config: ToastBaseConfig },
): Widget {
  const { grid } = context.config;
  return GridYLine({ thickness: grid.thickness, color: grid.color });
}
