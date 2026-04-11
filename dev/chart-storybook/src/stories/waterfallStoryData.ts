export const transferBridgeRows = [
  { player: "Zidane Iqbal", amount: 1.0 },
  { player: "Andre Onana", amount: -64.2 },
  { player: "Anthony Elanga", amount: 17.5 },
  { player: "Fred", amount: 9.74 },
  { player: "Dean Henderson", amount: 17.5 },
  { player: "Altay Bayindir", amount: -5.0 },
];

export const operatingBridgeRows = [
  { lineItem: "Starting ARR", amount: 82.4 },
  { lineItem: "Expansion", amount: 18.6 },
  { lineItem: "Churn", amount: -9.2 },
  { lineItem: "Services", amount: 6.1 },
  { lineItem: "Hosting", amount: -7.8 },
  { lineItem: "Payroll", amount: -24.5 },
  { lineItem: "Efficiency", amount: 4.2 },
  { lineItem: "Tax", amount: -5.6 },
];

export const operatingBridgeTotals = [
  { totalType: "subtotal" as const, index: 3, axisLabel: "Gross Margin" },
  { totalType: "subtotal" as const, index: 6, axisLabel: "Operating Profit" },
  { totalType: "total" as const, index: 7, axisLabel: "Net Income" },
];

export function formatMillions(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  const abs = Math.abs(value);
  const fixed = abs >= 100 ? abs.toFixed(0) : abs >= 10 ? abs.toFixed(1) : abs.toFixed(2);
  return `${sign}£${fixed}M`;
}

export function axisMoneyLabel(name: string, _index: number, axis: "x" | "y") {
  if (axis === "x") return name;
  const numeric = Number(name);
  if (!Number.isFinite(numeric)) return name;
  const sign = numeric < 0 ? "-" : "";
  const abs = Math.abs(numeric);
  const fixed = abs >= 100 ? abs.toFixed(0) : abs >= 10 ? abs.toFixed(1) : abs.toFixed(2);
  return `${sign}£${fixed}M`;
}
