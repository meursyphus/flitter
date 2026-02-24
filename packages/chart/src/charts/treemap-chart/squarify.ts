import type { TreemapLayout } from "./types";

interface SquarifyNode {
  value: number;
  index: number;
}

function worst(row: SquarifyNode[], w: number, totalArea: number): number {
  const rowArea = row.reduce((s, n) => s + n.value, 0);
  const scaledRow = row.map((n) => (n.value / totalArea) * w * w);
  const scaledRowArea = (rowArea / totalArea) * w * w;

  if (scaledRow.length === 0 || scaledRowArea === 0) return Infinity;

  const maxVal = Math.max(...scaledRow);
  const minVal = Math.min(...scaledRow);
  const s2 = scaledRowArea * scaledRowArea;

  return Math.max(
    (w * w * maxVal) / s2,
    s2 / (w * w * minVal),
  );
}

export function squarify(
  values: { value: number; index: number }[],
  width: number,
  height: number,
): TreemapLayout[] {
  const totalValue = values.reduce((s, n) => s + n.value, 0);
  if (totalValue === 0 || values.length === 0) return [];

  const results: TreemapLayout[] = new Array(values.length);

  // Sort descending by value for better aspect ratios
  const sorted = [...values].sort((a, b) => b.value - a.value);

  let x = 0;
  let y = 0;
  let remainingWidth = width;
  let remainingHeight = height;
  let remainingValue = totalValue;

  let i = 0;
  while (i < sorted.length) {
    const w = Math.min(remainingWidth, remainingHeight);
    const isHorizontal = remainingWidth >= remainingHeight;

    const row: SquarifyNode[] = [sorted[i]];
    let currentWorst = worst(row, w, remainingValue);
    i++;

    while (i < sorted.length) {
      const candidate = [...row, sorted[i]];
      const candidateWorst = worst(candidate, w, remainingValue);
      if (candidateWorst > currentWorst) break;
      row.push(sorted[i]);
      currentWorst = candidateWorst;
      i++;
    }

    // Lay out the row
    const rowArea = row.reduce((s, n) => s + n.value, 0);
    const rowFraction = remainingValue > 0 ? rowArea / remainingValue : 0;

    if (isHorizontal) {
      const rowWidth = remainingWidth * rowFraction;
      let cy = y;
      for (const node of row) {
        const nodeFraction = rowArea > 0 ? node.value / rowArea : 0;
        const nodeHeight = remainingHeight * nodeFraction;
        results[node.index] = {
          x: x,
          y: cy,
          width: rowWidth,
          height: nodeHeight,
        };
        cy += nodeHeight;
      }
      x += rowWidth;
      remainingWidth -= rowWidth;
    } else {
      const rowHeight = remainingHeight * rowFraction;
      let cx = x;
      for (const node of row) {
        const nodeFraction = rowArea > 0 ? node.value / rowArea : 0;
        const nodeWidth = remainingWidth * nodeFraction;
        results[node.index] = {
          x: cx,
          y: y,
          width: nodeWidth,
          height: rowHeight,
        };
        cx += nodeWidth;
      }
      y += rowHeight;
      remainingHeight -= rowHeight;
    }

    remainingValue -= rowArea;
  }

  return results;
}
