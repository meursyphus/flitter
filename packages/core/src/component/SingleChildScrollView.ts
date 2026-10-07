import { State, type BuildContext } from "../element";
import { Axis, type EdgeInsets, type Offset } from "../type";
import { ClampingScrollPhysics, type ScrollPhysics } from "../scroll";
import { StatefulWidget, type Widget } from "../widget";
import { classToFunction } from "../utils";
import ScrollController from "./ScrollController";
import GestureDetector from "./GestureDetector";
import ClipRect from "./ClipRect";
import Padding from "./Padding";
import BaseScrollViewport from "./base/BaseScrollViewport";
import {
  eventPosition,
  viewportClipper,
  wheelPixels,
  type ViewportClip,
} from "./base/viewport-utils";

export type SingleChildScrollViewProps = {
  child: Widget;
  scrollDirection?: Axis;
  controller?: ScrollController;
  physics?: ScrollPhysics;
  reverse?: boolean;
  padding?: EdgeInsets;
  clipBehavior?: ViewportClip;
  key?: any;
};

class SingleChildScrollView extends StatefulWidget {
  constructor(readonly props: SingleChildScrollViewProps) {
    super(props.key);
  }
  override createState(): State<SingleChildScrollView> {
    return new ScrollViewState();
  }
}

class ScrollViewState extends State<SingleChildScrollView> {
  private ownedController = new ScrollController();
  private dragPosition?: Offset;
  private defaultPhysics = new ClampingScrollPhysics();
  private get controller() {
    return this.widget.props.controller ?? this.ownedController;
  }
  private get physics() {
    return this.widget.props.physics ?? this.defaultPhysics;
  }
  private get vertical() {
    return this.widget.props.scrollDirection !== Axis.horizontal;
  }
  private scroll(delta: number): boolean {
    const controller = this.controller;
    const target =
      controller.offset + delta * (this.widget.props.reverse ? -1 : 1);
    const offset =
      target - this.physics.applyBoundaryConditions(controller, target);
    if (offset === controller.offset) return false;
    controller.jumpTo(offset);
    return true;
  }
  private onWheel = (event: WheelEvent) => {
    if (!this.physics.shouldAcceptUserOffset()) return;
    if (
      this.scroll(
        wheelPixels(event, this.controller.viewportDimension, !this.vertical),
      )
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  private onDragStart = (event: MouseEvent) => {
    if (event.button !== 0 || !this.physics.shouldAcceptUserOffset()) return;
    event.stopPropagation();
    this.controller.jumpTo(this.controller.offset);
    this.setState(() => {
      this.dragPosition = eventPosition(this.element.renderObject, event);
    });
  };
  private onDragMove = (event: MouseEvent) => {
    if (!this.dragPosition || !this.physics.shouldAcceptUserOffset()) return;
    const next = eventPosition(this.element.renderObject, event);
    this.scroll(
      this.vertical
        ? this.dragPosition.y - next.y
        : this.dragPosition.x - next.x,
    );
    this.setState(() => {
      this.dragPosition = next;
    });
    event.preventDefault();
  };
  private onDragEnd = () => {
    this.setState(() => {
      this.dragPosition = undefined;
    });
  };
  override dispose(): void {
    this.ownedController.dispose();
    super.dispose();
  }
  override build(_context: BuildContext): Widget {
    const props = this.widget.props;
    return GestureDetector({
      cursor: "default",
      onWheel: this.onWheel,
      onDragStart: this.onDragStart,
      onDragMove: this.onDragMove,
      onDragEnd: this.onDragEnd,
      child: ClipRect({
        clipper: viewportClipper,
        clipped: props.clipBehavior !== "none",
        child: new BaseScrollViewport({
          child: props.padding
            ? Padding({ padding: props.padding, child: props.child })
            : props.child,
          controller: this.controller,
          scrollDirection: props.scrollDirection ?? Axis.vertical,
          reverse: props.reverse ?? false,
        }),
      }),
    });
  }
}

export default classToFunction(SingleChildScrollView);
