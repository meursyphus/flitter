# Issue 31 Perf Trace Comparison

Current run:
- Timestamp: 2026-04-12 12:29:56 Asia/Seoul
- Note: `Issue #31 lazy element deactivation / GlobalKey reparenting PR #135`

Previous run:
- Timestamp: 2026-04-11 23:31:25 Asia/Seoul
- Note: `Canvas repaint boundary + layer optimizations (OffsetLayer/OpacityLayer skip, flushPaint guard)`

Average trace metrics:

| Metric | Previous (ms) | Current (ms) | Delta (ms) | Delta (%) |
| --- | ---: | ---: | ---: | ---: |
| `runApp` | 34.0251 | 35.1056 | +1.0805 | +3.18% |
| `mount` | 9.4760 | 9.9202 | +0.4442 | +4.69% |
| `draw` | 24.2177 | 24.8643 | +0.6466 | +2.67% |
| `layout` | 17.7685 | 18.0652 | +0.2967 | +1.67% |
| `paint` | 2.0959 | 2.3901 | +0.2942 | +14.04% |

Takeaways:
- This run is slower than the immediately previous round across every tracked metric.
- The largest absolute regression is `runApp` (+1.0805ms).
- The largest relative regression is `paint` (+14.04%), but from a small baseline.
- `draw` and `layout` also moved up, so the regression is not isolated to mount-only work.

Trace capture notes:
- The average completed successfully and appended a new entry to `performance-history/duration.ts`.
- New trace JSON outputs were generated for 10 successful runs on 2026-04-12.
- The runner had automatic retries on run 2, run 9, and run 10 because the first captured trace was invalid.
