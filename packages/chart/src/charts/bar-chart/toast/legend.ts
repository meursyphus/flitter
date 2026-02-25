import {
  Container,
  Row,
  SizedBox,
  Text,
  TextStyle,
  EdgeInsets,
  Padding,
  BoxDecoration,
  Border,
  Center,
  MainAxisSize,
  type Widget,
} from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

function Checkbox({ color }: { color: string }): Widget {
  return Container({
    width: 12,
    height: 12,
    decoration: new BoxDecoration({
      color,
    }),
  });
}

export function toastLegend(
  { name, index }: { name: string; index: number },
  context: BarChartContext<ToastBarChartConfig>
): Widget {
  const { colors, font } = context.config;
  const color = colors[index % colors.length];
  return Padding({
    padding: EdgeInsets.symmetric({ horizontal: 8 }),
    child: Row({
      mainAxisSize: MainAxisSize.min,
      children: [
        Checkbox({ color }),
        SizedBox({ width: 6 }),
        Text(name, {
          style: new TextStyle({
            fontFamily: font.family,
            fontSize: font.size,
            color: "#333333",
          }),
        }),
      ],
    }),
  });
}
