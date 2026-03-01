import type { TreemapCustom } from "../types";
import {
  Stack,
  type Widget,
} from "flitter-core";

export function Treemap(
  ...[{ nodes }]: Parameters<TreemapCustom["treemap"]>
): Widget {
  return Stack({
    children: nodes,
  });
}
