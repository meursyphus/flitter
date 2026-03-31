"use client";

import Widget from "@flitterjs/react";
import { ToastBarChart as ToastBarChartWidget } from "shared/chart";
import { Text, TextStyle, Row, SizedBox, MainAxisSize } from "flitter-ui";

export default function HorizontalRankingToast() {
  return (
    <Widget
      widget={ToastBarChartWidget({
        direction: "horizontal",
        data: {
          labels: ["Alice", "Bob", "Carol", "Dave", "Eve"],
          datasets: [{ legend: "Sales ($K)", values: [142, 128, 115, 98, 87] }],
        },
        config: {
          colors: ["#0d9488"],
          title: { text: "Top Performers", visible: true },
          bar: { cornerRadius: 3 },
        },
        custom: {
          yAxisLabel: (
            { name, index }: { name: string; index: number },
            context: any,
          ) => {
            const { font } = context.config;
            return Row({
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(`${index + 1}`, {
                  style: new TextStyle({
                    fontFamily: font.family,
                    fontSize: font.size,
                    fontWeight: "bold",
                    color: "#0d9488",
                  }),
                }),
                SizedBox({ width: 4 }),
                Text(name, {
                  style: new TextStyle({
                    fontFamily: font.family,
                    fontSize: font.size,
                    color: "#334155",
                  }),
                }),
              ],
            });
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
