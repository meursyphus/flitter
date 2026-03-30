"use client";

import Widget from "@flitterjs/react";
import { ToastLineChart as ToastLineChartWidget } from "shared/chart";

const defaultData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Housing starts (MoM %)", values: [0, 12.38, -15.46, 5.56, -4.98, 0.84, -4.67, 9.96, -2.44, -0.37, -4.22, 16.91] },
    { legend: "Unemployment rate Δ (pp)", values: [0, 11.2, -8.4, 6.9, -5.8, 7.5, -6.2, 4.9, -4.1, 8.1, -5.6, 7.2] },
    { legend: "CPI MoM (1/10 index pts)", values: [0, 12.69, 13.78, 6.78, 1.52, -1.31, 5.25, 4.93, 6.70, 8.99, 8.97, 10.76] },
  ],
};

function ToastLineChart({ spline }: { spline?: boolean }) {
  return (
    <Widget
      widget={ToastLineChartWidget({
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

export function DefaultToastLineChart() {
  return <ToastLineChart />;
}

export function SplineToastLineChart() {
  return (
    <Widget
      widget={ToastLineChartWidget({
        data: defaultData,
        config: {
          colors: ["#6366f1", "#ec4899"],
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

const multiMetricData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Revenue ($K)", values: [120, 135, 128, 142, 155, 148, 162, 170, 165, 178, 185, 195] },
    { legend: "Users (K)", values: [45, 52, 58, 63, 70, 75, 82, 88, 92, 98, 105, 112] },
    { legend: "Conversion (%)", values: [3.2, 3.5, 3.1, 3.8, 4.0, 3.6, 4.2, 4.5, 4.1, 4.6, 4.8, 5.0] },
    { legend: "Churn (%)", values: [2.8, 2.5, 2.9, 2.3, 2.1, 2.4, 2.0, 1.8, 2.2, 1.9, 1.7, 1.5] },
  ],
};

export function MultiMetricToastLineChart() {
  return (
    <Widget
      widget={ToastLineChartWidget({
        data: multiMetricData,
        config: {
          colors: ["#0d9488", "#f59e0b", "#ef4444", "#8b5cf6"],
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

const revenueExpensesData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
  datasets: [
    { legend: "Revenue ($K)", values: [84, 92, 88, 105, 118, 112, 130, 142] },
    { legend: "Expenses ($K)", values: [62, 68, 71, 74, 80, 78, 85, 90] },
  ],
};

export function RevenueExpensesToastLine() {
  return (
    <Widget
      widget={ToastLineChartWidget({
        data: revenueExpensesData,
        config: {
          colors: ["#10b981", "#ef4444"],
          line: {
            strokeWidth: 3,
            spline: false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const serverResponseData = {
  labels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
  datasets: [
    { legend: "p50 (ms)", values: [45, 42, 38, 40, 68, 120, 135, 142, 128, 95, 72, 50] },
    { legend: "p95 (ms)", values: [120, 110, 95, 105, 210, 380, 420, 445, 390, 280, 195, 130] },
    { legend: "p99 (ms)", values: [280, 250, 210, 230, 480, 720, 810, 850, 740, 520, 380, 290] },
  ],
};

export function ServerResponseToastLine() {
  return (
    <Widget
      widget={ToastLineChartWidget({
        data: serverResponseData,
        config: {
          colors: ["#3b82f6", "#f97316", "#dc2626"],
          line: {
            strokeWidth: 1.5,
            spline: true,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const fitnessData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    { legend: "Steps (K)", values: [8.2, 10.5, 7.8, 12.1, 9.4, 15.3, 6.2] },
    { legend: "Calories (100s)", values: [22, 28, 20, 32, 25, 38, 18] },
    { legend: "Distance (km)", values: [5.8, 7.4, 5.5, 8.5, 6.6, 10.8, 4.4] },
  ],
};

export function FitnessTrackerToastLine() {
  return (
    <Widget
      widget={ToastLineChartWidget({
        data: fitnessData,
        config: {
          colors: ["#8b5cf6", "#f59e0b", "#06b6d4"],
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

const temperatureData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Tokyo", values: [5.2, 5.7, 8.7, 13.9, 18.2, 21.4, 25.0, 26.4, 22.8, 17.5, 12.1, 7.6] },
    { legend: "London", values: [4.9, 5.0, 7.2, 9.9, 13.3, 16.4, 18.7, 18.2, 15.5, 11.8, 7.8, 5.4] },
    { legend: "New York", values: [0.6, 1.8, 5.9, 11.7, 17.1, 22.1, 24.9, 24.2, 20.2, 14.0, 8.4, 3.3] },
  ],
};

export function TemperatureTrendToastLine() {
  return (
    <Widget
      widget={ToastLineChartWidget({
        data: temperatureData,
        config: {
          colors: ["#ef4444", "#3b82f6", "#10b981"],
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
