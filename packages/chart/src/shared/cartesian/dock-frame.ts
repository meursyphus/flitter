import {
  Constraints,
  MultiChildRenderObject,
  MultiChildRenderObjectWidget,
  Offset,
  Size,
  SizedBox,
  type Widget,
} from "flitter-core";

enum DockSlot {
  left = 0,
  right = 1,
  bottom = 2,
  leftCorner = 3,
  rightCorner = 4,
  fill = 5,
}

class BaseDockFrame extends MultiChildRenderObjectWidget {
  constructor({ children, key }: { children: Widget[]; key?: any }) {
    super({ children, key });
  }

  createRenderObject(): RenderDockFrame {
    return new RenderDockFrame();
  }

  updateRenderObject(_renderObject: RenderDockFrame): void {}
}

class RenderDockFrame extends MultiChildRenderObject {
  constructor() {
    super({ isPainter: false });
  }

  override get sizedByParent(): boolean {
    return true;
  }

  protected override performResize(): void {
    this.size = this.constraints.constrain(Size.infinite);
  }

  protected override computeDryLayout(constraints: Constraints): Size {
    return constraints.constrain(Size.infinite);
  }

  protected preformLayout(): void {
    const left = this.children[DockSlot.left];
    const right = this.children[DockSlot.right];
    const bottom = this.children[DockSlot.bottom];
    const leftCorner = this.children[DockSlot.leftCorner];
    const rightCorner = this.children[DockSlot.rightCorner];
    const fill = this.children[DockSlot.fill];

    bottom.layout(
      new Constraints({
        maxWidth: this.size.width,
        maxHeight: this.size.height,
      }),
      { parentUsesSize: true },
    );
    const bottomHeight = bottom.size.height;
    const sideHeight = Math.max(0, this.size.height - bottomHeight);

    left.layout(
      new Constraints({
        minHeight: sideHeight,
        maxHeight: sideHeight,
        maxWidth: this.size.width,
      }),
      { parentUsesSize: true },
    );
    right.layout(
      new Constraints({
        minHeight: sideHeight,
        maxHeight: sideHeight,
        maxWidth: this.size.width,
      }),
      { parentUsesSize: true },
    );

    const leftWidth = left.size.width;
    const rightWidth = right.size.width;
    const fillWidth = Math.max(0, this.size.width - leftWidth - rightWidth);
    const fillHeight = Math.max(0, this.size.height - bottomHeight);

    bottom.layout(
      new Constraints({
        minWidth: fillWidth,
        maxWidth: fillWidth,
        maxHeight: this.size.height,
      }),
      { parentUsesSize: false },
    );

    leftCorner.layout(
      Constraints.tight(new Size({ width: leftWidth, height: bottomHeight })),
      { parentUsesSize: false },
    );
    rightCorner.layout(
      Constraints.tight(new Size({ width: rightWidth, height: bottomHeight })),
      { parentUsesSize: false },
    );
    fill.layout(
      Constraints.tight(new Size({ width: fillWidth, height: fillHeight })),
      { parentUsesSize: false },
    );

    left.offset = new Offset({ x: 0, y: 0 });
    fill.offset = new Offset({ x: leftWidth, y: 0 });
    right.offset = new Offset({ x: leftWidth + fillWidth, y: 0 });
    leftCorner.offset = new Offset({ x: 0, y: this.size.height - bottomHeight });
    bottom.offset = new Offset({
      x: leftWidth,
      y: this.size.height - bottomHeight,
    });
    rightCorner.offset = new Offset({
      x: leftWidth + fillWidth,
      y: this.size.height - bottomHeight,
    });
  }

  protected override computeIntrinsicWidth(height: number): number {
    const left = this.children[DockSlot.left];
    const right = this.children[DockSlot.right];
    const fill = this.children[DockSlot.fill];
    return (
      left.getIntrinsicWidth(height) +
      fill.getIntrinsicWidth(height) +
      right.getIntrinsicWidth(height)
    );
  }

  protected override computeIntrinsicHeight(width: number): number {
    const bottom = this.children[DockSlot.bottom];
    const fill = this.children[DockSlot.fill];
    return bottom.getIntrinsicHeight(width) + fill.getIntrinsicHeight(width);
  }
}

export function DockFrame({
  left,
  right,
  bottom,
  leftCorner,
  rightCorner,
  fill,
  key,
}: {
  left?: Widget;
  right?: Widget;
  bottom?: Widget;
  leftCorner?: Widget;
  rightCorner?: Widget;
  fill: Widget;
  key?: any;
}): Widget {
  const empty = SizedBox.shrink();

  return new BaseDockFrame({
    children: [
      left ?? empty,
      right ?? empty,
      bottom ?? empty,
      leftCorner ?? empty,
      rightCorner ?? empty,
      fill,
    ],
    key,
  });
}
