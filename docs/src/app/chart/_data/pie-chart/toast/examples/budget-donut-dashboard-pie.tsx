"use client";

import Widget from "@flitterjs/react";
import { ToastPieChart } from "shared/chart";
import {
  Row,
  Container,
  BoxDecoration,
  SizedBox,
  Text,
  TextStyle,
  EdgeInsets,
  MainAxisAlignment,
  CrossAxisAlignment,
  BorderRadius,
} from "flitter-ui";

const amounts = ["$2.4M", "$1.8M", "$1.2M", "$0.9M", "$0.6M", "$0.3M"];
const colors = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#65a30d", "#94a3b8"];

export default function BudgetDonutDashboardPie() {
  return (
    <Widget
      widget={ToastPieChart({
        data: {
          datasets: [
            { name: "Payroll", value: 42 },
            { name: "Infrastructure", value: 18 },
            { name: "Marketing", value: 15 },
            { name: "R&D", value: 12 },
            { name: "Legal", value: 7 },
            { name: "Misc", value: 6 },
          ],
        },
        config: {
          colors: ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#65a30d", "#94a3b8"],
          legend: {
            position: "right-center",
          },
          pie: {
            innerRadiusRatio: 0.6,
          },
        },
        custom: {
          legend: ({ name, index }: { name: string; index: number }) =>
            Row({
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container({
                  width: 8,
                  height: 8,
                  decoration: new BoxDecoration({
                    color: colors[index],
                    borderRadius: BorderRadius.circular(4),
                  }),
                }),
                SizedBox({ width: 6 }),
                Text(name, {
                  style: new TextStyle({
                    fontSize: 11,
                    color: "#475569",
                  }),
                }),
                SizedBox({ width: 4 }),
                Text(amounts[index], {
                  style: new TextStyle({
                    fontSize: 11,
                    color: "#94a3b8",
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
