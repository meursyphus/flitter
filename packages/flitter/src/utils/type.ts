export type PaintContext = {
  createSvgEl: (tagName: keyof SVGElementTagNameMap) => SVGElement;
  appendSvgEl: (el: SVGElement) => void;
  insertSvgEl: (el: SVGElement, index: number) => void;
  isOnBrowser: boolean;
};

export type VoidCallback = () => void;
export type Nullable = undefined | null;
