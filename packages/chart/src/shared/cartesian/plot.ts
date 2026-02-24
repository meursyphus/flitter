import type { CartesianCustom } from "./types";
import {
  FractionalTranslation,
  Stack,
  Positioned,
  type Widget,
} from "flitter-core";

export function Plot({
  series,
  xAxis,
  yAxis,
  grid,
  axisCorner,
}: Parameters<CartesianCustom["plot"]>[0]): Widget {
  return Stack({
    children: [
      Positioned({
        top: 0,
        left: 0,
        bottom: 0,
        child: FractionalTranslation({
          translation: { x: -1, y: 0 },
          child: yAxis,
        }),
      }),
      Positioned({
        bottom: 0,
        left: 0,
        right: 0,
        child: FractionalTranslation({
          translation: { x: 0, y: 1 },
          child: xAxis,
        }),
      }),
      Positioned({
        bottom: 0,
        left: 0,
        child: FractionalTranslation({
          translation: { x: -1, y: 1 },
          child: axisCorner,
        }),
      }),
      grid,
      series,
    ],
  });
}
