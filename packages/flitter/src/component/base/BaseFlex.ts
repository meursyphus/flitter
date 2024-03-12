import MultiChildRenderObject from "../../renderobject/MultiChildRenderObject";
import type {
  Axis} from "../../type";
import {
  Constraints,
  CrossAxisAlignment,
  MainAxisAlignment,
  MainAxisSize,
  Offset,
  Size,
  VerticalDirection,
} from "../../type";
import MultiChildRenderObjectWidget from "../../widget/MultiChildRenderObjectWidget";
import type Widget from "../../widget/Widget";
import { RenderFlexible } from "./BaseFlexible";

class Flex extends MultiChildRenderObjectWidget {
  direction: Axis;
  mainAxisAlignment: MainAxisAlignment;
  crossAxisAlignment: CrossAxisAlignment;
  verticalDirection: VerticalDirection;
  mainAxisSize: MainAxisSize;
  constructor({
    children,
    direction,
    mainAxisAlignment = MainAxisAlignment.start,
    crossAxisAlignment = CrossAxisAlignment.center,
    verticalDirection = VerticalDirection.down,
    mainAxisSize = MainAxisSize.max,
    key,
  }: {
    children: Widget[];
    direction: Axis;
    mainAxisAlignment?: MainAxisAlignment;
    crossAxisAlignment?: CrossAxisAlignment;
    verticalDirection?: VerticalDirection;
    mainAxisSize?: MainAxisSize;
    key?: any;
  }) {
    super({ children, key });
    this.direction = direction;
    this.mainAxisAlignment = mainAxisAlignment;
    this.crossAxisAlignment = crossAxisAlignment;
    this.verticalDirection = verticalDirection;
    this.mainAxisSize = mainAxisSize;
  }

  createRenderObject(): RenderFlex {
    return new RenderFlex({
      direction: this.direction,
      mainAxisAlignment: this.mainAxisAlignment,
      crossAxisAlignment: this.crossAxisAlignment,
      verticalDirection: this.verticalDirection,
      mainAxisSize: this.mainAxisSize,
    });
  }

  updateRenderObject(renderObject: RenderFlex): void {
    renderObject.direction = this.direction;
    renderObject.mainAxisAlignment = this.mainAxisAlignment;
    renderObject.crossAxisAlignment = this.crossAxisAlignment;
    renderObject.verticalDirection = this.verticalDirection;
    renderObject.mainAxisSize = this.mainAxisSize;
  }
}

class RenderFlex extends MultiChildRenderObject {
  _direction: Axis;
  _mainAxisAlignment: MainAxisAlignment;
  _crossAxisAlignment: CrossAxisAlignment;
  _verticalDirection: VerticalDirection;
  _mainAxisSize: MainAxisSize;
  get direction(): Axis {
    return this._direction;
  }

  set direction(newDirection: Axis) {
    if (this._direction === newDirection) return; // early return
    this._direction = newDirection;
  }

  get mainAxisAlignment(): MainAxisAlignment {
    return this._mainAxisAlignment;
  }

  set mainAxisAlignment(newMainAxisAlignment: MainAxisAlignment) {
    if (this._mainAxisAlignment === newMainAxisAlignment) return; // early return
    this._mainAxisAlignment = newMainAxisAlignment;
    this.markNeedsLayout();
  }

  get crossAxisAlignment(): CrossAxisAlignment {
    return this._crossAxisAlignment;
  }

  set crossAxisAlignment(newCrossAxisAlignment: CrossAxisAlignment) {
    if (this._crossAxisAlignment === newCrossAxisAlignment) return; // early return
    this._crossAxisAlignment = newCrossAxisAlignment;
    this.markNeedsLayout();
  }

  get verticalDirection(): VerticalDirection {
    return this._verticalDirection;
  }

  set verticalDirection(newVerticalDirection: VerticalDirection) {
    if (this._verticalDirection === newVerticalDirection) return; // early return
    this._verticalDirection = newVerticalDirection;
    this.markNeedsLayout();
  }

  get mainAxisSize(): MainAxisSize {
    return this._mainAxisSize;
  }

  set mainAxisSize(newMainAxisSize: MainAxisSize) {
    if (this._mainAxisSize === newMainAxisSize) return; // early return
    this._mainAxisSize = newMainAxisSize;
    this.markNeedsLayout();
  }

