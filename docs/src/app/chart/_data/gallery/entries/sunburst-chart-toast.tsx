"use client";

export const galleryTitle = "Organization Structure";

import Widget from "@flitterjs/react";
import { ToastSunburstChart } from "shared/chart";

export function createWidget() {
  return ToastSunburstChart({
        data: {
          nodes: [
            {
              label: "Engineering",
              value: 45,
              children: [
                { label: "Frontend", value: 18, children: [] },
                { label: "Backend", value: 15, children: [] },
                { label: "DevOps", value: 12, children: [] },
              ],
            },
            {
              label: "Product",
              value: 25,
              children: [
                { label: "Design", value: 10, children: [] },
                { label: "Research", value: 8, children: [] },
                { label: "Management", value: 7, children: [] },
              ],
            },
            {
              label: "Operations",
              value: 20,
              children: [
                { label: "HR", value: 8, children: [] },
                { label: "Finance", value: 7, children: [] },
                { label: "Legal", value: 5, children: [] },
              ],
            },
            {
              label: "Sales",
              value: 10,
              children: [
                { label: "Enterprise", value: 6, children: [] },
                { label: "SMB", value: 4, children: [] },
              ],
            },
          ],
        },
        config: {
          title: { text: "Organization Structure", visible: true },
        },
      });
}

export default function SunburstChartToast() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
