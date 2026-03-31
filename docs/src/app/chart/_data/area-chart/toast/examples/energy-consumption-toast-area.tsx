"use client";

import Widget from "@flitterjs/react";
import { ToastAreaChart as ToastAreaChartWidget } from "shared/chart";
import {
  Row,
  Container,
  BoxDecoration,
  SizedBox,
  Text,
  TextStyle,
  CrossAxisAlignment,
  BorderRadius,
} from "flitter-ui";

const colors = ["#eab308", "#22c55e", "#64748b"];
const icons = ["\u2600", "\u{1F32C}", "\u26A1"];

export default function EnergyConsumptionToastArea() {
  return (
    <Widget
      widget={ToastAreaChartWidget({
        data: {
          labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
          datasets: [
            { legend: "Solar (MWh)", values: [120, 210, 420, 510, 350, 150] },
            { legend: "Wind (MWh)", values: [380, 310, 220, 160, 240, 360] },
            { legend: "Grid (MWh)", values: [500, 440, 320, 280, 370, 470] },
          ],
        },
        config: {
          colors,
          area: {
            strokeWidth: 2,
            opacity: 0.35,
            spline: true,
          },
        },
        custom: {
          legend: ({ name, index }: { name: string; index: number }) =>
            Row({
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container({
                  width: 18,
                  height: 18,
                  decoration: new BoxDecoration({
                    color: colors[index] + "20",
                    borderRadius: BorderRadius.circular(4),
                  }),
                  child: Text(icons[index], {
                    style: new TextStyle({ fontSize: 10 }),
                  }),
                }),
                SizedBox({ width: 6 }),
                Text(name, {
                  style: new TextStyle({
                    fontSize: 11,
                    color: "#475569",
                  }),
                }),
              ],
            }),
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
