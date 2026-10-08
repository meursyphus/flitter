import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import { Constraints, Size } from "../../type";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

export type ViewerGeometry = { viewport: Size; scene: Size };
type Props = { child: Widget; constrained: boolean; geometry: ViewerGeometry };

export default class BaseInteractiveViewport extends SingleChildRenderObjectWidget {
  constructor(readonly props: Props) {
    super({ child: props.child });
  }
  override createRenderObject(): RenderInteractiveViewport {
    return new RenderInteractiveViewport(this.props);
  }
  override updateRenderObject(render: RenderInteractiveViewport): void {
    render.update(this.props);
  }
}

class RenderInteractiveViewport extends SingleChildRenderObject {
  constructor(private props: Props) {
    super({ isPainter: false });
  }
  update(props: Props): void {
    this.props = props;
    this.markNeedsLayout();
  }
  protected override preformLayout(): void {
    if (
      !Number.isFinite(this.constraints.maxWidth) ||
      !Number.isFinite(this.constraints.maxHeight)
    ) {
      throw new Error("InteractiveViewer requires bounded width and height.");
    }
    this.size = this.constraints.biggest;
    this.child?.layout(
      this.props.constrained ? this.constraints : new Constraints(),
      { parentUsesSize: true },
    );
    this.props.geometry.viewport = this.size;
    this.props.geometry.scene = this.child?.size ?? Size.zero;
    if (
      !Number.isFinite(this.props.geometry.scene.width) ||
      !Number.isFinite(this.props.geometry.scene.height)
    ) {
      throw new Error(
        "InteractiveViewer's unconstrained child must have a finite size.",
      );
    }
  }
}
