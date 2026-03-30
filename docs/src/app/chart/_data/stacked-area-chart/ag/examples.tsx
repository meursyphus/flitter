"use client";

import Widget from "@flitterjs/react";
import { StackedAreaChart } from "shared/chart";

const defaultData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Organic", values: [400, 450, 420, 480, 520, 510, 550, 530, 560, 600, 620, 650] },
    { legend: "Direct", values: [200, 220, 210, 230, 250, 240, 260, 255, 270, 290, 300, 310] },
    { legend: "Social", values: [100, 120, 130, 140, 160, 155, 170, 165, 180, 200, 210, 220] },
    { legend: "Referral", values: [50, 60, 55, 65, 70, 75, 80, 78, 85, 90, 95, 100] },
  ],
};

function AgStackedAreaChart({ data, config = {} }: { data: typeof defaultData; config?: Record<string, any> }) {
  return (
    <Widget
      widget={StackedAreaChart({
        data,
        config,
      })}
      width="100%"
      height="100%"
    />
  );
}

export function DefaultAgStackedAreaChart() {
  return <AgStackedAreaChart data={defaultData} />;
}

const resourceAllocationData = {
  labels: ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5", "Sprint 6", "Sprint 7", "Sprint 8"],
  datasets: [
    { legend: "Development", values: [45, 50, 48, 52, 55, 50, 53, 56] },
    { legend: "QA", values: [15, 18, 20, 22, 20, 25, 22, 24] },
    { legend: "Design", values: [12, 10, 8, 10, 12, 8, 10, 8] },
    { legend: "DevOps", values: [8, 10, 12, 10, 8, 12, 10, 12] },
  ],
};

export function ResourceAllocationStackedArea() {
  return <AgStackedAreaChart data={resourceAllocationData} config={{ colors: { fills: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"], strokes: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"] }, area: { opacity: 0.5 } }} />;
}

const cloudCostData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Compute", values: [4200, 4400, 4600, 4800, 5100, 5400, 5700, 5500, 5800, 6000, 6300, 6600] },
    { legend: "Storage", values: [1800, 1900, 2000, 2100, 2200, 2350, 2500, 2600, 2750, 2900, 3050, 3200] },
    { legend: "Network", values: [900, 950, 1000, 1050, 1100, 1200, 1300, 1250, 1350, 1400, 1500, 1600] },
    { legend: "Database", values: [1500, 1550, 1600, 1650, 1700, 1800, 1900, 1950, 2000, 2100, 2200, 2300] },
  ],
};

export function CloudCostAgStackedArea() {
  return <AgStackedAreaChart data={cloudCostData} config={{ colors: { fills: ["#0ea5e9", "#f97316", "#8b5cf6", "#10b981"], strokes: ["#0ea5e9", "#f97316", "#8b5cf6", "#10b981"] }, area: { opacity: 0.45 }, grid: { dash: [4, 4] } }} />;
}

const teamVelocityData = {
  labels: ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5", "Sprint 6", "Sprint 7", "Sprint 8", "Sprint 9", "Sprint 10"],
  datasets: [
    { legend: "Frontend", values: [28, 32, 30, 35, 38, 36, 40, 42, 38, 44] },
    { legend: "Backend", values: [35, 38, 40, 42, 45, 43, 48, 46, 50, 52] },
    { legend: "Mobile", values: [18, 20, 22, 24, 26, 25, 28, 30, 32, 34] },
  ],
};

export function TeamVelocityAgStackedArea() {
  return <AgStackedAreaChart data={teamVelocityData} config={{ colors: { fills: ["#6366f1", "#ec4899", "#f59e0b"], strokes: ["#6366f1", "#ec4899", "#f59e0b"] }, area: { opacity: 0.55, spline: true, strokeWidth: 1.5 } }} />;
}

const marketShareData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Chrome", values: [64, 63.8, 63.5, 63.2, 63, 62.8, 62.5, 62.3, 62, 61.8, 61.5, 61.2] },
    { legend: "Safari", values: [19, 19.2, 19.5, 19.8, 20, 20.3, 20.5, 20.8, 21, 21.3, 21.5, 21.8] },
    { legend: "Firefox", values: [8, 7.9, 7.8, 7.7, 7.6, 7.5, 7.4, 7.3, 7.2, 7.1, 7, 6.9] },
    { legend: "Edge", values: [5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 6, 6.1] },
  ],
};

export function MarketShareAgStackedArea() {
  return <AgStackedAreaChart data={marketShareData} config={{ colors: { fills: ["#ef4444", "#3b82f6", "#f59e0b", "#10b981"], strokes: ["#ef4444", "#3b82f6", "#f59e0b", "#10b981"] }, area: { opacity: 0.6 }, background: "#fafafa" }} />;
}
