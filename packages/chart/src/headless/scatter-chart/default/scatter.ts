import type { ScatterChartCustom } from "../types";
import { Container, BoxDecoration } from "flitter-core";

export function Scatter(
  ..._args: Parameters<ScatterChartCustom["scatter"]>
) {
  return Container({
    width: 10,
    height: 10,
    decoration: new BoxDecoration({
      color: "black",
      shape: "circle",
    }),
  });
}
