import { describe, expect, it } from "vitest";
import ChromeTraceAnalyzer from "./ChromeTraceAnalyzer.js";

describe("ChromeTraceAnalyzer", () => {
  it("prefers summed flitter user timing measures over cpu profile names", () => {
    const analyzer = new ChromeTraceAnalyzer({
      traceEvents: [
        {
          name: "flitter:layout",
          cat: "blink.user_timing",
          ph: "b",
          pid: 1,
          tid: 1,
          ts: 100,
          id2: { local: "0x1" },
        },
        {
          name: "flitter:layout",
          cat: "blink.user_timing",
          ph: "e",
          pid: 1,
          tid: 1,
          ts: 400,
          id2: { local: "0x1" },
        },
        {
          name: "flitter:layout",
          cat: "blink.user_timing",
          ph: "b",
          pid: 1,
          tid: 1,
          ts: 500,
          id2: { local: "0x2" },
        },
        {
          name: "flitter:layout",
          cat: "blink.user_timing",
          ph: "e",
          pid: 1,
          tid: 1,
          ts: 800,
          id2: { local: "0x2" },
        },
        {
          name: "ProfileChunk",
          args: {
            data: {
              cpuProfile: {
                nodes: [{ id: 1, callFrame: { functionName: "layout" } }],
                samples: [1],
              },
              timeDeltas: [9999],
            },
          },
        },
      ],
    });

    expect(analyzer.getDurationMs("layout")).toBe(0.6);
  });
});
