import type { FunnelStage } from "../types";

export type FunnelAppearance = {
  funnel: {
    gap: number;
    widthRatio: number;
    dimOpacity: number;
    strokeColor: string;
    strokeWidth: number;
    hoverBorderColor: string;
    hoverBorderWidth: number;
    hoverShadowColor: string;
  };
  dataLabel: {
    visible: boolean;
    color: string;
    fontSize: number;
    formatter: (stage: FunnelStage) => string;
  };
};

export const defaultFunnelAppearance: FunnelAppearance = {
  funnel: {
    gap: 3,
    widthRatio: 0.64,
    dimOpacity: 0.35,
    strokeColor: "transparent",
    strokeWidth: 0,
    hoverBorderColor: "white",
    hoverBorderWidth: 4,
    hoverShadowColor: "rgba(0,0,0,0.25)",
  },
  dataLabel: {
    visible: true,
    color: "#585858",
    fontSize: 13,
    formatter: ({ label, value, percentage }) =>
      `${label}\n${value.toLocaleString("en-US")} · ${percentage.toFixed(1)}%`,
  },
};
