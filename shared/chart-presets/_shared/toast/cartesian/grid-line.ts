import type { Widget } from "flitterjs";
import type { ToastBaseConfig } from "./config";
import { GridXLine, GridYLine } from "@flitterjs/chart";

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
