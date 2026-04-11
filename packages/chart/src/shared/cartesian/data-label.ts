import type { CartesianCustom } from "./types";
import { SizedBox, type Widget } from "flitter-core";

export function DataLabel(config: Parameters<CartesianCustom["dataLabel"]>[0]): Widget {
  return SizedBox.shrink();
}
