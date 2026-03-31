"use client";

import Widget from "@flitterjs/react";
import { ToastBarChart as ToastBarChartWidget } from "shared/chart";
import { Text, TextStyle } from "flitter-ui";

export default function BudgetVsActualToast() {
  return (
    <Widget
      widget={ToastBarChartWidget({
        direction: "vertical",
        data: {
          labels: ["Q1", "Q2", "Q3", "Q4"],
          datasets: [
            { legend: "Budget", values: [120, 135, 140, 150] },
            { legend: "Actual", values: [115, 142, 131, 158] },
          ],
        },
        config: {
          colors: ["#d4d4d4", "#0d9488"],
          bar: { cornerRadius: 4 },
          title: { text: "Budget vs Actual ($K)", visible: true },
        },
        custom: {
          dataLabel: (
            { value, legend }: { value: number; label: string; legend: string },
            context: any,
          ) => {
            if (legend !== "Actual") return Text("", { style: new TextStyle({}) });
            const { font } = context.config;
            return Text(`$${value}K`, {
              style: new TextStyle({
                fontFamily: font.family,
                fontSize: 10,
                fontWeight: "bold",
                color: "#0d9488",
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
