"use client";

import Widget from "@flitterjs/react";
import {
  Container,
  BoxDecoration,
  Border,
  BorderSide,
  EdgeInsets,
  Text,
  TextStyle,
} from "flitter-ui";
import { BarChart } from "shared/chart";

export default function ExecutiveRevenueAg() {
  return (
    <Widget
      widget={BarChart({
        direction: "vertical",
        data: {
          labels: ["Oct", "Nov", "Dec"],
          datasets: [
            { legend: "Product", values: [4.8, 5.2, 6.1] },
            { legend: "Services", values: [2.1, 2.4, 2.9] },
            { legend: "Licensing", values: [1.3, 1.1, 1.5] },
          ],
        },
        custom: {
          title: () =>
            Container({
              padding: EdgeInsets.only({ bottom: 8 }),
              decoration: new BoxDecoration({
                border: new Border({
                  bottom: new BorderSide({ color: "#0d9488", width: 2 }),
                }),
              }),
              child: Text("Q4 Revenue", {
                style: new TextStyle({
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#1e293b",
                }),
              }),
            }),
        },
        config: {
          background: "#fafafa",
          colors: { fills: ["#2563eb", "#7c3aed", "#e879f9"] },
          title: { text: "Q4 Revenue", visible: true },
          subtitle: { text: "Breakdown by stream ($M)", visible: true },
          legend: { position: "right-top" },
          bar: { cornerRadius: 4 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
