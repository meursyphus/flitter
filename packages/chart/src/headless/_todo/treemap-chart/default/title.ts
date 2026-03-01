import type { TreemapCustom } from "../types";
import { Text, type Widget } from "flitter-core";

export function Title(
  ...[{ name }]: Parameters<TreemapCustom["title"]>
): Widget {
  return Text(name);
}
