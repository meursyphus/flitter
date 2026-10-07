import RenderObject from "./RenderObject";
import {
  Size,
  SliverConstraints,
  SliverGeometry,
  type Constraints,
} from "../type";
import { isHorizontalScroll } from "../type/SliverConstraints";

export default class RenderSliver extends RenderObject {
  geometry: SliverGeometry = SliverGeometry.zero;
  constructor() {
    super({ isPainter: false });
  }
  get sliverConstraints(): SliverConstraints {
    return this.constraints as SliverConstraints;
  }
  override layout(
    constraints: Constraints,
    options: { parentUsesSize?: boolean } = {},
  ) {
    if (!(constraints instanceof SliverConstraints))
      throw new Error("Slivers must be placed inside a Viewport");
    super.layout(constraints, options);
  }
  protected setGeometry(scrollExtent: number): void {
    const c = this.sliverConstraints;
    const paintExtent = Math.max(
      0,
      Math.min(scrollExtent - c.scrollOffset, c.remainingPaintExtent),
    );
    const cacheExtent = Math.max(
      0,
      Math.min(
        scrollExtent - c.scrollOffset - c.cacheOrigin,
        c.remainingCacheExtent,
      ),
    );
    this.geometry = new SliverGeometry({
      scrollExtent,
      paintExtent,
      cacheExtent,
      hasVisualOverflow: c.scrollOffset > 0 || scrollExtent > paintExtent,
    });
    this.size = isHorizontalScroll(c.axisDirection)
      ? new Size({ width: paintExtent, height: c.crossAxisExtent })
      : new Size({ width: c.crossAxisExtent, height: paintExtent });
  }
}
