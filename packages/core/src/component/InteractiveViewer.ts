import { State, type BuildContext } from "../element";
import { Alignment, EdgeInsets, Matrix4, Offset, Size } from "../type";
import { StatefulWidget, type Widget } from "../widget";
import { classToFunction } from "../utils";
import TransformationController from "./TransformationController";
import GestureDetector from "./GestureDetector";
import ClipRect from "./ClipRect";
import Transform from "./Transform";
import BaseInteractiveViewport, {
  type ViewerGeometry,
} from "./base/BaseInteractiveViewport";
import {
  eventPosition,
  viewportClipper,
  wheelPixels,
  type ViewportClip,
} from "./base/viewport-utils";

export type ScaleStartDetails = { focalPoint: Offset; localFocalPoint: Offset };
export type ScaleUpdateDetails = ScaleStartDetails & {
  scale: number;
  focalPointDelta: Offset;
};
export type ScaleEndDetails = { velocity: Offset };
export type InteractiveViewerProps = {
  child: Widget;
  transformationController?: TransformationController;
  boundaryMargin?: EdgeInsets;
  minScale?: number;
  maxScale?: number;
  panEnabled?: boolean;
  scaleEnabled?: boolean;
  constrained?: boolean;
  clipBehavior?: ViewportClip;
  /** Alignment used when the scaled scene is smaller than the viewport. */
  alignment?: Alignment;
  onInteractionStart?: (details: ScaleStartDetails) => void;
  onInteractionUpdate?: (details: ScaleUpdateDetails) => void;
  onInteractionEnd?: (details: ScaleEndDetails) => void;
  key?: any;
};

class InteractiveViewer extends StatefulWidget {
  constructor(readonly props: InteractiveViewerProps) {
    super(props.key);
    const min = props.minScale ?? 0.8;
    const max = props.maxScale ?? 2.5;
    if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max < min)
      throw new RangeError(
        "Scale limits must be finite and 0 < minScale <= maxScale.",
      );
    const margin = props.boundaryMargin ?? EdgeInsets.all(0);
    if (
      [margin.left, margin.top, margin.right, margin.bottom].some(
        value => Number.isNaN(value) || value < 0,
      )
    )
      throw new RangeError("boundaryMargin must be non-negative.");
  }
  override createState(): State<InteractiveViewer> {
    return new InteractiveViewerState();
  }
}

