export const FLITTER_PERFORMANCE_NAMESPACE = "flitter";

export class PerformanceTracer {
  #enabled = false;
  #sequence = 0;

  setEnabled(enabled: boolean) {
    this.#enabled = enabled;
  }

  measure<T>(name: string, fn: () => T): T {
    if (
      !this.#enabled ||
      typeof performance === "undefined" ||
      typeof performance.mark !== "function" ||
      typeof performance.measure !== "function"
    ) {
      return fn();
    }

    const sequence = this.#sequence++;
    const startMark = `${FLITTER_PERFORMANCE_NAMESPACE}:${name}:start:${sequence}`;
    const endMark = `${FLITTER_PERFORMANCE_NAMESPACE}:${name}:end:${sequence}`;
    const measureName = `${FLITTER_PERFORMANCE_NAMESPACE}:${name}`;

    performance.mark(startMark);
    try {
      return fn();
    } finally {
      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);
      // The measures are the public trace. Private marks otherwise accumulate
      // twice per phase per frame in long-running animation sessions.
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
    }
  }
}
