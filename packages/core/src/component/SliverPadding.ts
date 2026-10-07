import { EdgeInsets, Offset, SliverConstraints } from "../type";
import { isHorizontalScroll } from "../type/SliverConstraints";
import RenderSliver from "../renderobject/RenderSliver";
import RenderObjectWidget from "../widget/RenderObjectWidget";
import type Widget from "../widget/Widget";

class SliverPaddingWidget extends RenderObjectWidget {
  constructor(
    readonly padding: EdgeInsets,
    child: Widget,
    key?: any,
  ) {
    super({ children: [child], key });
  }
  override createRenderObject() {
    return new RenderSliverPadding(this.padding);
  }
  override updateRenderObject(render: RenderSliverPadding) {
    render.update(this.padding);
  }
}
class RenderSliverPadding extends RenderSliver {
  constructor(private padding: EdgeInsets) {
    super();
  }
  update(padding: EdgeInsets) {
    if (this.padding.equals(padding)) return;
    this.padding = padding;
    this.markNeedsLayout();
  }
  protected override preformLayout(): void {
    const child = this.children[0];
    if (!(child instanceof RenderSliver))
      throw new Error("SliverPadding requires a sliver child");
    const c = this.sliverConstraints;
    const horizontal = isHorizontalScroll(c.axisDirection);
    const padding = this.padding;
    const before = horizontal ? padding.left : padding.top;
    const after = horizontal ? padding.right : padding.bottom;
    const leading = c.reverse ? after : before;
    const trailing = c.reverse ? before : after;
    const childScroll = Math.max(0, c.scrollOffset - leading);
    const layoutOffset = Math.max(0, leading - c.scrollOffset);
    const cacheStart = c.scrollOffset + c.cacheOrigin;
    const childCacheStart = Math.max(0, cacheStart - leading);
    child.layout(
      new SliverConstraints({
        axisDirection: c.axisDirection,
        reverse: c.reverse,
        scrollOffset: childScroll,
        precedingScrollExtent: c.precedingScrollExtent + leading,
        viewportMainAxisExtent: c.viewportMainAxisExtent,
        crossAxisExtent: Math.max(
          0,
          c.crossAxisExtent -
            (horizontal ? padding.vertical : padding.horizontal),
        ),
        remainingPaintExtent: Math.max(
          0,
          c.remainingPaintExtent - layoutOffset,
        ),
        cacheOrigin: childCacheStart - childScroll,
        remainingCacheExtent: Math.max(
          0,
          c.remainingCacheExtent - Math.max(0, leading - cacheStart),
        ),
      }),
      { parentUsesSize: true },
    );
    this.setGeometry(leading + child.geometry.scrollExtent + trailing);
    const main = c.reverse
      ? this.geometry.paintExtent - layoutOffset - child.geometry.paintExtent
      : layoutOffset;
    child.offset = horizontal
      ? new Offset({ x: main, y: padding.top })
      : new Offset({ x: padding.left, y: main });
  }
}

/** Padding participates in sliver scroll geometry instead of shrinking the viewport. */
export default function SliverPadding({
  padding,
  sliver,
  key,
}: {
  padding: EdgeInsets;
  sliver: Widget;
  key?: any;
}): Widget {
  if (
    ![padding.left, padding.right, padding.top, padding.bottom].every(
      n => Number.isFinite(n) && n >= 0,
    )
  ) {
    throw new RangeError("Sliver padding must be finite and non-negative");
  }
  return new SliverPaddingWidget(padding, sliver, key);
}
