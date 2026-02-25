import MultiChildRenderObject from "../../renderobject/MultiChildRenderObject";
import { Constraints, Offset, Size } from "../../type";
import type { Widget } from "../../widget";
import MultiChildRenderObjectWidget from "../../widget/MultiChildRenderObjectWidget";

export enum DockSlot {
  left = 0,
  bottom = 1,
  corner = 2,
  fill = 3,
}

export default class BaseDockLayout extends MultiChildRenderObjectWidget {
  constructor({ children, key }: { children: Widget[]; key?: any }) {
    super({ children, key });
  }

  createRenderObject(): RenderDockLayout {
    return new RenderDockLayout();
  }

  updateRenderObject(_renderObject: RenderDockLayout): void {}
}

export class RenderDockLayout extends MultiChildRenderObject {
  constructor() {
    super({ isPainter: false });
  }

  protected preformLayout(): void {
    // Expand to fill parent
    this.size = this.constraints.constrain(Size.infinite);

    const left = this.children[DockSlot.left];
    const bottom = this.children[DockSlot.bottom];
    const corner = this.children[DockSlot.corner];
    const fill = this.children[DockSlot.fill];

    // 1. Layout left: tight height, loose width
    left.layout(
      new Constraints({
        minHeight: this.size.height,
        maxHeight: this.size.height,
        maxWidth: this.size.width,
      }),
    );
    const leftWidth = left.size.width;

    // 2. Layout bottom: tight width (total - left.width), loose height
    const bottomWidth = this.size.width - leftWidth;
    bottom.layout(
      new Constraints({
        minWidth: bottomWidth,
        maxWidth: bottomWidth,
        maxHeight: this.size.height,
      }),
    );
    const bottomHeight = bottom.size.height;

    // 3. Layout corner: tight(left.width, bottom.height)
    corner.layout(Constraints.tight(new Size({ width: leftWidth, height: bottomHeight })));

    // 4. Layout fill: tight(total - left.width, total - bottom.height)
    const fillWidth = this.size.width - leftWidth;
    const fillHeight = this.size.height - bottomHeight;
    fill.layout(
      Constraints.tight(new Size({ width: fillWidth, height: fillHeight })),
    );

    // 5. Position children
    left.offset = new Offset({ x: 0, y: 0 });
    fill.offset = new Offset({ x: leftWidth, y: 0 });
    corner.offset = new Offset({ x: 0, y: this.size.height - bottomHeight });
    bottom.offset = new Offset({
      x: leftWidth,
      y: this.size.height - bottomHeight,
    });
  }

  getIntrinsicWidth(height: number): number {
    const left = this.children[DockSlot.left];
    const fill = this.children[DockSlot.fill];
    return left.getIntrinsicWidth(height) + fill.getIntrinsicWidth(height);
  }

  getIntrinsicHeight(width: number): number {
    const bottom = this.children[DockSlot.bottom];
    const fill = this.children[DockSlot.fill];
    return bottom.getIntrinsicHeight(width) + fill.getIntrinsicHeight(width);
  }
}
