type PerfTimelinePhase =
  | "draw"
  | "drawFrame"
  | "layout"
  | "mount"
  | "paint"
  | "paintTransform"
  | "runApp";

const PERF_TIMELINE_PREFIX = "flitter:";

class PerfTimeline {
  private enabled: boolean;
  private performance?: Performance;
  private sequence = 0;

  constructor({
    enabled = false,
    performance,
  }: {
    enabled?: boolean;
    performance?: Performance;
  }) {
    this.enabled = enabled;
    this.performance = performance;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  measure<T>(phase: PerfTimelinePhase, callback: () => T): T {
    if (!this.enabled || this.performance == null) {
      return callback();
    }

    const markerId = this.sequence++;
    const measureName = `${PERF_TIMELINE_PREFIX}${phase}`;
    const startMark = `${measureName}:start:${markerId}`;
    const endMark = `${measureName}:end:${markerId}`;

    this.performance.mark(startMark);
    try {
      return callback();
    } finally {
      this.performance.mark(endMark);
      this.performance.measure(measureName, startMark, endMark);
    }
  }
}

export default PerfTimeline;
