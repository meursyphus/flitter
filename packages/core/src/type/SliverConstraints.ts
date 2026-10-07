import Constraints from "./_types/_constraints";
import { Axis } from "./_types/_etc";

export type ScrollDirection = Axis | "vertical" | "horizontal";
export const isHorizontalScroll = (axis: ScrollDirection) =>
  axis === Axis.horizontal || axis === "horizontal";

/** The visible and cached window a viewport asks a sliver to supply. */
export default class SliverConstraints extends Constraints {
  readonly axisDirection: ScrollDirection;
  readonly reverse: boolean;
  readonly scrollOffset: number;
  readonly precedingScrollExtent: number;
  readonly remainingPaintExtent: number;
  readonly remainingCacheExtent: number;
  readonly cacheOrigin: number;
  readonly crossAxisExtent: number;
  readonly viewportMainAxisExtent: number;

  constructor({
    axisDirection = Axis.vertical,
    reverse = false,
    scrollOffset = 0,
    precedingScrollExtent = 0,
    remainingPaintExtent = 0,
    remainingCacheExtent = remainingPaintExtent,
    cacheOrigin = 0,
    crossAxisExtent,
    viewportMainAxisExtent,
  }: {
    axisDirection?: ScrollDirection;
    reverse?: boolean;
    scrollOffset?: number;
    precedingScrollExtent?: number;
    remainingPaintExtent?: number;
    remainingCacheExtent?: number;
    cacheOrigin?: number;
    crossAxisExtent: number;
    viewportMainAxisExtent: number;
  }) {
    super();
    if (
      ![
        scrollOffset,
        precedingScrollExtent,
        remainingPaintExtent,
        remainingCacheExtent,
        crossAxisExtent,
        viewportMainAxisExtent,
      ].every(n => Number.isFinite(n) && n >= 0) ||
      !Number.isFinite(cacheOrigin) ||
      cacheOrigin > 0 ||
      cacheOrigin < -scrollOffset
    ) {
      throw new RangeError("Invalid sliver constraints");
    }
    this.axisDirection = axisDirection;
    this.reverse = reverse;
    this.scrollOffset = scrollOffset;
    this.precedingScrollExtent = precedingScrollExtent;
    this.remainingPaintExtent = remainingPaintExtent;
    this.remainingCacheExtent = remainingCacheExtent;
    this.cacheOrigin = cacheOrigin;
    this.crossAxisExtent = crossAxisExtent;
    this.viewportMainAxisExtent = viewportMainAxisExtent;
  }

  override normalize(): SliverConstraints {
    return this;
  }
  override equals(other: Constraints): boolean {
    return (
      other instanceof SliverConstraints &&
      this.axisDirection === other.axisDirection &&
      this.reverse === other.reverse &&
      this.scrollOffset === other.scrollOffset &&
      this.precedingScrollExtent === other.precedingScrollExtent &&
      this.remainingPaintExtent === other.remainingPaintExtent &&
      this.remainingCacheExtent === other.remainingCacheExtent &&
      this.cacheOrigin === other.cacheOrigin &&
      this.crossAxisExtent === other.crossAxisExtent &&
      this.viewportMainAxisExtent === other.viewportMainAxisExtent
    );
  }

  asBoxConstraints(itemExtent?: number): Constraints {
    return isHorizontalScroll(this.axisDirection)
      ? new Constraints({
          minHeight: this.crossAxisExtent,
          maxHeight: this.crossAxisExtent,
          minWidth: itemExtent ?? 0,
          maxWidth: itemExtent ?? Infinity,
        })
      : new Constraints({
          minWidth: this.crossAxisExtent,
          maxWidth: this.crossAxisExtent,
          minHeight: itemExtent ?? 0,
          maxHeight: itemExtent ?? Infinity,
        });
  }
}
