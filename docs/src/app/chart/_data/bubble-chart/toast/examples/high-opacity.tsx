"use client";

import Widget from "@flitterjs/react";
import {
  Container,
  BoxDecoration,
  EdgeInsets,
  BorderRadius,
  Text,
  TextStyle,
  Row,
  SizedBox,
  MainAxisSize,
  CrossAxisAlignment,
} from "flitter-ui";
import { ToastBubbleChart as ToastBubbleChartWidget } from "shared/chart";

export default function HighOpacityToastBubbleChart() {
  return (
    <Widget
      widget={ToastBubbleChartWidget({
        data: {
          datasets: [
            {
              legend: "Europe",
              data: [
                { x: 23300, y: 79.37, value: 40280780, label: "Spain" },
                { x: 27700, y: 79.54, value: 58057477, label: "Italy" },
                { x: 28700, y: 78.54, value: 22424609, label: "Germany" },
                { x: 28700, y: 79.44, value: 30424213, label: "France" },
                { x: 29600, y: 78.27, value: 60270708, label: "United Kingdom" },
                { x: 33800, y: 80.31, value: 7450867, label: "Switzerland" },
              ],
            },
            {
              legend: "Asia",
              data: [
                { x: 19200, y: 75.58, value: 48598170, label: "Korea, South" },
                { x: 25300, y: 77.06, value: 22749838, label: "Taiwan" },
                { x: 27800, y: 81.53, value: 4353893, label: "Singapore" },
                { x: 29400, y: 81.04, value: 52733300, label: "Japan" },
              ],
            },
          ],
        },
        custom: {
          legend: ({ name, index }: any, context: any) => {
            const color = context.config.colors[index % context.config.colors.length];
            return Container({
              padding: EdgeInsets.symmetric({ horizontal: 10, vertical: 4 }),
              decoration: new BoxDecoration({
                color: `${color}18`,
                borderRadius: BorderRadius.circular(12),
              }),
              child: Row({
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Container({
                    width: 10,
                    height: 10,
                    decoration: new BoxDecoration({
                      color,
                      shape: "circle",
                    }),
                  }),
                  SizedBox({ width: 6 }),
                  Text(name, {
                    style: new TextStyle({
                      fontSize: 11,
                      color,
                      fontWeight: "600",
                    }),
                  }),
                ],
              }),
            });
          },
        },
        config: {
          title: { text: "Europe vs Asia: Developed Nations", visible: true },
          bubble: { opacity: 1.0 },
          colors: ["#dc2626", "#2563eb", "#059669", "#7c3aed", "#d97706"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