  get mainAxisSizeName(): "width" | "height" {
    return this.direction === "horizontal" ? "width" : "height";
  }
  get crossAxisSizeName(): "width" | "height" {
    return this.direction === "horizontal" ? "height" : "width";
  }
  get minMainAxisSizeName(): "minWidth" | "minHeight" {
    return this.direction === "horizontal" ? "minWidth" : "minHeight";
  }
  get maxMainAxisSizeName(): "maxWidth" | "maxHeight" {
    return this.direction === "horizontal" ? "maxWidth" : "maxHeight";
  }
  get minCrossAxisSizeName(): "minWidth" | "minHeight" {
    return this.direction === "horizontal" ? "minHeight" : "minWidth";
  }
  get maxCrossAxisSizeName(): "maxWidth" | "maxHeight" {
    return this.direction === "horizontal" ? "maxHeight" : "maxWidth";
  }
  constructor({
    direction,
    mainAxisAlignment,
    crossAxisAlignment,
    verticalDirection,
    mainAxisSize,
  }: {
    direction: Axis;
    mainAxisAlignment: MainAxisAlignment;
    crossAxisAlignment: CrossAxisAlignment;
    verticalDirection: VerticalDirection;
    mainAxisSize: MainAxisSize;
  }) {
    super({ isPainter: false });
    this._direction = direction;
    this._mainAxisAlignment = mainAxisAlignment;
    this._crossAxisAlignment = crossAxisAlignment;
    this._verticalDirection = verticalDirection;
    this._mainAxisSize = mainAxisSize;
  }
  protected preformLayout(): void {
    let totalFlex = 0;
    let [childIntrinsicMainAxisValue, crossAxisValue] = [0, 0];
    const sortedChildren =
      this.verticalDirection === "down"
        ? this.children
        : [...this.children].reverse();

    sortedChildren.forEach((child) => {
      child.layout(this.constraints.loosen());
      const flex = child instanceof RenderFlexible ? child.flex : 0;
      totalFlex += flex;
      if (flex === 0) {
        childIntrinsicMainAxisValue += child.size[this.mainAxisSizeName];
      }
      crossAxisValue =
        this.crossAxisAlignment === "stretch"
          ? this.constraints.getMax(this.crossAxisSizeName)
          : Math.max(crossAxisValue, child.size[this.crossAxisSizeName]);
    });

    const flexUnitSize =
      (this.constraints.getMax(this.mainAxisSizeName) -
        childIntrinsicMainAxisValue) /
      totalFlex;

    /*
      layout children
    */
    sortedChildren.forEach((child) => {
      let childConstraint: Constraints;

      if (!(child instanceof RenderFlexible)) {
        childConstraint = this.getNonFlexItemConstraint(crossAxisValue);
      } else {
        const flex = child.flex;
        const childMainAxisValue = flex * flexUnitSize;
        childConstraint = this.getFlexItemConstraint(
          childMainAxisValue,
          child.fit
        );
      }

      child.layout(childConstraint.enforce(this.constraints.loosen()));
    });

    /*
      determine size of widget
    */
    this.size = this.constraints.constrain(
      new Size({
        [this.mainAxisSizeName]:
          this.mainAxisSize === "max"
            ? this.constraints.getMax(this.mainAxisSizeName)
            : sortedChildren
                .map((child) => child.size[this.mainAxisSizeName])
                .reduce((acc, childMainAxisSize) => acc + childMainAxisSize, 0),
        [this.crossAxisSizeName]: crossAxisValue,
      } as any)
    );

    const mainAxisOffsets = this.getChildOffsetsOnMainAxis(
      sortedChildren.map(({ size }) => size[this.mainAxisSizeName])
    );

    sortedChildren.forEach((child, i) => {
      const [mainAxisOffset, crossAxisOffset]: ("x" | "y")[] =
        this.direction === "horizontal" ? ["x", "y"] : ["y", "x"];

      child.offset = new Offset({
        [mainAxisOffset]: mainAxisOffsets[i],
        [crossAxisOffset]: this.getChildOffsetOnCrossAxis(
          child.size[this.crossAxisSizeName]
        ),
      } as { x: number; y: number });
    });
  }

  private getNonFlexItemConstraint(crossAxisValue: number) {
    if (this.crossAxisAlignment === CrossAxisAlignment.stretch) {
      return Constraints.tightFor({
        [this.crossAxisSizeName]: crossAxisValue,
      });
    }

    return this.constraints.loosen();
  }

