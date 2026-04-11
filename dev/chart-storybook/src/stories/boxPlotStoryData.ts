export const boxPlotLatencyData = {
  labels: ["Search", "Catalog", "Checkout", "Uploads", "Billing"],
  datasets: [
    {
      legend: "Baseline",
      data: [
        { min: 82, q1: 96, median: 108, q3: 124, max: 141, outliers: [168] },
        { min: 62, q1: 70, median: 76, q3: 84, max: 92 },
        { min: 118, q1: 145, median: 172, q3: 208, max: 246, outliers: [286] },
        { min: 98, q1: 120, median: 136, q3: 170, max: 210, outliers: [244] },
        { min: 74, q1: 82, median: 90, q3: 98, max: 112, outliers: [54] },
      ],
    },
    {
      legend: "Peak Traffic",
      data: [
        { min: 94, q1: 116, median: 132, q3: 154, max: 182, outliers: [214] },
        { min: 70, q1: 80, median: 88, q3: 98, max: 110, outliers: [124] },
        { min: 140, q1: 176, median: 214, q3: 260, max: 318, outliers: [370] },
        { min: 112, q1: 138, median: 160, q3: 198, max: 242, outliers: [276] },
        { min: 80, q1: 92, median: 102, q3: 118, max: 134, outliers: [148] },
      ],
    },
  ],
};

export const boxPlotStoryTitle = "API Latency Distribution by Endpoint";
