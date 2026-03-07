import type { SunburstCustom } from "../types";
import { Text, type Widget } from "flitter-core";

export function Title(
  ...[{ name }]: Parameters<SunburstCustom["title"]>
): Widget {
  return Text(name);
}
