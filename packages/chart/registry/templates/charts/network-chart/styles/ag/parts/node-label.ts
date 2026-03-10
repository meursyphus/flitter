import {
  Align,
  Alignment,
  FractionalTranslation,
  Offset,
  Text,
  TextStyle,
  type Widget,
} from "flitter-core";
import type { NetworkChartCustom } from "@headless/network-chart/types";
import type { NetworkChartConfig } from "../config";

export function agNodeLabel(
  { label, x, y }: Parameters<NetworkChartCustom<NetworkChartConfig>["nodeLabel"]>[0],
  ctx: Parameters<NetworkChartCustom<NetworkChartConfig>["nodeLabel"]>[1],
): Widget {
  return Align({
    alignment: new Alignment({ x: x * 2 - 1, y: y * 2 - 1 }),
    child: FractionalTranslation({
      translation: new Offset({ x: 1.15, y: -0.2 }),
      child: Text(label, {
        style: new TextStyle({
          fontSize: 11,
          color: "#333333",
          fontFamily: ctx.config.font.family,
        }),
      }),
    }),
  });
}
