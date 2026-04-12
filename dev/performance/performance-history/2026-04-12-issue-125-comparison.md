# Issue 125 Perf Trace Comparison

Current run:
- Timestamp: 2026-04-12 12:56:36 Asia/Seoul
- Note: `Issue #125 relayout boundaries + sizedByParent + dry/intrinsic cache`

Previous run:
- Timestamp: 2026-04-12 12:29:56 Asia/Seoul
- Note: `Issue #31 lazy element deactivation / GlobalKey reparenting PR #135`

Average trace metrics:

| Metric | Previous (ms) | Current (ms) | Delta (ms) | Delta (%) |
| --- | ---: | ---: | ---: | ---: |
| `runApp` | 35.1056 | 10.3255 | -24.7801 | -70.59% |
| `mount` | 9.9202 | 9.7897 | -0.1305 | -1.32% |
| `draw` | 24.8643 | 0.4594 | -24.4049 | -98.15% |
| `layout` | 18.0652 | 0.4353 | -17.6299 | -97.59% |
| `paint` | 2.3901 | 0.6649 | -1.7252 | -72.18% |

Takeaways:
- This run is faster than the immediately previous trace across every tracked metric.
- The largest absolute improvement is `runApp` (-24.7801ms).
- The most direct signal for this change is `layout`, which dropped by -17.6299ms (-97.59%).
- `draw` and `paint` also moved down sharply, consistent with less relayout-triggered downstream work.

Trace capture notes:
- The average completed successfully and appended a new entry to `performance-history/duration.ts`.
- New trace JSON outputs were generated for 10 successful runs on 2026-04-12.
- The perf note records the relayout-boundary, `sizedByParent`, and dry/intrinsic cache work for Issue #125.
