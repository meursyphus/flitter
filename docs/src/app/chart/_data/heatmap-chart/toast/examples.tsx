"use client";

import Widget from "@flitterjs/react";
import { ToastHeatmapChart } from "shared/chart";

const defaultData = {
  xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  values: [
    [2, 5, 8, 12, 18, 24, 28, 30, 25, 16, 9, 4],
    [3, 6, 9, 13, 19, 25, 29, 31, 26, 17, 10, 5],
    [4, 7, 11, 15, 21, 27, 32, 34, 28, 19, 12, 6],
    [5, 8, 12, 16, 22, 28, 33, 35, 29, 20, 13, 7],
    [4, 7, 10, 14, 20, 26, 31, 33, 27, 18, 11, 6],
    [3, 5, 8, 11, 17, 23, 27, 29, 24, 15, 9, 4],
    [2, 4, 7, 10, 16, 22, 26, 28, 23, 14, 8, 3],
  ],
};

export function BasicHeatmapChart() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: defaultData,
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}

const serverLoadData = {
  xLabels: ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"],
  yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  values: [
    [12, 8, 5, 15, 65, 82, 78, 85, 80, 72, 45, 20],
    [10, 7, 4, 18, 70, 88, 82, 90, 85, 68, 42, 18],
    [14, 9, 6, 20, 72, 85, 80, 88, 82, 70, 48, 22],
    [11, 8, 5, 17, 68, 80, 75, 82, 78, 65, 40, 19],
    [15, 10, 7, 22, 75, 90, 85, 92, 88, 74, 50, 25],
    [8, 5, 3, 10, 25, 35, 40, 38, 32, 28, 20, 12],
    [6, 4, 2, 8, 18, 28, 32, 30, 25, 22, 15, 9],
  ],
};

