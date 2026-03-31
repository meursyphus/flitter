"use client";

import Widget from "@flitterjs/react";
import { ToastStackedBarChart as ToastStackedBarChartWidget } from "shared/chart";
import {
  Container,
  BoxDecoration,
  EdgeInsets,
  BorderRadius,
  Text,
  TextStyle,
  Column,
  MainAxisSize,
  CrossAxisAlignment,
  SizedBox,
} from "flitter-ui";

export default function BudgetAllocationToast() {
  return (
    <Widget
      widget={ToastStackedBarChartWidget({
        direction: "horizontal",
        data: {
          labels: ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"],
          datasets: [
            { legend: "Engineering", values: [450, 480, 520, 550] },
            { legend: "Marketing", values: [200, 220, 210, 240] },
            { legend: "Sales", values: [180, 190, 200, 210] },
            { legend: "Operations", values: [120, 130, 125, 140] },
          ],
        },
        config: {
          colors: ["#2563eb", "#dc2626", "#059669", "#d97706"],
          bar: { gap: 2 },
          title: { text: "Budget Allocation", visible: true },
        },
        custom: {
          title: (
            _args: undefined,
            context: any,
          ) => {
            const { font, title } = context.config;
            return Container({
              padding: EdgeInsets.symmetric({ horizontal: 12, vertical: 6 }),
              decoration: new BoxDecoration({
                color: "#eff6ff",
                borderRadius: BorderRadius.circular(6),
              }),
              child: Column({
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Budget Allocation ($K)", {
                    style: new TextStyle({
                      fontFamily: title.fontFamily ?? font.family,
                      fontSize: title.fontSize,
                      fontWeight: "700",
                      color: "#1e40af",
                    }),
                  }),
                  SizedBox({ height: 2 }),
                  Text("Quarterly department spend breakdown", {
                    style: new TextStyle({
                      fontFamily: font.family,
                      fontSize: 11,
                      color: "#3b82f6",
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
