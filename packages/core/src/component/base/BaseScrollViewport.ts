import type { RenderObjectElement } from "../../element";
import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import { Axis, Constraints, Offset, Size } from "../../type";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";
import type ScrollController from "../ScrollController";

type Props = {
  child: Widget;
  controller: ScrollController;
  scrollDirection: Axis;
  reverse: boolean;
};

export default class BaseScrollViewport extends SingleChildRenderObjectWidget {
  constructor(readonly props: Props) {
    super({ child: props.child });
  }
  override createRenderObject(): RenderScrollViewport {
    return new RenderScrollViewport(this.props);
  }
  override updateRenderObject(render: RenderScrollViewport): void {
    render.update(this.props);
  }
}

export class RenderScrollViewport extends SingleChildRenderObject {
  private inLayout = false;
  constructor(private props: Props) {
    super({ isPainter: false });
  }
  private changed = () => {
    if (!this.inLayout) this.markNeedsLayout();
  };
  override attach(owner: RenderObjectElement): void {
    super.attach(owner);
    this.props.controller.addListener(this.changed);
  }
  update(props: Props): void {
    if (this.props.controller !== props.controller) {
      this.props.controller.removeListener(this.changed);
      props.controller.addListener(this.changed);
    }
    this.props = props;
    this.markNeedsLayout();
  }
  override dispose(): void {
    this.props.controller.removeListener(this.changed);
    super.dispose();
  }
  protected override preformLayout(): void {
    const vertical = this.props.scrollDirection === Axis.vertical;
    const extent = vertical
      ? this.constraints.maxHeight
      : this.constraints.maxWidth;
    if (!Number.isFinite(extent))
      throw new Error(
        "SingleChildScrollView requires bounded constraints along its scroll axis.",
      );
    const constraints = vertical
      ? new Constraints({
          minWidth: this.constraints.minWidth,
          maxWidth: this.constraints.maxWidth,
        })
      : new Constraints({
          minHeight: this.constraints.minHeight,
          maxHeight: this.constraints.maxHeight,
        });
    this.child?.layout(constraints, { parentUsesSize: true });
    const content = this.child?.size ?? Size.zero;
    this.size = this.constraints.constrain(
      new Size({
        width: vertical ? content.width : extent,
        height: vertical ? extent : content.height,
      }),
    );
    const viewport = vertical ? this.size.height : this.size.width;
    const max = Math.max(
      0,
      (vertical ? content.height : content.width) - viewport,
    );
    this.inLayout = true;
    try {
      this.props.controller.updateMetrics({
        minScrollExtent: 0,
        maxScrollExtent: max,
        viewportDimension: viewport,
      });
    } finally {
      this.inLayout = false;
    }
    const offset = this.props.reverse
      ? viewport -
        (vertical ? content.height : content.width) +
        this.props.controller.offset
      : -this.props.controller.offset;
    if (this.child)
      this.child.offset = new Offset({
        x: vertical ? 0 : offset,
        y: vertical ? offset : 0,
      });
  }
}
