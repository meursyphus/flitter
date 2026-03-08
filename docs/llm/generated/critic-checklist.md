# Critic Checklist

Generated: 2026-03-07

Use this after the first-read agent has already proposed an implementation.

## Chart Choice

- Did the agent choose the correct chart family, or force the prompt into the nearest familiar chart?
- Did it distinguish preset charts from base-wrapper charts?
- Did it explain the tradeoff when two families were both plausible?
- Did it correctly detect when the request should leave canonical chart families entirely?

## API Honesty

- Did it stay inside `chart-presets` before escalating?
- Did it invent props, styles, or helper APIs that do not exist?
- Did it point to the right source paths for the chosen escape hatch?

## Core Knowledge

- Did it pull in Flitter core concepts only when necessary?
- Did it identify the right widgets or providers for custom composition?
- Did it misuse direct primitives where a preset or base wrapper would have been cleaner?

## Missing Questions

- Did it ask about scale semantics when those affect interpretation?
- Did it ask about orientation, stacking mode, or size encoding when those materially change the chart?
- Did it avoid low-value questions that the pack already answered?

## Documentation Feedback

- Which ambiguity in the pack caused the failure?
- Which doc needs tightening: chart brief, pattern brief, widget doc, or concept doc?
- What one sentence would have prevented the reader from making the same mistake again?
