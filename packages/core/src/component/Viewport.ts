import RenderObjectWidget from "../widget/RenderObjectWidget";
import RenderViewport from "../renderobject/RenderViewport";
import ScrollController from "./ScrollController";
import ClipRect from "./ClipRect";
import { Axis, Rect, type ScrollDirection } from "../type";
import type Widget from "../widget/Widget";

export type ViewportProps = {
  slivers: Widget[];
  controller: ScrollController;
  scrollDirection?: ScrollDirection;
  cacheExtent?: number;
  reverse?: boolean;
  key?: any;
};
class ViewportWidget extends RenderObjectWidget {
  readonly props: ViewportProps;
  constructor(props: ViewportProps) {
    super({ children: props.slivers, key: props.key });
    this.props = props;
  }
  override createRenderObject(): RenderViewport {
    return new RenderViewport({
      controller: this.props.controller,
      axis: this.props.scrollDirection ?? Axis.vertical,
      cacheExtent: this.props.cacheExtent ?? 250,
      reverse: this.props.reverse,
    });
  }
  override updateRenderObject(render: RenderViewport): void {
    render.update(
      this.props.controller,
      this.props.scrollDirection ?? Axis.vertical,
      this.props.cacheExtent ?? 250,
      this.props.reverse,
    );
  }
}
const viewportClip = (size: { width: number; height: number }) =>
  Rect.fromLTWH({ left: 0, top: 0, width: size.width, height: size.height });

/** Compose slivers in a clipped viewport; scrolling is controlled externally. */
export default function Viewport(props: ViewportProps): Widget {
  if (
    props.cacheExtent != null &&
    (!Number.isFinite(props.cacheExtent) || props.cacheExtent < 0)
  ) {
    throw new RangeError("cacheExtent must be finite and non-negative");
  }
  return ClipRect({
    key: props.key,
    clipper: viewportClip,
    child: new ViewportWidget(props),
  });
}
