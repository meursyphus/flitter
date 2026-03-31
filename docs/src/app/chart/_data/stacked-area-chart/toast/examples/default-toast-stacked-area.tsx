"use client";

import Widget from "@flitterjs/react";
import { ToastStackedAreaChart as ToastStackedAreaChartWidget } from "shared/chart";
import {
  Container,
  BoxDecoration,
  BorderRadius,
  EdgeInsets,
  Text,
  TextStyle,
  Column,
  MainAxisSize,
  CrossAxisAlignment,
  SizedBox,
} from "flitter-ui";

export default function DefaultToastStackedAreaChart() {
  return (
    <Widget
      widget={ToastStackedAreaChartWidget({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "Organic", values: [400, 450, 420, 480, 520, 510, 550, 530, 560, 600, 620, 650] },
            { legend: "Direct", values: [200, 220, 210, 230, 250, 240, 260, 255, 270, 290, 300, 310] },
            { legend: "Social", values: [100, 120, 130, 140, 160, 155, 170, 165, 180, 200, 210, 220] },
            { legend: "Referral", values: [50, 60, 55, 65, 70, 75, 80, 78, 85, 90, 95, 100] },
          ],
        },
        config: {
          colors: ["#6366f1", "#22c55e", "#f59e0b", "#ec4899"],
          title: { text: "Traffic Source Breakdown", visible: true, alignment: "center" },
          area: { opacity: 0.5 },
        },
        custom: {
          title: (_args: undefined, context: any) => {
            const { font, title } = context.config;
            return Container({
              padding: EdgeInsets.symmetric({ horizontal: 20, vertical: 8 }),
              decoration: new BoxDecoration({
                color: "#eef2ff",
                borderRadius: BorderRadius.circular(8),
              }),
              child: Column({
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text("Traffic Source Breakdown", {
                    style: new TextStyle({
                      fontFamily: title.fontFamily ?? font.family,
                      fontSize: title.fontSize,
                      fontWeight: "700",
                      color: "#4338ca",
                    }),
                  }),
                  SizedBox({ height: 2 }),
                  Text("12-month overview across all channels", {
                    style: new TextStyle({
                      fontFamily: font.family,
                      fontSize: 11,
                      color: "#6366f1",
                    }),
                  }),
                ],
              }),
            });
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
