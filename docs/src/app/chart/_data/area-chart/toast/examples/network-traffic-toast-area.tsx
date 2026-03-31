"use client";

import Widget from "@flitterjs/react";
import { ToastAreaChart as ToastAreaChartWidget } from "shared/chart";
import {
  Column,
  Container,
  BoxDecoration,
  Text,
  TextStyle,
  SizedBox,
  MainAxisSize,
  EdgeInsets,
  Border,
  BorderSide,
} from "flitter-ui";

export default function NetworkTrafficToastArea() {
  return (
    <Widget
      widget={ToastAreaChartWidget({
        data: {
          labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
          datasets: [
            { legend: "Inbound (Gbps)", values: [2.1, 0.8, 1.8, 6.2, 8.1, 5.2] },
            { legend: "Outbound (Gbps)", values: [1.8, 0.5, 1.5, 5.5, 7.2, 4.5] },
          ],
        },
        config: {
          colors: ["#3b82f6", "#f97316"],
          area: {
            strokeWidth: 1.5,
            opacity: 0.15,
            spline: true,
          },
        },
        custom: {
          title: () =>
            Container({
              padding: EdgeInsets.only({ left: 8, bottom: 8 }),
              decoration: new BoxDecoration({
                border: new Border({
                  left: new BorderSide({ color: "#3b82f6", width: 3 }),
                }),
              }),
              child: Column({
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text("Network Traffic", {
                    style: new TextStyle({
                      fontSize: 14,
                      fontWeight: "700",
                      color: "#1e293b",
                    }),
                  }),
                  SizedBox({ height: 2 }),
                  Text("24-hour bandwidth monitor", {
                    style: new TextStyle({
                      fontSize: 11,
                      color: "#94a3b8",
                    }),
                  }),
                ],
              }),
            }),
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
