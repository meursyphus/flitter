"use client";

import Widget from "@flitterjs/react";
import {
  Container,
  BoxDecoration,
  EdgeInsets,
  Text,
  TextStyle,
  BorderRadius,
} from "flitter-ui";
import { ToastBubbleChart as ToastBubbleChartWidget } from "shared/chart";

export default function MarketOpportunityToastBubble() {
  return (
    <Widget
      widget={ToastBubbleChartWidget({
        data: {
          datasets: [
            {
              legend: "Enterprise",
              data: [
                { x: 520, y: 12, value: 4800, label: "ERP Systems" },
                { x: 340, y: 18, value: 3200, label: "CRM Platforms" },
                { x: 180, y: 25, value: 1500, label: "HR Tech" },
              ],
            },
            {
              legend: "Consumer",
              data: [
                { x: 680, y: 8, value: 6200, label: "E-commerce" },
                { x: 420, y: 22, value: 2800, label: "Streaming" },
                { x: 150, y: 35, value: 900, label: "EdTech" },
              ],
            },
            {
              legend: "Infrastructure",
              data: [
                { x: 290, y: 15, value: 5500, label: "Cloud Infra" },
                { x: 110, y: 40, value: 1200, label: "Edge Computing" },
                { x: 200, y: 20, value: 2100, label: "DevOps Tools" },
              ],
            },
          ],
        },
        custom: {
          dataLabel: ({ label }: { label?: string }) =>
            Container({
              padding: EdgeInsets.symmetric({ horizontal: 4, vertical: 1 }),
              decoration: new BoxDecoration({
                color: "rgba(255, 255, 255, 0.85)",
                borderRadius: BorderRadius.circular(3),
              }),
              child: Text(label ?? "", {
                style: new TextStyle({
                  fontSize: 9,
                  color: "#334155",
                  fontWeight: "600",
                }),
              }),
            }),
        },
        config: {
          title: { text: "Market Sizing", visible: true },
          legend: { position: "right-center" },
          bubble: { minRadius: 10, maxRadius: 50, opacity: 0.55 },
          colors: ["#1e40af", "#9333ea", "#0891b2"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
