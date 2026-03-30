"use client";

import Widget from "@flitterjs/react";
import { StackedBarChart } from "shared/chart";

const defaultData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    { legend: "North America", values: [120, 135, 110, 145, 160, 150, 170] },
    { legend: "Europe", values: [90, 85, 100, 95, 110, 105, 120] },
    { legend: "Asia Pacific", values: [65, 80, 75, 90, 85, 95, 100] },
  ],
};

const negativeData = {
  labels: ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25", "Q3 '25"],
  datasets: [
    { legend: "Product A", values: [-20, 15, -5, 30, -10, 25, 8] },
    { legend: "Product B", values: [10, -12, 22, -8, 18, -15, 30] },
    { legend: "Product C", values: [5, -25, 12, 20, -18, 10, -7] },
  ],
};

function AgStackedBarChart({
  direction,
  data,
  config = {},
}: {
  direction: "vertical" | "horizontal";
  data: typeof defaultData;
  config?: Record<string, any>;
}) {
  return (
    <Widget
      widget={StackedBarChart({
        direction,
        data,
        config,
      })}
      width="100%"
      height="100%"
    />
  );
}

export function VerticalAgStackedBarChart() {
  return <AgStackedBarChart direction="vertical" data={defaultData} />;
}

export function HorizontalAgStackedBarChart() {
  return <AgStackedBarChart direction="horizontal" data={defaultData} config={{ colors: { fills: ["#6366f1", "#ec4899", "#10b981"], strokes: ["#6366f1", "#ec4899", "#10b981"] } }} />;
}

export function NegativeVerticalAgStackedBarChart() {
  return <AgStackedBarChart direction="vertical" data={negativeData} config={{ colors: { fills: ["#059669", "#dc2626", "#3b82f6"], strokes: ["#059669", "#dc2626", "#3b82f6"] }, grid: { dash: [4, 4] } }} />;
}

export function NegativeHorizontalAgStackedBarChart() {
  return <AgStackedBarChart direction="horizontal" data={negativeData} />;
}

const revenueByProductData = {
  labels: ["Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023", "Q1 2024", "Q2 2024"],
  datasets: [
    { legend: "SaaS Platform", values: [850, 920, 980, 1050, 1120, 1200] },
    { legend: "Mobile App", values: [320, 380, 420, 460, 510, 560] },
    { legend: "API Services", values: [180, 210, 240, 280, 320, 370] },
  ],
};

export function RevenueByProductAgStacked() {
  return <AgStackedBarChart direction="vertical" data={revenueByProductData} config={{ colors: { fills: ["#0d9488", "#d97706", "#7c3aed"], strokes: ["#0d9488", "#d97706", "#7c3aed"] }, background: "#fafafa" }} />;
}

const surveyResponsesData = {
  labels: ["Work-Life Balance", "Compensation", "Growth", "Culture", "Leadership"],
  datasets: [
    { legend: "Strongly Agree", values: [45, 28, 38, 52, 35] },
    { legend: "Agree", values: [30, 32, 28, 25, 30] },
    { legend: "Neutral", values: [15, 20, 18, 12, 18] },
    { legend: "Disagree", values: [10, 20, 16, 11, 17] },
  ],
};

export function SurveyResponsesAgStacked() {
  return <AgStackedBarChart direction="horizontal" data={surveyResponsesData} config={{ colors: { fills: ["#22c55e", "#86efac", "#fcd34d", "#f87171"], strokes: ["#22c55e", "#86efac", "#fcd34d", "#f87171"] } }} />;
}

const projectTimelineData = {
  labels: ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5", "Sprint 6"],
  datasets: [
    { legend: "Design", values: [24, 16, 12, 20, 14, 10] },
    { legend: "Development", values: [40, 56, 64, 48, 60, 72] },
    { legend: "QA", values: [8, 16, 20, 24, 18, 22] },
    { legend: "Deploy", values: [4, 8, 6, 8, 10, 8] },
  ],
};

export function ProjectTimelineAgStacked() {
  return <AgStackedBarChart direction="vertical" data={projectTimelineData} config={{ colors: { fills: ["#8b5cf6", "#3b82f6", "#f59e0b", "#ef4444"], strokes: ["#8b5cf6", "#3b82f6", "#f59e0b", "#ef4444"] }, grid: { dash: [2, 2] } }} />;
}
