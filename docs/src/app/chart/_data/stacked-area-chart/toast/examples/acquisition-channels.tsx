"use client";

import Widget from "@flitterjs/react";
import { ToastStackedAreaChart as ToastStackedAreaChartWidget } from "shared/chart";
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

const colors = ["#2563eb", "#f97316", "#10b981"];
const latestValues = ["3.2K", "2.0K", "1.2K"];

export default function AcquisitionChannelsToast() {
  return (
    <Widget
      widget={ToastStackedAreaChartWidget({
        data: {
          labels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"],
          datasets: [
            { legend: "Organic", values: [1800, 2100, 2400, 2700, 3000, 3200] },
            { legend: "Paid", values: [1200, 1400, 1100, 1600, 1800, 2000] },
            { legend: "Referral", values: [600, 750, 900, 850, 1000, 1150] },
          ],
        },
        config: {
          title: { text: "Acquisition Channels", visible: true },
          colors: ["#2563eb", "#f97316", "#10b981"],
          area: { opacity: 0.45 },
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
                Text(latestValues[index] ?? "", {
                  style: new TextStyle({
                    fontSize: 11,
                    color: colors[index],
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
