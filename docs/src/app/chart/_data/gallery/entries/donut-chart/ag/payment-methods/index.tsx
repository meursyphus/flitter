"use client";

export const galleryTitle = "Payment Methods";

import Widget from "@flitterjs/react";
import { DonutChart } from "shared/chart";

export function createWidget() {
  return DonutChart({
        data: {
          datasets: [
            { name: "Credit Card", value: 35 },
            { name: "Digital Wallet", value: 28 },
            { name: "Bank Transfer", value: 16 },
            { name: "Debit Card", value: 12 },
            { name: "Cash", value: 5 },
            { name: "Other", value: 4 },
          ],
        },
        config: {
          radial: { visible: true },
          dataLabel: { visible: true },
          dataCenter: { visible: true },
          legend: { visible: false },
        },
      });
}

export default function DonutChartAgPaymentMethods() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
