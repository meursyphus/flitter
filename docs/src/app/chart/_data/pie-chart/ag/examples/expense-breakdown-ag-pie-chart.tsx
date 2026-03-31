"use client";

import Widget from "@flitterjs/react";
import { PieChart } from "shared/chart";
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

const amounts = ["$1,800", "$650", "$500", "$420", "$350", "$300", "$280", "$200"];
const colors = ["#1e40af", "#b45309", "#059669", "#7c3aed", "#dc2626", "#0d9488", "#64748b", "#94a3b8"];

export default function ExpenseBreakdownAgPieChart() {
  return (
    <Widget
      widget={PieChart({
        data: {
          datasets: [
            { name: "Housing", value: 1800 },
            { name: "Food", value: 650 },
            { name: "Savings", value: 500 },
            { name: "Transport", value: 420 },
            { name: "Healthcare", value: 350 },
            { name: "Education", value: 300 },
            { name: "Utilities", value: 280 },
            { name: "Fun", value: 200 },
          ],
        },
        config: {
          colors: { fills: colors },
          pie: {
            innerRadiusRatio: 0.45,
          },
          dataLabel: { visible: false },
          legend: {
            visible: true,
            position: "right-center",
          },
        },
        custom: {
          legend: ({ name, index }: any) =>
            Row({
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container({
                  width: 12,
                  height: 12,
                  decoration: new BoxDecoration({
                    color: colors[index],
                    borderRadius: BorderRadius.circular(2),
                  }),
                }),
                SizedBox({ width: 8 }),
                Text(name, {
                  style: new TextStyle({
                    fontSize: 11,
                    color: "#334155",
                  }),
                }),
                SizedBox({ width: 6 }),
                Text(amounts[index], {
                  style: new TextStyle({
                    fontSize: 11,
                    color: "#64748b",
                    fontWeight: "600",
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
