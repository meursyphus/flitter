"use client";

export const galleryTitle = "Smartphone Market Share";

import Widget from "@flitterjs/react";
import { ToastPieChart } from "shared/chart";

export function createWidget() {
  return ToastPieChart({
        data: {
          datasets: [
            { name: "Apple", value: 27 },
            { name: "Samsung", value: 21 },
            { name: "Xiaomi", value: 14 },
            { name: "Oppo", value: 10 },
            { name: "Vivo", value: 8 },
            { name: "Others", value: 20 },
          ],
        },
        config: {
          title: { text: "Smartphone Market Share", visible: true },
        },
      });
}

export default function PieChartToast() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
