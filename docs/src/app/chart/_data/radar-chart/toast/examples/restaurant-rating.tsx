"use client";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";
import { Container, BoxDecoration, EdgeInsets, BorderRadius, Text, TextStyle, SizedBox } from "flitter-ui";

export default function RestaurantRatingRadar() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: {
          labels: ["Food", "Service", "Ambiance", "Value", "Location"],
          datasets: [
            { legend: "Chez Marie", values: [95, 88, 92, 65, 78] },
            { legend: "Tokyo Ramen", values: [90, 72, 68, 92, 85] },
            { legend: "Burger Joint", values: [78, 80, 55, 95, 90] },
          ],
        },
        custom: {
          title: (_args: any, context: any) => {
            const { title } = context.config;
            if (!title.visible || !title.text) return SizedBox.shrink();
            return Container({
              padding: EdgeInsets.symmetric({ horizontal: 14, vertical: 6 }),
              decoration: new BoxDecoration({
                color: "#fef3c7",
                borderRadius: BorderRadius.circular(20),
              }),
              child: Text(title.text, {
                style: new TextStyle({
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#92400e",
                }),
              }),
            });
          },
        },
        config: {
          title: { text: "🍽 Dining Guide", visible: true, alignment: "center" },
          colors: ["#d97706", "#dc2626", "#059669"],
          radar: { fillOpacity: 0.3, strokeWidth: 2 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
