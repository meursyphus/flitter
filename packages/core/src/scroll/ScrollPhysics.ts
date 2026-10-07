export type ScrollMetrics = {
  offset: number;
  minScrollExtent: number;
  maxScrollExtent: number;
  viewportDimension: number;
};

/** Seconds-based, exponentially decaying fling simulation. */
export class ScrollSimulation {
  constructor(private position: ScrollMetrics, private velocity: number) {}
  x(time: number): number {
    const value = this.position.offset + this.velocity * (1 - Math.exp(-5 * time)) / 5;
    return Math.max(this.position.minScrollExtent, Math.min(this.position.maxScrollExtent, value));
  }
  dx(time: number): number { return this.velocity * Math.exp(-5 * time); }
  isDone(time: number): boolean {
    return Math.abs(this.dx(time)) < 5 || this.x(time) === this.position.minScrollExtent || this.x(time) === this.position.maxScrollExtent;
  }
}

export abstract class ScrollPhysics {
  shouldAcceptUserOffset(): boolean { return true; }
  /** Returns the amount of the proposed offset that exceeds the boundaries. */
  applyBoundaryConditions(position: ScrollMetrics, value: number): number {
    return value - Math.max(position.minScrollExtent, Math.min(position.maxScrollExtent, value));
  }
  createBallisticSimulation(position: ScrollMetrics, velocity: number): ScrollSimulation | null {
    return this.shouldAcceptUserOffset() && Math.abs(velocity) >= 5 ? new ScrollSimulation(position, velocity) : null;
  }
}

export class ClampingScrollPhysics extends ScrollPhysics {}
export class NeverScrollableScrollPhysics extends ScrollPhysics {
  override shouldAcceptUserOffset(): boolean { return false; }
}
