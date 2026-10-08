/** Layout results sent from a sliver back to its viewport. */
export default class SliverGeometry {
  readonly scrollExtent: number;
  readonly paintExtent: number;
  readonly layoutExtent: number;
  readonly maxPaintExtent: number;
  readonly cacheExtent: number;
  readonly hasVisualOverflow: boolean;
  static readonly zero = Object.freeze(new SliverGeometry());
  constructor({
    scrollExtent = 0,
    paintExtent = 0,
    layoutExtent = paintExtent,
    maxPaintExtent = scrollExtent,
    cacheExtent = paintExtent,
    hasVisualOverflow = false,
  }: {
    scrollExtent?: number;
    paintExtent?: number;
    layoutExtent?: number;
    maxPaintExtent?: number;
    cacheExtent?: number;
    hasVisualOverflow?: boolean;
  } = {}) {
    if (
      ![
        scrollExtent,
        paintExtent,
        layoutExtent,
        maxPaintExtent,
        cacheExtent,
      ].every(n => Number.isFinite(n) && n >= 0) ||
      layoutExtent > paintExtent ||
      paintExtent > maxPaintExtent
    ) {
      throw new RangeError("Invalid sliver geometry");
    }
    this.scrollExtent = scrollExtent;
    this.paintExtent = paintExtent;
    this.layoutExtent = layoutExtent;
    this.maxPaintExtent = maxPaintExtent;
    this.cacheExtent = cacheExtent;
    this.hasVisualOverflow = hasVisualOverflow;
  }
}
