"use client";

import Widget from "@flitterjs/react";
import { LineChart } from "shared/chart";

const defaultData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Housing starts (MoM %)", values: [0, 12.38, -15.46, 5.56, -4.98, 0.84, -4.67, 9.96, -2.44, -0.37, -4.22, 16.91] },
    { legend: "Unemployment rate Δ (pp)", values: [0, 11.2, -8.4, 6.9, -5.8, 7.5, -6.2, 4.9, -4.1, 8.1, -5.6, 7.2] },
    { legend: "CPI MoM (1/10 index pts)", values: [0, 12.69, 13.78, 6.78, 1.52, -1.31, 5.25, 4.93, 6.70, 8.99, 8.97, 10.76] },
  ],
};

function AgLineChart({ spline }: { spline?: boolean }) {
  return (
    <Widget
      widget={LineChart({
        data: defaultData,
        config: {
          line: {
            strokeWidth: 2,
            spline: spline ?? false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

export function DefaultAgLineChart() {
  return <AgLineChart />;
}

export function SplineAgLineChart() {
  return (
    <Widget
      widget={LineChart({
        data: defaultData,
        config: {
          colors: { fills: ["#7c3aed", "#06b6d4"], strokes: ["#7c3aed", "#06b6d4"] },
          grid: { dash: [4, 4] },
          line: {
            strokeWidth: 2,
            spline: true,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const stockPriceData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "AAPL", values: [185, 190, 178, 195, 188, 210, 225, 218, 230, 222, 240, 248] },
    { legend: "GOOGL", values: [140, 145, 138, 150, 155, 162, 158, 170, 175, 168, 180, 188] },
    { legend: "MSFT", values: [375, 382, 370, 390, 398, 410, 420, 415, 430, 425, 440, 455] },
  ],
};

export function StockPriceAgLineChart() {
  return (
    <Widget
      widget={LineChart({
        data: stockPriceData,
        config: {
          colors: { fills: ["#2563eb", "#dc2626", "#059669"], strokes: ["#2563eb", "#dc2626", "#059669"] },
          background: "#fafafa",
          grid: { dash: [2, 2] },
          line: {
            strokeWidth: 2,
            spline: false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const webAnalyticsData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Pageviews (K)", values: [320, 345, 380, 410, 395, 430, 465, 490, 475, 510, 540, 580] },
    { legend: "Sessions (K)", values: [180, 195, 215, 230, 220, 245, 260, 275, 265, 290, 305, 325] },
    { legend: "Bounce Rate (%)", values: [42, 40, 38, 36, 37, 34, 32, 30, 31, 29, 28, 26] },
  ],
};

export function WebAnalyticsAgLine() {
  return (
    <Widget
      widget={LineChart({
        data: webAnalyticsData,
        config: {
          colors: { fills: ["#0ea5e9", "#f97316", "#a855f7"], strokes: ["#0ea5e9", "#f97316", "#a855f7"] },
          legend: { position: "right-top" },
          line: {
            strokeWidth: 2,
            spline: false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const monthlySalesData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Electronics", values: [95, 88, 102, 110, 98, 115, 128, 135, 120, 140, 165, 190] },
    { legend: "Clothing", values: [65, 58, 72, 80, 85, 90, 78, 70, 88, 95, 110, 130] },
    { legend: "Home & Garden", values: [40, 35, 48, 62, 75, 82, 88, 85, 70, 55, 42, 38] },
  ],
};

export function MonthlySalesAgLine() {
  return (
    <Widget
      widget={LineChart({
        data: monthlySalesData,
        config: {
          colors: { fills: ["#059669", "#d97706", "#e11d48"], strokes: ["#059669", "#d97706", "#e11d48"] },
          line: {
            strokeWidth: 2.5,
            spline: true,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const cryptoTrendData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "BTC ($K)", values: [42.5, 44.8, 40.2, 38.5, 36.1, 31.2, 29.8, 24.5, 19.8, 20.5, 16.8, 16.5] },
    { legend: "ETH ($K)", values: [3.2, 3.0, 2.8, 2.9, 2.1, 1.8, 1.6, 1.5, 1.3, 1.4, 1.2, 1.2] },
    { legend: "SOL ($)", values: [170, 105, 95, 100, 50, 38, 35, 33, 32, 30, 14, 12] },
  ],
};

export function CryptoTrendAgLine() {
  return (
    <Widget
      widget={LineChart({
        data: cryptoTrendData,
        config: {
          colors: { fills: ["#f7931a", "#627eea", "#9945ff"], strokes: ["#f7931a", "#627eea", "#9945ff"] },
          background: "#111827",
          title: { color: "#e5e7eb" },
          axis: { label: { color: "#9ca3af" }, color: "#374151" },
          grid: { color: "#1f2937" },
          legend: { color: "#d1d5db" },
          line: {
            strokeWidth: 2,
            spline: false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
