import RenderObject from "./RenderObject";
import RenderSliver from "./RenderSliver";
import ScrollController from "../component/ScrollController";
import { Offset, SliverConstraints, type ScrollDirection } from "../type";
import { isHorizontalScroll } from "../type/SliverConstraints";

/** A box viewport. The public Viewport widget provides its rectangular clip. */
export default class RenderViewport extends RenderObject {
  private controller: ScrollController;
  private axis: ScrollDirection;
  private cacheExtent: number;
  private reverse: boolean;
  private listening = false;
  private onScroll = () => this.markNeedsLayout();
  constructor({
    controller,
    axis,
    cacheExtent,
    reverse = false,
  }: {
    controller: ScrollController;
    axis: ScrollDirection;
    cacheExtent: number;
    reverse?: boolean;
  }) {
    super({ isPainter: false });
    this.controller = controller;
    this.axis = axis;
    this.cacheExtent = cacheExtent;
    this.reverse = reverse;
  }
  override attach(element: Parameters<RenderObject["attach"]>[0]) {
    super.attach(element);
    if (!this.listening) this.controller.addListener(this.onScroll);
    this.listening = true;
  }
  override detach() {
    this.controller.removeListener(this.onScroll);
    this.listening = false;
    super.detach();
  }
  override dispose() {
    this.controller.removeListener(this.onScroll);
    this.listening = false;
    super.dispose();
  }
  update(
    controller: ScrollController,
    axis: ScrollDirection,
    cacheExtent: number,
    reverse = false,
  ) {
    if (
      this.controller === controller &&
      this.axis === axis &&
      this.cacheExtent === cacheExtent &&
      this.reverse === reverse
    )
      return;
    if (this.listening) this.controller.removeListener(this.onScroll);
    this.controller = controller;
    if (this.listening) controller.addListener(this.onScroll);
    this.axis = axis;
    this.cacheExtent = cacheExtent;
    this.reverse = reverse;
    this.markNeedsLayout();
  }
  protected override preformLayout(): void {
    if (
      !this.constraints.hasBoundedHeight ||
      !this.constraints.hasBoundedWidth
    ) {
      throw new Error(
        "Viewport requires bounded width and height; wrap it in SizedBox or Expanded",
      );
    }
    this.size = this.constraints.biggest;
    const horizontal = isHorizontalScroll(this.axis);
    const main = horizontal ? this.size.width : this.size.height;
    const cross = horizontal ? this.size.height : this.size.width;
    // A data/viewport resize may clamp the current offset. Reconcile immediately
    // so the first paint already uses the corrected window.
    for (let pass = 0; pass < 3; pass++) {
      const scroll = this.controller.offset;
      const cacheStart = Math.max(0, scroll - this.cacheExtent);
      const cacheEnd = scroll + main + this.cacheExtent;
      let preceding = 0;
      for (const child of this.children) {
        if (!(child instanceof RenderSliver))
          throw new Error("Viewport children must be slivers");
        const localScroll = Math.max(0, scroll - preceding);
        const layoutOffset = Math.max(0, preceding - scroll);
        const localCacheStart = Math.max(0, cacheStart - preceding);
        child.layout(
          new SliverConstraints({
            axisDirection: this.axis,
            reverse: this.reverse,
            scrollOffset: localScroll,
            precedingScrollExtent: preceding,
            crossAxisExtent: cross,
            viewportMainAxisExtent: main,
            remainingPaintExtent: Math.max(0, main - layoutOffset),
            cacheOrigin: localCacheStart - localScroll,
            remainingCacheExtent: Math.max(
              0,
              cacheEnd - Math.max(preceding, cacheStart),
            ),
          }),
          { parentUsesSize: true },
        );
        const mainOffset = this.reverse
          ? main - layoutOffset - child.geometry.paintExtent
          : layoutOffset;
        child.offset = horizontal
          ? new Offset({ x: mainOffset, y: 0 })
          : new Offset({ x: 0, y: mainOffset });
        preceding += child.geometry.scrollExtent;
      }
      if (
        !this.controller.updateMetrics({
          maxScrollExtent: Math.max(0, preceding - main),
          viewportDimension: main,
        })
      )
        break;
    }
  }
}
