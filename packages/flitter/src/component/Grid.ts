import type Widget from "../widget/Widget";
import BaseGrid, { GridTemplate, type BaseGridProps } from "./base/BaseGrid";

function Grid({
  childrenByRow,
  key,
  ...props
}: BaseGridProps & {
  key?: any;
  childrenByRow: (Widget | null | undefined)[][];
}): BaseGrid {
  return new BaseGrid({ childrenByRow, key, ...props });
}

Grid.Fr = GridTemplate.Fr;
Grid.ContentFit = GridTemplate.ContentFit;
Grid.Percent = GridTemplate.Percent;
Grid.Px = GridTemplate.Px;

export default Grid;
