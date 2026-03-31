"use client";

import Widget from "@flitterjs/react";
import { ScatterChart } from "shared/chart";

export default function CustomerSatisfactionAg() {
  return (
    <Widget
      widget={ScatterChart({
        data: {
          datasets: [
            {
              legend: "Software",
              data: [
                { x: 49, y: 4.2, label: "Notion" },
                { x: 99, y: 4.5, label: "Figma" },
                { x: 29, y: 3.8, label: "Trello" },
                { x: 199, y: 4.7, label: "Salesforce" },
                { x: 79, y: 4.1, label: "Slack" },
              ],
            },
            {
              legend: "Hardware",
              data: [
                { x: 999, y: 4.3, label: "MacBook" },
                { x: 1299, y: 4.6, label: "iPhone" },
                { x: 699, y: 3.9, label: "Galaxy" },
                { x: 349, y: 4.0, label: "Pixel" },
                { x: 1499, y: 4.4, label: "Surface" },
              ],
            },
            {
              legend: "Services",
              data: [
                { x: 15, y: 4.1, label: "Netflix" },
                { x: 10, y: 3.5, label: "Spotify" },
                { x: 12, y: 3.9, label: "Disney+" },
                { x: 20, y: 4.3, label: "YouTube Premium" },
                { x: 8, y: 3.2, label: "Hulu" },
              ],
            },
            {
              legend: "Food Delivery",
              data: [
                { x: 25, y: 3.6, label: "DoorDash" },
                { x: 20, y: 3.4, label: "Uber Eats" },
                { x: 18, y: 3.8, label: "Grubhub" },
                { x: 30, y: 3.5, label: "Instacart" },
              ],
            },
          ],
        },
        config: {
          scatter: { size: 11, strokeWidth: 2 },
          colors: {
            fills: ["#0d9488", "#e11d48", "#2563eb", "#d97706"],
            strokes: ["#0d9488", "#e11d48", "#2563eb", "#d97706"],
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
