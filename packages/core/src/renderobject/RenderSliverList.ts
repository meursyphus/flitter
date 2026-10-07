import RenderSliver from "./RenderSliver";
import type RenderObject from "./RenderObject";
import { Offset } from "../type";
import { isHorizontalScroll } from "../type/SliverConstraints";

export interface SliverChildManager {
  createChild(index: number): RenderObject;
  collectGarbage(first: number, last: number): void;
}

/** Variable-sized rows keep measured offsets; fixed rows use O(1) index math. */
export default class RenderSliverList extends RenderSliver {
  private itemCount: number;
  private itemExtent?: number;
  private estimatedItemExtent: number;
  private offsets = [0];
  private previousCrossExtent = -1;
  private previousAxis: unknown;

  constructor({
    itemCount,
    itemExtent,
    estimatedItemExtent = 50,
  }: {
    itemCount: number;
    itemExtent?: number;
    estimatedItemExtent?: number;
  }) {
    super();
    this.itemCount = itemCount;
    this.itemExtent = itemExtent;
    this.estimatedItemExtent = estimatedItemExtent;
  }
  update(
    itemCount: number,
    itemExtent: number | undefined,
    estimatedItemExtent: number,
  ): void {
    this.itemCount = itemCount;
    this.itemExtent = itemExtent;
    this.estimatedItemExtent = estimatedItemExtent;
    // Builders may change data or row heights without changing itemCount.
    this.offsets = [0];
    this.markNeedsLayout();
  }
  private get manager(): SliverChildManager {
    return this.ownerElement as unknown as SliverChildManager;
  }
  protected override preformLayout(): void {
    const c = this.sliverConstraints;
    const horizontal = isHorizontalScroll(c.axisDirection);
    if (
      c.crossAxisExtent !== this.previousCrossExtent ||
      horizontal !== this.previousAxis
    ) {
      this.offsets = [0];
      this.previousCrossExtent = c.crossAxisExtent;
      this.previousAxis = horizontal;
    }
    const start = c.scrollOffset + c.cacheOrigin;
    const end = start + c.remainingCacheExtent;
    const boxConstraints = c.asBoxConstraints(this.itemExtent);
    let first = this.itemCount;
    let last = -1;
    if (
      c.remainingCacheExtent > 0 &&
      c.crossAxisExtent > 0 &&
      c.viewportMainAxisExtent > 0
    ) {
      if (this.itemExtent != null) {
        first = Math.min(this.itemCount, Math.floor(start / this.itemExtent));
        last = Math.min(
          this.itemCount - 1,
          Math.ceil(end / this.itemExtent) - 1,
        );
        for (let index = first; index <= last; index++) {
          const child = this.manager.createChild(index);
          child.layout(boxConstraints, { parentUsesSize: true });
          this.positionChild(
            child,
            index * this.itemExtent - c.scrollOffset,
            horizontal,
          );
        }
      } else {
        let index = this.findIndex(start);
        let offset = this.offsets[index];
        while (index < this.itemCount && offset < end) {
          const child = this.manager.createChild(index);
          child.layout(boxConstraints, { parentUsesSize: true });
          const extent = horizontal ? child.size.width : child.size.height;
          if (!Number.isFinite(extent) || extent < 0)
            throw new Error(
              "SliverList rows require finite, non-negative extents",
            );
          const next = offset + extent;
          if (this.offsets[index + 1] !== next) {
            this.offsets.length = index + 1;
            this.offsets.push(next);
          }
          if (next > start) {
            first = Math.min(first, index);
            last = index;
            this.positionChild(child, offset - c.scrollOffset, horizontal);
          } else {
            // Unknown variable extents must be measured to locate a distant
            // offset, but those transient elements never accumulate in memory.
            this.manager.collectGarbage(index + 1, this.itemCount - 1);
          }
          offset = next;
          index++;
        }
      }
    }
    this.manager.collectGarbage(first, last);
    const measured = this.offsets.length - 1;
    const total =
      this.itemExtent != null
        ? this.itemCount * this.itemExtent
        : measured === this.itemCount
          ? this.offsets[measured]
          : this.offsets[measured] +
            (this.itemCount - measured) *
              (measured > 0
                ? Math.max(1, this.offsets[measured] / measured)
                : this.estimatedItemExtent);
    this.setGeometry(total);
    if (c.reverse) {
      for (const child of this.children) {
        const main = horizontal ? child.offset.x : child.offset.y;
        const extent = horizontal ? child.size.width : child.size.height;
        this.positionChild(
          child,
          this.geometry.paintExtent - main - extent,
          horizontal,
        );
      }
    }
  }
  private findIndex(offset: number): number {
    let low = 0;
    let high = this.offsets.length - 1;
    while (low < high) {
      const middle = Math.ceil((low + high) / 2);
      if (this.offsets[middle] <= offset) low = middle;
      else high = middle - 1;
    }
    return Math.min(low, this.itemCount);
  }
  private positionChild(
    child: RenderObject,
    main: number,
    horizontal: boolean,
  ): void {
    child.offset = horizontal
      ? new Offset({ x: main, y: 0 })
      : new Offset({ x: 0, y: main });
  }
}

export class RenderSliverFixedExtentList extends RenderSliverList {
  constructor(props: { itemCount: number; itemExtent: number }) {
    super(props);
  }
}
