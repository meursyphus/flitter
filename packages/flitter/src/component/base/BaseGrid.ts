import MultiChildRenderObject from "../../renderobject/MultiChildRenderObject";
import type RenderObject from "../../renderobject/RenderObject";
import { Constraints, Size, Offset } from "../../type";
import Utils from "../../utils";
import MultiChildRenderObjectWidget from "../../widget/MultiChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

export type BaseGridProps = {
  templateRows?: GridTemplate[];
  templateColumns?: GridTemplate[];
  autoColumn?: GridTemplate;
  autoRow?: GridTemplate;
};

class BaseGrid extends MultiChildRenderObjectWidget {
  templateRows: GridTemplate[];
  templateColumns: GridTemplate[];
  autoColumn: GridTemplate;
  autoRow: GridTemplate;
  columnCounts: number[];
  constructor({
    templateColumns = [],
    templateRows = [],
    autoColumn = GridTemplate.Fr(1),
    autoRow = GridTemplate.Fr(1),
    childrenByRow,
    key,
  }: BaseGridProps & {
    childrenByRow: Widget[][];
    key?: any;
  }) {
    super({ children: childrenByRow.flat(), key });
    this.columnCounts = childrenByRow.map((children) => children.length);
    this.templateRows = templateRows;
    this.templateColumns = templateColumns;
    this.autoColumn = autoColumn;
    this.autoRow = autoRow;
  }

  override createRenderObject(): RenderBaseGrid {
    return new RenderBaseGrid({ ...this });
  }

  override updateRenderObject(renderObject: RenderBaseGrid): void {
    renderObject.templateRows = this.templateRows;
    renderObject.templateColumns = this.templateColumns;
    renderObject.autoColumn = this.autoColumn;
    renderObject.autoRow = this.autoRow;
    renderObject.columnCounts = this.columnCounts;
  }
}

class RenderBaseGrid extends MultiChildRenderObject {
  _templateRows: GridTemplate[];
  _templateColumns: GridTemplate[];
  _autoColumn: GridTemplate;
  _autoRow: GridTemplate;
  _columnCounts: number[]; // describe column count per row, example) [3,3,3,2]
  get templateRows() {
    return this._templateRows;
  }
  set templateRows(value: GridTemplate[]) {
    if (GridTemplate.equals(value, this._templateRows)) return;
    this._templateRows = value;
    this.markNeedsLayout();
  }

  get templateColumns(): GridTemplate[] {
    return this._templateColumns;
  }

  set templateColumns(value: GridTemplate[]) {
    if (GridTemplate.equals(value, this._templateColumns)) return;
    this._templateColumns = value;
    this.markNeedsLayout();
  }

  get autoColumn(): GridTemplate {
    return this._autoColumn;
  }

  set autoColumn(value: GridTemplate) {
    if (value.equals(this._autoColumn)) return;
    this._autoColumn = value;
    this.markNeedsLayout();
  }

  get autoRow(): GridTemplate {
    return this._autoRow;
  }

  set autoRow(value: GridTemplate) {
    if (value.equals(this._autoRow)) return;
    this._autoRow = value;
    this.markNeedsLayout();
  }

  get columnCounts(): number[] {
    return this._columnCounts;
  }

  set columnCounts(value: number[]) {
    if (Utils.arrayEqual(value, this._columnCounts)) return;
    this._columnCounts = value;
    this.markNeedsLayout();
  }

  constructor({
    templateColumns,
    templateRows,
    autoColumn,
    autoRow,
    columnCounts,
  }: Required<BaseGridProps> & { columnCounts: number[] }) {
    super({ isPainter: false });
    this._columnCounts = columnCounts;
    this._templateRows = templateRows;
    this._templateColumns = templateColumns;
    this._autoColumn = autoColumn;
    this._autoRow = autoRow;
  }

  private get rowCount(): number {
    return this.columnCounts.length;
  }

  private get columnCount(): number {
    return this.columnCounts.reduce(
      (acc, current) => Math.max(acc, current),
      0
    );
  }

  private get childrenByRow(): RenderObject[][] {
    /*
      children's length must be same with columnCounts sum.
    */
    let previous = 0;
    return this.columnCounts.map((current) => {
      const result = this.children.slice(previous, previous + current);
      previous += current;
      return result;
    });
  }

  private get columns(): GridTemplate[] {
    return Array.from(
      { length: this.columnCount },
      (_, i) => this.templateColumns[i] ?? this.autoColumn
    );
  }

  private get rows(): GridTemplate[] {
    return Array.from(
      { length: this.rowCount },
      (_, i) => this.templateRows[i] ?? this.autoRow
    );
  }

