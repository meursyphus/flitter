import { State, type BuildContext } from "../element";
import StatefulWidget from "../widget/StatefulWidget";
import type Widget from "../widget/Widget";
import type RenderObject from "../renderobject/RenderObject";
import {
  Axis,
  Matrix4,
  Vector3,
  type EdgeInsets,
  type ScrollDirection,
} from "../type";
import { isHorizontalScroll } from "../type/SliverConstraints";
import { ClampingScrollPhysics, type ScrollPhysics } from "../scroll";
import ScrollController from "./ScrollController";
import SliverList, { type SliverListProps } from "./SliverList";
import SliverPadding from "./SliverPadding";
import Viewport from "./Viewport";
import GestureDetector from "./GestureDetector";

type ListViewOptions = {
  controller?: ScrollController;
  scrollDirection?: ScrollDirection;
  physics?: ScrollPhysics;
  reverse?: boolean;
  padding?: EdgeInsets;
  cacheExtent?: number;
  itemExtent?: number;
  estimatedItemExtent?: number;
  keepAliveCount?: number;
  key?: any;
};
export type ListViewBuilderProps = ListViewOptions & {
  children?: never;
  itemBuilder: SliverListProps["itemBuilder"];
  itemCount: number;
};
export type ListViewProps = ListViewOptions &
  (
    | { children: Widget[]; itemBuilder?: never; itemCount?: never }
    | ListViewBuilderProps
  );

class ListViewWidget extends StatefulWidget {
  constructor(readonly props: ListViewProps) {
    super(props.key);
  }
  createState() {
    return new ListViewState();
  }
}
class ListViewState extends State<ListViewWidget> {
  private ownedController = new ScrollController();
  private defaultPhysics = new ClampingScrollPhysics();
  private dragPosition: number | null = null;
  private cachedWidget?: ListViewWidget;
  private cachedView?: Widget;
  private get controller() {
    return this.widget.props.controller ?? this.ownedController;
  }
  private get physics() {
    return this.widget.props.physics ?? this.defaultPhysics;
  }
  private get horizontal() {
    return isHorizontalScroll(
      this.widget.props.scrollDirection ?? Axis.vertical,
    );
  }
  private scroll(delta: number): boolean {
    const controller = this.controller;
    const target =
      controller.offset + delta * (this.widget.props.reverse ? -1 : 1);
    const next =
      target - this.physics.applyBoundaryConditions(controller, target);
    const previous = controller.offset;
    controller.jumpTo(next);
    return controller.offset !== previous;
  }
  private onWheel = (event: WheelEvent) => {
    if (!this.physics.shouldAcceptUserOffset()) return;
    const delta = this.horizontal ? event.deltaX || event.deltaY : event.deltaY;
    const factor =
      event.deltaMode === 1
        ? 16
        : event.deltaMode === 2
          ? this.controller.viewportDimension
          : 1;
    if (this.scroll(delta * factor)) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  private onDragStart = (event: MouseEvent) => {
    if (
      event.button !== 0 ||
      !this.physics.shouldAcceptUserOffset() ||
      this.controller.maxScrollExtent === 0
    )
      return;
    this.controller.stop();
    this.setState(() => {
      this.dragPosition = this.eventCoordinate(event);
    });
    event.stopPropagation();
  };
  private onDragMove = (event: MouseEvent) => {
    if (this.dragPosition == null || !this.physics.shouldAcceptUserOffset())
      return;
    const position = this.eventCoordinate(event);
    this.scroll(this.dragPosition - position);
    this.setState(() => {
      this.dragPosition = position;
    });
    event.preventDefault();
  };
  private onDragEnd = () =>
    this.setState(() => {
      this.dragPosition = null;
    });

  /** Account for CSS host sizing and ancestor transforms before measuring a drag. */
  private eventCoordinate(event: MouseEvent): number {
    const render = this.element.renderObject;
    const context = render.renderOwner.renderContext;
    const rect = context.view.getBoundingClientRect();
    const { scale, translation } = context.viewPort;
    const point = new Vector3(
      (event.clientX - rect.left) / scale - translation.x,
      (event.clientY - rect.top) / scale - translation.y,
      0,
    );
    const chain: RenderObject[] = [];
    for (let node: RenderObject | undefined = render; node; node = node.parent)
      chain.push(node);
    let matrix = Matrix4.identity();
    for (let index = chain.length - 1; index >= 0; index--) {
      const node = chain[index];
      matrix = matrix.translated(node.offset.x, node.offset.y);
      if (node !== render) matrix = node.applyPaintTransform(matrix);
    }
    const inverse = Matrix4.identity();
    if (inverse.copyInverse(matrix) !== 0) inverse.perspectiveTransform(point);
    return this.horizontal ? point.x : point.y;
  }
  override deactivate(): void {
    this.setState(() => {
      this.dragPosition = null;
    });
    super.deactivate();
  }
  override dispose(): void {
    this.ownedController.dispose();
    super.dispose();
  }
  override build(_context: BuildContext): Widget {
    // Drag bookkeeping does not change the row delegate. Preserve the subtree
    // so pointer movement cannot invalidate variable-size measurements.
    if (this.cachedWidget === this.widget) return this.cachedView!;
    const props = this.widget.props;
    const list = SliverList({
      itemCount: props.children?.length ?? props.itemCount!,
      itemBuilder: props.itemBuilder ?? (index => props.children![index]),
      itemExtent: props.itemExtent,
      estimatedItemExtent: props.estimatedItemExtent,
      keepAliveCount: props.keepAliveCount,
    });
    this.cachedWidget = this.widget;
    this.cachedView = GestureDetector({
      cursor: "default",
      onWheel: this.onWheel,
      onDragStart: this.onDragStart,
      onDragMove: this.onDragMove,
      onDragEnd: this.onDragEnd,
      child: Viewport({
        controller: this.controller,
        scrollDirection: props.scrollDirection,
        cacheExtent: props.cacheExtent,
        reverse: props.reverse,
        slivers: [
          props.padding
            ? SliverPadding({ padding: props.padding, sliver: list })
            : list,
        ],
      }),
    });
    return this.cachedView!;
  }
}
function ListView(props: ListViewProps): Widget {
  return new ListViewWidget(props);
}
ListView.builder = (props: ListViewBuilderProps): Widget =>
  new ListViewWidget(props);
export default ListView;