export function ServerLoadHeatmap() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: serverLoadData,
        config: {
          heatmap: { colorRange: ["#dbeafe", "#3b82f6", "#1e3a5f"], segment: { gap: 2 } },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const correlationData = {
  xLabels: ["Rev", "Users", "Sess", "Bounce", "Dur", "Pages"],
  yLabels: ["Rev", "Users", "Sess", "Bounce", "Dur", "Pages"],
  values: [
    [100, 85, 78, -45, 62, 70],
    [85, 100, 92, -52, 58, 75],
    [78, 92, 100, -60, 65, 82],
    [-45, -52, -60, 100, -38, -55],
    [62, 58, 65, -38, 100, 72],
    [70, 75, 82, -55, 72, 100],
  ],
};

export function CorrelationMatrixHeatmap() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: correlationData,
        config: {
          heatmap: { colorRange: ["#3b82f6", "#f5f5f5", "#ef4444"], segment: { gap: 1 } },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const activityData = {
  xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  values: [
    [3, 0, 5, 2, 8, 1, 0, 4, 6, 9, 2, 1],
    [0, 7, 3, 0, 2, 5, 1, 0, 8, 3, 0, 4],
    [5, 2, 0, 6, 1, 0, 9, 3, 2, 0, 7, 2],
    [1, 0, 4, 3, 0, 8, 2, 7, 0, 5, 1, 0],
    [0, 3, 1, 0, 5, 2, 0, 1, 4, 0, 3, 6],
    [2, 1, 0, 0, 1, 0, 3, 0, 1, 2, 0, 0],
    [0, 0, 1, 0, 0, 2, 0, 0, 0, 1, 0, 0],
  ],
};

export function GithubActivityHeatmap() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: activityData,
        config: {
          heatmap: { colorRange: ["#ebedf0", "#40c463", "#216e39"], segment: { gap: 2 } },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const salesByRegionData = {
  xLabels: ["Elec", "Cloth", "Food", "Furn", "Sports", "Books"],
  yLabels: ["NA", "EU", "APAC", "LATAM", "ME"],
  values: [
    [420, 280, 350, 180, 220, 150],
    [380, 310, 290, 160, 190, 200],
    [510, 260, 400, 120, 170, 130],
    [180, 220, 310, 90, 140, 80],
    [150, 170, 250, 110, 200, 60],
  ],
};

export function SalesByRegionHeatmap() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: salesByRegionData,
        config: {
          heatmap: { colorRange: ["#fef3c7", "#f59e0b", "#92400e"] },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const websiteClicksData = {
  xLabels: ["Head", "Hero", "Feat", "Price", "Review", "Foot"],
  yLabels: ["6am", "9am", "12pm", "3pm", "6pm", "9pm", "12am"],
  values: [
    [5, 12, 8, 3, 2, 4],
    [22, 45, 35, 28, 15, 10],
    [30, 55, 48, 42, 20, 12],
    [25, 50, 40, 38, 18, 11],
    [18, 38, 30, 22, 12, 8],
    [10, 25, 18, 15, 8, 6],
    [3, 8, 5, 2, 1, 2],
  ],
};

export function WebsiteClicksHeatmap() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: websiteClicksData,
        config: {
          heatmap: { colorRange: ["#f5f3ff", "#8b5cf6", "#4c1d95"], segment: { gap: 1 } },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const classroomAttendanceData = {
  xLabels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
  yLabels: ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"],
  values: [
    [100, 100, 80, 100, 100, 60, 100, 100],
    [80, 60, 100, 80, 100, 100, 80, 60],
    [100, 100, 100, 100, 80, 100, 100, 100],
    [60, 80, 100, 40, 80, 100, 60, 80],
    [100, 100, 100, 100, 100, 100, 80, 100],
    [80, 100, 60, 80, 100, 80, 100, 100],
  ],
};

export function ClassroomAttendanceHeatmap() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: classroomAttendanceData,
        config: {
          heatmap: { colorRange: ["#fecaca", "#fbbf24", "#22c55e"], segment: { gap: 2 } },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const energyUsageData = {
  xLabels: ["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"],
  yLabels: ["Kitchen", "Living", "Bed", "Office", "Garage"],
  values: [
    [30, 80, 60, 90, 50, 70, 95, 40, 15],
    [10, 20, 30, 25, 35, 40, 65, 80, 50],
    [5, 5, 10, 8, 12, 15, 20, 45, 70],
    [5, 60, 75, 50, 80, 70, 30, 10, 5],
    [15, 25, 10, 8, 12, 20, 35, 15, 5],
  ],
};

export function EnergyUsageHeatmap() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: energyUsageData,
        config: {
          heatmap: { colorRange: ["#ecfdf5", "#10b981", "#064e3b"] },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const skillMatrixData = {
  xLabels: ["React", "Node.js", "Python", "SQL", "Docker", "AWS"],
  yLabels: ["Alice", "Bob", "Charlie", "Diana", "Eve"],
  values: [
    [90, 70, 60, 80, 50, 65],
    [75, 95, 40, 85, 80, 70],
    [50, 60, 95, 70, 85, 90],
    [85, 55, 75, 90, 40, 50],
    [70, 80, 80, 60, 90, 85],
  ],
};

export function SkillMatrixHeatmap() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: skillMatrixData,
        config: {
          heatmap: { colorRange: ["#fef9c3", "#f97316", "#dc2626"], segment: { gap: 1 } },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}

const customerJourneyData = {
  xLabels: ["Aware", "Consider", "Decide", "Buy", "Retain"],
  yLabels: ["Organic", "Social", "Email", "Ads", "Referral"],
  values: [
    [85, 60, 40, 25, 50],
    [70, 55, 30, 18, 35],
    [30, 45, 65, 55, 70],
    [90, 50, 35, 20, 15],
    [40, 60, 55, 45, 65],
  ],
};

export function CustomerJourneyHeatmap() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: customerJourneyData,
        config: {
          heatmap: { colorRange: ["#e0f2fe", "#0ea5e9", "#0c4a6e"], segment: { gap: 2 } },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
