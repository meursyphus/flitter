import MultiChildRenderObject from "../../renderobject/MultiChildRenderObject";
import ChildLayoutHelper, {
  type ChildLayouter,
} from "../../renderobject/ChildLayoutHelper";
import type RenderObject from "../../renderobject/RenderObject";
import {
  Constraints,
  CrossAxisAlignment,
  MainAxisAlignment,
  MainAxisSize,
  Offset,
  Size,
  VerticalDirection,
  Axis,
} from "../../type";
import MultiChildRenderObjectWidget from "../../widget/MultiChildRenderObjectWidget";
import type Widget from "../../widget/Widget";
import type { RenderFlexible } from "./BaseFlexible";

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
    this.markNeedsLayout();
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
    return this.direction === Axis.horizontal ? "width" : "height";
  }
  get crossAxisSizeName(): "width" | "height" {
    return this.direction === Axis.horizontal ? "height" : "width";
  }
  get minMainAxisSizeName(): "minWidth" | "minHeight" {
    return this.direction === Axis.horizontal ? "minWidth" : "minHeight";
  }
  get maxMainAxisSizeName(): "maxWidth" | "maxHeight" {
    return this.direction === Axis.horizontal ? "maxWidth" : "maxHeight";
  }
  get minCrossAxisSizeName(): "minWidth" | "minHeight" {
    return this.direction === Axis.horizontal ? "minHeight" : "minWidth";
  }
  get maxCrossAxisSizeName(): "maxWidth" | "maxHeight" {
    return this.direction === Axis.horizontal ? "maxHeight" : "maxWidth";
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
    const { childSizes, size, sortedChildren } = this.computeLayout(
      this.constraints,
      ChildLayoutHelper.layoutChild,
    );
    this.size = size;

    const mainAxisOffsets = this.getChildOffsetsOnMainAxis(
      childSizes.map(childSize => childSize[this.mainAxisSizeName]),
    );

    sortedChildren.forEach((child, i) => {
      const [mainAxisOffset, crossAxisOffset]: ["x" | "y", "x" | "y"] =
        this.direction === Axis.horizontal ? ["x", "y"] : ["y", "x"];

      child.offset = new Offset({
        [mainAxisOffset]: mainAxisOffsets[i],
        [crossAxisOffset]: this.getChildOffsetOnCrossAxis(
          childSizes[i]![this.crossAxisSizeName],
        ),
      } as { x: number; y: number });
    });
  }

  protected override computeDryLayout(constraints: Constraints): Size {
    return this.computeLayout(constraints, ChildLayoutHelper.dryLayoutChild)
      .size;
  }

  private computeLayout(
    constraints: Constraints,
    layoutChild: ChildLayouter,
  ): {
    childSizes: Size[];
    size: Size;
    sortedChildren: RenderObject[];
  } {
    let totalFlex = 0;
    let [childIntrinsicMainAxisValue, crossAxisValue] = [0, 0];
    const sortedChildren = this.getSortedChildren();
    const loosenedConstraints = constraints.loosen();

    if (this.crossAxisAlignment === CrossAxisAlignment.stretch) {
      crossAxisValue = constraints.getMax(this.crossAxisSizeName);
    }

    sortedChildren.forEach(child => {
      const childSize = layoutChild(child, loosenedConstraints);
      const flex = this.getFlex(child);
      totalFlex += flex;
      if (flex === 0) {
        childIntrinsicMainAxisValue += childSize[this.mainAxisSizeName];
      }
      if (this.crossAxisAlignment !== CrossAxisAlignment.stretch) {
        crossAxisValue = Math.max(
          crossAxisValue,
          childSize[this.crossAxisSizeName],
        );
      }
    });

    const flexUnitSize =
      (constraints.getMax(this.mainAxisSizeName) -
        childIntrinsicMainAxisValue) /
      (totalFlex || 1);
    const childSizes = sortedChildren.map(child => {
      const flexible = this.asRenderFlexible(child);
      const childConstraint =
        flexible == null
          ? this.getNonFlexItemConstraint(constraints, crossAxisValue)
          : this.getFlexItemConstraint(
              constraints,
              flexible.flex * flexUnitSize,
              flexible.fit,
            );

      return layoutChild(child, childConstraint.enforce(loosenedConstraints));
    });

    return {
      childSizes,
      size: constraints.constrain(
        new Size({
          [this.mainAxisSizeName]:
            this.mainAxisSize === MainAxisSize.max
              ? constraints.getMax(this.mainAxisSizeName)
              : childSizes.reduce(
                  (acc, childSize) => acc + childSize[this.mainAxisSizeName],
                  0,
                ),
          [this.crossAxisSizeName]: crossAxisValue,
        } as any),
      ),
      sortedChildren,
    };
  }

  private getSortedChildren(): RenderObject[] {
    return this.verticalDirection === VerticalDirection.down
      ? this.children
      : [...this.children].reverse();
  }

  private asRenderFlexible(child: RenderObject): RenderFlexible | undefined {
    return (child as RenderFlexible)?.isRenderFlexible
      ? (child as RenderFlexible)
      : undefined;
  }

  private getFlex(child: RenderObject): number {
    return this.asRenderFlexible(child)?.flex ?? 0;
  }

  private getNonFlexItemConstraint(
    constraints: Constraints,
    crossAxisValue: number,
  ) {
    if (this.crossAxisAlignment === CrossAxisAlignment.stretch) {
      return Constraints.tightFor({
        [this.crossAxisSizeName]: crossAxisValue,
      });
    }

    return constraints.loosen();
  }

  private getFlexItemConstraint(
    constraints: Constraints,
    childExtent: number,
    fit: "loose" | "tight",
  ) {
    return new Constraints({
      [this.minCrossAxisSizeName]:
        this.crossAxisAlignment === CrossAxisAlignment.stretch
          ? constraints[this.maxCrossAxisSizeName]
          : 0,
      [this.maxCrossAxisSizeName]: constraints[this.maxCrossAxisSizeName],
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
      case MainAxisAlignment.start:
        offsetsOnMainAxis = this._getChildOffsetsOnMainAxis({
          startOffset: 0,
          additionalSpace: 0,
          childMainAxisValues,
        });
        break;
      case MainAxisAlignment.end:
        offsetsOnMainAxis = this._getChildOffsetsOnMainAxis({
          startOffset: restSpaceSize,
          additionalSpace: 0,
          childMainAxisValues,
        });
        break;
      case MainAxisAlignment.spaceAround:
        const aroundSpace = restSpaceSize / childMainAxisValues.length;
        offsetsOnMainAxis = this._getChildOffsetsOnMainAxis({
          startOffset: aroundSpace / 2,
          additionalSpace: aroundSpace,
          childMainAxisValues,
        });
        break;
      case MainAxisAlignment.spaceBetween:
        offsetsOnMainAxis = this._getChildOffsetsOnMainAxis({
          startOffset: 0,
          additionalSpace: restSpaceSize / (childMainAxisValues.length - 1),
          childMainAxisValues,
        });
        break;
      case MainAxisAlignment.spaceEvenly:
        const evenSpace = restSpaceSize / (childMainAxisValues.length + 1);
        offsetsOnMainAxis = this._getChildOffsetsOnMainAxis({
          startOffset: evenSpace,
          additionalSpace: evenSpace,
          childMainAxisValues,
        });
        break;
      case MainAxisAlignment.center:
        offsetsOnMainAxis = this._getChildOffsetsOnMainAxis({
          startOffset: restSpaceSize / 2,
          additionalSpace: 0,
          childMainAxisValues,
        });
        break;
      default:
        throw new Error(
          `this mainAxisAlignment(${this.mainAxisAlignment}) is not supported yet`,
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
    childMainAxisValues.forEach(value => {
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

  protected override computeIntrinsicHeight(width: number): number {
    const sum = (acc: number, value: number) => acc + value;
    const max = (acc: number, value: number) => Math.max(acc, value);
    const childIntrinsicHeights = this.children.map(child =>
      child.getIntrinsicHeight(width),
    );
    return this.direction === Axis.horizontal
      ? childIntrinsicHeights.reduce(max, 0)
      : childIntrinsicHeights.reduce(sum, 0);
  }

  protected override computeIntrinsicWidth(height: number): number {
    const sum = (acc: number, value: number) => acc + value;
    const max = (acc: number, value: number) => Math.max(acc, value);
    const childIntrinsicWidths = this.children.map(child =>
      child.getIntrinsicWidth(height),
    );

    return this.direction === Axis.vertical
      ? childIntrinsicWidths.reduce(max, 0)
      : childIntrinsicWidths.reduce(sum, 0);
  }
}

export default Flex;