  private getFlexItemConstraint(childExtent: number, fit: "loose" | "tight") {
    return new Constraints({
      [this.minCrossAxisSizeName]:
        this.crossAxisAlignment === "stretch"
          ? this.constraints[this.maxCrossAxisSizeName]
          : 0,
      [this.maxCrossAxisSizeName]: this.constraints[this.maxCrossAxisSizeName],
      [this.maxMainAxisSizeName]: childExtent,
      [this.minMainAxisSizeName]: fit === "tight" ? childExtent : 0,
    });
  }

  private getChildOffsetsOnMainAxis(childMainAxisValues: number[]) {
    let offsetsOnMainAxis: number[] = [];
    const sum = (acc: number, value: number) => acc + value;
    const restSpaceSize =
      this.size[this.mainAxisSizeName] - childMainAxisValues.reduce(sum, 0);

    switch (this.mainAxisAlignment) {
      case "start":
        offsetsOnMainAxis = this._getChildOffsetsOnMainAxis({
          startOffset: 0,
          additionalSpace: 0,
          childMainAxisValues,
        });
        break;
      case "end":
        offsetsOnMainAxis = this._getChildOffsetsOnMainAxis({
          startOffset: restSpaceSize,
          additionalSpace: 0,
          childMainAxisValues,
        });
        break;
      case "spaceAround":
        const aroundSpace = restSpaceSize / childMainAxisValues.length;
        offsetsOnMainAxis = this._getChildOffsetsOnMainAxis({
          startOffset: aroundSpace / 2,
          additionalSpace: aroundSpace,
          childMainAxisValues,
        });
        break;
      case "spaceBetween":
        offsetsOnMainAxis = this._getChildOffsetsOnMainAxis({
          startOffset: 0,
          additionalSpace: restSpaceSize / (childMainAxisValues.length - 1),
          childMainAxisValues,
        });
        break;
      case "spaceEvenly":
        const evenSpace = restSpaceSize / (childMainAxisValues.length + 1);
        offsetsOnMainAxis = this._getChildOffsetsOnMainAxis({
          startOffset: evenSpace,
          additionalSpace: evenSpace,
          childMainAxisValues,
        });
        break;
      case "center":
        offsetsOnMainAxis = this._getChildOffsetsOnMainAxis({
          startOffset: restSpaceSize / 2,
          additionalSpace: 0,
          childMainAxisValues,
        });
        break;
      default:
        throw new Error(
          `this mainAixsAlignment(${this.mainAxisAlignment}) is not supported yet`
        );
    }

    return offsetsOnMainAxis;
  }

  private _getChildOffsetsOnMainAxis({
    startOffset,
    childMainAxisValues,
    additionalSpace,
  }: {
    startOffset: number;
    childMainAxisValues: number[];
    additionalSpace: number;
  }): number[] {
    const result: number[] = [];
    let previousOffset = startOffset;
    childMainAxisValues.forEach((value) => {
      result.push(previousOffset);
      previousOffset += value + additionalSpace;
    });
    return result;
  }

  private getChildOffsetOnCrossAxis(childCrossAxisValue: number) {
    const parentCrossAxisValue = this.size[this.crossAxisSizeName];
    let offsetOnCrossAxis: number;
    switch (this.crossAxisAlignment) {
      case CrossAxisAlignment.center:
        offsetOnCrossAxis = (parentCrossAxisValue - childCrossAxisValue) / 2;
        break;
      case CrossAxisAlignment.start:
        offsetOnCrossAxis = 0;
        break;
      case CrossAxisAlignment.end:
        offsetOnCrossAxis = parentCrossAxisValue - childCrossAxisValue;
        break;
      case CrossAxisAlignment.stretch:
        offsetOnCrossAxis = 0;
        break;
    }
    return offsetOnCrossAxis;
  }

  override getIntrinsicHeight(width: number): number {
    const sum = (acc: number, value: number) => acc + value;
    const max = (acc: number, value: number) => Math.max(acc, value);
    const childIntrinsicHeights = this.children.map((child) =>
      child.getIntrinsicHeight(width)
    );
    return this.direction === "horizontal"
      ? childIntrinsicHeights.reduce(max, 0)
      : childIntrinsicHeights.reduce(sum, 0);
  }

  override getIntrinsicWidth(height: number): number {
    const sum = (acc: number, value: number) => acc + value;
    const max = (acc: number, value: number) => Math.max(acc, value);
    const childIntrinsicWidths = this.children.map((child) =>
      child.getIntrinsicWidth(height)
    );

    return this.direction === "vertical"
      ? childIntrinsicWidths.reduce(max, 0)
      : childIntrinsicWidths.reduce(sum, 0);
  }
}

export default Flex;