class InteractiveViewerState extends State<InteractiveViewer> {
  private ownedController = new TransformationController();
  private geometry: ViewerGeometry = { viewport: Size.zero, scene: Size.zero };
  private dragPosition?: Offset;
  private get controller() {
    return this.widget.props.transformationController ?? this.ownedController;
  }
  private changed = () => this.setState();
  override initState(context: BuildContext): void {
    super.initState(context);
    this.controller.addListener(this.changed);
  }
  override didUpdateWidget(old: InteractiveViewer): void {
    super.didUpdateWidget(old);
    const previous = old.props.transformationController ?? this.ownedController;
    if (previous !== this.controller) {
      previous.removeListener(this.changed);
      this.controller.addListener(this.changed);
    }
  }
  override dispose(): void {
    this.controller.removeListener(this.changed);
    this.ownedController.dispose();
    super.dispose();
  }
  private local(event: MouseEvent): Offset {
    return eventPosition(this.element.renderObject, event);
  }
  private details(
    event: MouseEvent,
    localFocalPoint: Offset,
  ): ScaleStartDetails {
    return {
      focalPoint: new Offset({ x: event.clientX, y: event.clientY }),
      localFocalPoint,
    };
  }
  private constrain(matrix: Matrix4): Matrix4 {
    const margin = this.widget.props.boundaryMargin ?? EdgeInsets.all(0);
    const alignment = this.widget.props.alignment ?? Alignment.topLeft;
    const { scene, viewport } = this.geometry;
    const s = matrix.storage;
    // Transform the expanded scene rectangle, including externally supplied rotations.
    const corners = [
      new Offset({ x: -margin.left, y: -margin.top }),
      new Offset({ x: scene.width + margin.right, y: -margin.top }),
      new Offset({ x: -margin.left, y: scene.height + margin.bottom }),
      new Offset({
        x: scene.width + margin.right,
        y: scene.height + margin.bottom,
      }),
    ];
    const clampAxis = (
      axis: "x" | "y",
      viewportSize: number,
      align: number,
      index: number,
    ) => {
      // Infinite margins deliberately remove that axis's boundaries.
      if (
        axis === "x"
          ? !Number.isFinite(margin.horizontal)
          : !Number.isFinite(margin.vertical)
      )
        return;
      const product = (coefficient: number, value: number) =>
        coefficient === 0 ? 0 : coefficient * value;
      const values = corners.map(point =>
        axis === "x"
          ? product(s[0], point.x) + product(s[4], point.y)
          : product(s[1], point.x) + product(s[5], point.y),
      );
      const lower = Math.min(...values),
        upper = Math.max(...values);
      if (!Number.isFinite(lower) || !Number.isFinite(upper)) return;
      const minTranslation = viewportSize - upper,
        maxTranslation = -lower;
      s[index] =
        minTranslation > maxTranslation
          ? maxTranslation +
            ((minTranslation - maxTranslation) * (align + 1)) / 2
          : Math.max(minTranslation, Math.min(maxTranslation, s[index]));
    };
    clampAxis("x", viewport.width, alignment.x, 12);
    clampAxis("y", viewport.height, alignment.y, 13);
    return matrix;
  }
  private onWheel = (event: WheelEvent) => {
    if (this.widget.props.scaleEnabled === false) return;
    const point = this.local(event);
    const current = this.controller.value;
    const scale = Math.hypot(current.storage[0], current.storage[1]);
    if (scale === 0) return;
    const nextScale = Math.max(
      this.widget.props.minScale ?? 0.8,
      Math.min(
        this.widget.props.maxScale ?? 2.5,
        scale *
          Math.exp(-wheelPixels(event, this.geometry.viewport.height) / 200),
      ),
    );
    if (scale === nextScale) return;
    const ratio = nextScale / scale;
    const next = Matrix4.translationValues(point.x, point.y, 0);
    next.multiplyMatrix(Matrix4.diagonal3Values(ratio, ratio, 1));
    next.translate(-point.x, -point.y);
    next.multiplyMatrix(current);
    const details = this.details(event, point);
    this.widget.props.onInteractionStart?.(details);
    this.controller.value = this.constrain(next);
    this.widget.props.onInteractionUpdate?.({
      ...details,
      scale: ratio,
      focalPointDelta: Offset.zero(),
    });
    this.widget.props.onInteractionEnd?.({ velocity: Offset.zero() });
    event.preventDefault();
    event.stopPropagation();
  };
  private onDragStart = (event: MouseEvent) => {
    if (event.button !== 0 || this.widget.props.panEnabled === false) return;
    const point = this.local(event);
    this.setState(() => {
      this.dragPosition = point;
    });
    this.widget.props.onInteractionStart?.(this.details(event, point));
    event.stopPropagation();
  };
  private onDragMove = (event: MouseEvent) => {
    if (!this.dragPosition || this.widget.props.panEnabled === false) return;
    const point = this.local(event);
    const delta = point.minus(this.dragPosition);
    const next = this.controller.value.clone();
    next.storage[12] += delta.x;
    next.storage[13] += delta.y;
    this.controller.value = this.constrain(next);
    this.setState(() => {
      this.dragPosition = point;
    });
    this.widget.props.onInteractionUpdate?.({
      ...this.details(event, point),
      scale: 1,
      focalPointDelta: delta,
    });
    event.preventDefault();
  };
  private onDragEnd = () => {
    if (!this.dragPosition) return;
    this.setState(() => {
      this.dragPosition = undefined;
    });
    this.widget.props.onInteractionEnd?.({ velocity: Offset.zero() });
  };
  override build(_context: BuildContext): Widget {
    const props = this.widget.props;
    return GestureDetector({
      cursor: props.panEnabled === false ? "default" : "grab",
      onWheel: this.onWheel,
      onDragStart: this.onDragStart,
      onDragMove: this.onDragMove,
      onDragEnd: this.onDragEnd,
      child: ClipRect({
        clipper: viewportClipper,
        clipped: props.clipBehavior !== "none",
        child: new BaseInteractiveViewport({
          constrained: props.constrained ?? true,
          geometry: this.geometry,
          child: Transform({
            transform: this.controller.value,
            alignment: Alignment.topLeft,
            child: props.child,
          }),
        }),
      }),
    });
  }
}

export default classToFunction(InteractiveViewer);