  protected preformLayout(): void {
    // stretch to fit parent
    this.size = this.constraints.constrain(Size.infinite);

    const contentFitColumnWidths: number[] = Array.from(
      { length: this.columnCount },
      () => 0
    );
    const contentFitRowHeights: number[] = Array.from(
      { length: this.rowCount },
      () => 0
    );

    // let availableWidth = this.size.width;

    // contentFitColumnWidths.forEach((_, index) => {
    //   if (this.columns[index].type !== "content-fit") return;

    //   this.childrenByRow.forEach((columns) => {
    //     const child = columns[index];
    //     child.layout(new Constraints({ maxWidth: availableWidth }));
    //     contentFitColumnWidths[index] = Math.max(
    //       child.size.width,
    //       contentFitColumnWidths[index]
    //     );
    //   });

    //   availableWidth -= contentFitColumnWidths[index];
    // });

    // let availableHeight = this.size.height;

    // contentFitRowHeights.forEach((_, index) => {
    //   if (this.rows[index].type !== "content-fit") return;

    //   const row = this.childrenByRow[index];

    //   row.forEach((child) => {
    //     child.layout(new Constraints({ maxHeight: availableHeight }));
    //     contentFitRowHeights[index] = Math.max(
    //       child.size.height,
    //       contentFitRowHeights[index]
    //     );
    //   });

    //   availableHeight -= contentFitRowHeights[index];
    // });

    this.childrenByRow.forEach((columnChildren, rowIndex) => {
      columnChildren.forEach((child, columnIndex) => {
        if (this.columns[columnIndex].type === "content-fit") {
          contentFitColumnWidths[columnIndex] = Math.max(
            child.getIntrinsicWidth(this.constraints.maxHeight),
            contentFitColumnWidths[columnIndex]
          );
        }

        if (this.rows[rowIndex].type === "content-fit") {
          contentFitRowHeights[rowIndex] = Math.max(
            child.getIntrinsicHeight(this.constraints.maxWidth),
            contentFitRowHeights[rowIndex]
          );
        }
      });
    });

    const fixedColumnWidths: number[] = this.columns.map(
      ({ type, value }, i) => {
        let result = 0;
        if (type === "content-fit") {
          result = contentFitColumnWidths[i];
        } else if (type === "px") {
          result = value;
        } else if (type === "percent") {
          result = (value / 100) * this.size.width;
        }

        return result;
      }
    );

    const fixedRowHeights: number[] = this.rows.map(({ type, value }, i) => {
      let result = 0;
      if (type === "content-fit") {
        result = contentFitRowHeights[i];
      } else if (type === "px") {
        result = value;
      } else if (type === "percent") {
        result = (value / 100) * this.size.height;
      }

      return result;
    });

    const sum = (acc: number, value: number) => acc + value;
    const totalFrOnWidth = this.columns
      .filter(({ type }) => type === "fr")
      .map(({ value }) => value)
      .reduce(sum, 0);
    const totalFixedWidth = fixedColumnWidths.reduce(sum, 0);
    const frUnitOnWidth = (this.size.width - totalFixedWidth) / totalFrOnWidth;
    const widths = this.columns.map(({ type, value }, i) => {
      let result = 0;
      if (type === "fr") {
        result = value * frUnitOnWidth;
      } else {
        result = fixedColumnWidths[i];
      }
      return result;
    });

    const totalFrOnHeight = this.rows
      .filter(({ type }) => type === "fr")
      .map(({ value }) => value)
      .reduce(sum, 0);
    const totalFixedHeight = fixedRowHeights.reduce(sum, 0);
    const frUnitOnHeight =
      (this.size.height - totalFixedHeight) / totalFrOnHeight;
    const heights = this.rows.map(({ type, value }, i) => {
      let result = 0;
      if (type === "fr") {
        result = value * frUnitOnHeight;
      } else {
        result = fixedRowHeights[i];
      }
      return result;
    });

    this.childrenByRow.forEach((columnChildren, rowIndex) => {
      columnChildren.forEach((child, columnIndex) => {
        const childConstraint = new Constraints({
          ...this.constraints,
          maxHeight: heights[rowIndex],
          maxWidth: widths[columnIndex],
        });

        child.layout(childConstraint);

        child.offset = new Offset({
          x: widths.slice(0, columnIndex).reduce(sum, 0),
          y: heights.slice(0, rowIndex).reduce(sum, 0),
        });
      });
    });
  }
  getIntrinsicWidth(height: number): number {
    return this.childrenByRow
      .map((row) =>
        row
          .map((child) => child.getIntrinsicWidth(height))
          .reduce(Utils.sumReducer)
      )
      .reduce(Utils.maxReducer);
  }

  getIntrinsicHeight(width: number): number {
    return this.childrenByRow
      .map((row) =>
        row
          .map((child) => child.getIntrinsicHeight(width))
          .reduce(Utils.maxReducer)
      )
      .reduce(Utils.sumReducer);
  }
}

export class GridTemplate {
  type: "px" | "percent" | "fr" | "content-fit";
  value: number;
  constructor({
    type,
    value,
  }: {
    value: number;
    type: "px" | "percent" | "fr" | "content-fit";
  }) {
    this.type = type;
    this.value = value;
  }

  static equals(target: GridTemplate[], other: GridTemplate[]): boolean {
    if (target.length !== other.length) return false;
    return target.every((value, i) => value.equals(other[i]));
  }

  equals(other: GridTemplate): boolean {
    if (this === other) return true;
    return this.type === other.type && this.value === other.value;
  }

  static Fr(value: number) {
    return new GridTemplate({ value, type: "fr" });
  }

  static Px(value: number) {
    return new GridTemplate({ value, type: "px" });
  }

  static ContentFit() {
    return new GridTemplate({ value: 0, type: "content-fit" });
  }

  // 0 ~ 100
  static Percent(value: number) {
    return new GridTemplate({ value, type: "percent" });
  }

  repeat(count: number): GridTemplate[] {
    return Array.from({ length: count }, () => this);
  }
}

export default BaseGrid;
