"use client";

import Widget from "@flitterjs/react";
import { ToastStackedAreaChart as ToastStackedAreaChartWidget } from "shared/chart";

const defaultData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Organic", values: [400, 450, 420, 480, 520, 510, 550, 530, 560, 600, 620, 650] },
    { legend: "Direct", values: [200, 220, 210, 230, 250, 240, 260, 255, 270, 290, 300, 310] },
    { legend: "Social", values: [100, 120, 130, 140, 160, 155, 170, 165, 180, 200, 210, 220] },
    { legend: "Referral", values: [50, 60, 55, 65, 70, 75, 80, 78, 85, 90, 95, 100] },
  ],
};

function ToastStackedAreaChart({ data, config = {} }: { data: typeof defaultData; config?: Record<string, any> }) {
  return (
    <Widget
      widget={ToastStackedAreaChartWidget({
        data,
        config,
      })}
      width="100%"
      height="100%"
    />
  );
}

export function DefaultToastStackedAreaChart() {
  return <ToastStackedAreaChart data={defaultData} />;
}

const trafficSourceData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Search", values: [3200, 3400, 3600, 3900, 4100, 4300, 4500, 4200, 4600, 4800, 5000, 5200] },
    { legend: "Social Media", values: [800, 950, 1100, 1300, 1500, 1800, 2000, 2200, 1900, 1700, 1600, 1400] },
    { legend: "Email", values: [600, 580, 620, 650, 700, 680, 720, 710, 750, 780, 800, 820] },
    { legend: "Direct", values: [1200, 1250, 1300, 1280, 1350, 1400, 1380, 1420, 1450, 1500, 1520, 1550] },
  ],
};

export function TrafficSourceStackedArea() {
  return <ToastStackedAreaChart data={trafficSourceData} config={{ colors: ["#3b82f6", "#f97316", "#10b981", "#8b5cf6"], area: { opacity: 0.5 } }} />;
}

const revenueStreamData = {
  labels: ["Q1 '23", "Q2 '23", "Q3 '23", "Q4 '23", "Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24"],
  datasets: [
    { legend: "Subscriptions", values: [4200, 4500, 4800, 5100, 5500, 5900, 6300, 6800] },
    { legend: "Licensing", values: [1800, 1900, 2000, 2200, 2100, 2300, 2500, 2700] },
    { legend: "Services", values: [900, 1000, 1100, 1200, 1300, 1400, 1500, 1600] },
    { legend: "Hardware", values: [600, 550, 500, 700, 650, 600, 750, 800] },
  ],
};

export function RevenueStreamStackedArea() {
  return <ToastStackedAreaChart data={revenueStreamData} config={{ colors: ["#0d9488", "#d97706", "#ec4899", "#64748b"], area: { opacity: 0.4, strokeWidth: 1.5 } }} />;
}

const energyMixData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Solar", values: [120, 140, 180, 240, 310, 380, 400, 370, 290, 210, 150, 110] },
    { legend: "Wind", values: [280, 260, 240, 220, 200, 180, 170, 190, 230, 270, 290, 300] },
    { legend: "Gas", values: [350, 340, 310, 280, 250, 230, 220, 225, 260, 300, 330, 360] },
    { legend: "Nuclear", values: [400, 400, 395, 405, 400, 410, 405, 400, 398, 402, 400, 405] },
  ],
};

export function EnergyMixToastStackedArea() {
  return <ToastStackedAreaChart data={energyMixData} config={{ colors: ["#eab308", "#22c55e", "#64748b", "#a855f7"], area: { opacity: 0.55, spline: true } }} />;
}

const appUsageData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "iOS", values: [4500, 4700, 4900, 5200, 5500, 5800, 6100, 6000, 5900, 6200, 6500, 6800] },
    { legend: "Android", values: [5200, 5400, 5700, 6000, 6400, 6700, 7000, 6900, 6800, 7100, 7400, 7800] },
    { legend: "Web", values: [2800, 2900, 3000, 3100, 3200, 3100, 2900, 2800, 3100, 3300, 3500, 3600] },
  ],
};

export function AppUsageToastStackedArea() {
  return <ToastStackedAreaChart data={appUsageData} config={{ colors: ["#3b82f6", "#10b981", "#f59e0b"], area: { opacity: 0.45, strokeWidth: 2.5 } }} />;
}

const supportTicketsData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Bug Reports", values: [85, 78, 92, 88, 75, 70, 65, 72, 80, 68, 62, 58] },
    { legend: "Feature Requests", values: [45, 52, 48, 55, 60, 65, 70, 68, 72, 78, 82, 88] },
    { legend: "Questions", values: [120, 115, 108, 100, 95, 90, 88, 85, 82, 78, 75, 70] },
    { legend: "Billing", values: [30, 28, 32, 35, 30, 28, 25, 27, 30, 32, 28, 25] },
  ],
};

export function SupportTicketsToastStackedArea() {
  return <ToastStackedAreaChart data={supportTicketsData} config={{ colors: ["#ef4444", "#6366f1", "#06b6d4", "#f59e0b"], area: { opacity: 0.35 } }} />;
}
