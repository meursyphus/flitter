export type SankeyAppearance = {
  sankey: { labelColor: string; labelFontSize: number; outline: boolean };
};
export const defaultSankeyAppearance: SankeyAppearance["sankey"] = {
  labelColor: "#333333",
  labelFontSize: 13,
  outline: false,
};
