import type { Decoration, Matrix4 } from "../type";
import { type EdgeInsets, type Alignment, Constraints, Rect } from "../type";
import { assert, functionalizeClass } from "../utils";
import type Widget from "../widget/Widget";
import Align from "./Align";
import ConstrainedBox from "./ConstrainedBox";
import ColoredBox from "./ColoredBox";
import DecoratedBox from "./DecoratedBox";
import LimitedBox from "./LimitedBox";
import Padding from "./Padding";
import type { EdgeInsetsGeometry } from "../type/_types/edge-insets";
import Transform from "./Transform";
import ClipPath from "./ClipPath";
import { StatelessWidget } from "../widget";
import type { BuildContext } from "../element";

type ContainerProps = {
  padding?: EdgeInsets;
  margin?: EdgeInsets;
  width?: number;
  height?: number;
  color?: string;
  decoration?: Decoration;
  child?: Widget;
  alignment?: Alignment;
  clipped?: boolean;
  constraints?: Constraints;
  transform?: Matrix4;
  transformAlignment?: Alignment;
  key?: any;
};

class _Container extends StatelessWidget {
  padding?: EdgeInsets;
  margin?: EdgeInsets;
  width?: number;
  height?: number;
  color?: string;
  decoration?: Decoration;
  child?: Widget;
  alignment?: Alignment;
  clipped?: boolean;
  constraints?: Constraints;
  transform?: Matrix4;
  transformAlignment?: Alignment;
  constructor({
    key,
    padding,
    margin,
    width,
    height,
    color,
    decoration,
    child,
    alignment,
    clipped,
    constraints,
    transform,
    transformAlignment,
  }: ContainerProps) {
    super(key);
    this.padding = padding;
    this.margin = margin;
    this.width = width;
    this.height = height;
    this.color = color;
    this.decoration = decoration;
    this.child = child;
    this.alignment = alignment;
    this.clipped = clipped;
    this.constraints = constraints;
    this.transform = transform;
    this.transformAlignment = transformAlignment;
  }
  build(_: BuildContext): Widget {
    const {
      padding,
      margin,
      width,
      height,
      color,
      decoration,
      child,
      alignment,
      clipped,
      transform,
      transformAlignment,
    } = this;
    let constraints = this.constraints;
    constraints =
      width != null || height != null
        ? constraints?.tighten({ width, height }) ??
          Constraints.tightFor({ width, height })
        : constraints;
    assert(
      color == null || decoration == null,
      "Color must be null when decoration is defined"
    );

    let current: Widget | undefined = child;

    if (current == null && (constraints == null || !constraints.isTight)) {
      current = LimitedBox({
        maxHeight: 0,
        maxWidth: 0,
        child: ConstrainedBox({
          constraints: Constraints.expand(),
        }),
      });
    } else if (alignment != null) {
      current = Align({ child: current, alignment });
    }
    let paddingIncludingDecoration: EdgeInsetsGeometry | undefined;

    if (decoration == null || decoration.padding == null) {
      paddingIncludingDecoration = padding;
    } else if (padding == null) {
      paddingIncludingDecoration = decoration.padding;
    } else {
      paddingIncludingDecoration = padding.add(decoration.padding);
    }

    if (paddingIncludingDecoration != null) {
      current = Padding({
        padding: paddingIncludingDecoration,
        child: current,
      });
    }

    if (color != null) {
      current = ColoredBox({
        color,
        child: current,
      });
    }

    if (clipped) {
      assert(
        decoration != null,
        "Decoration must not be null when clipped is true"
      );
      current = ClipPath({
        clipper: (size) =>
          decoration!.getClipPath(
            Rect.fromLTWH({
              width: size.width,
              height: size.height,
              left: 0,
              top: 0,
            })
          ),
        clipped,
        child: current,
      });
    }

    if (decoration != null) {
      current = DecoratedBox({
        decoration: decoration!,
        child: current,
      });
    }

    if (constraints != null) {
      current = ConstrainedBox({
        child: current,
        constraints: constraints,
      });
    }

    if (margin != null) {
      current = Padding({
        child: current,
        padding: margin,
      });
    }

    if (transform != null) {
      current = Transform({
        transform: transform,
        alignment: transformAlignment,
        child: current,
      });
    }

    return current!;
  }
}

export default functionalizeClass(_Container);
