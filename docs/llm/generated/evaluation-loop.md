# LLM Evaluation Loop

Generated: 2026-04-08

Use this loop when tightening the pack for first-read agents.

## Reader Pass

1. Open `dev/llm-playground`.
2. Pick one evaluation case.
3. Copy the reader prompt.
4. Run it in a clean agent session that has no extra repo context.
5. Capture the proposed chart family, questions asked, APIs used, and escape-hatch choice.

## Critic Pass

1. Copy the critic prompt for the same case.
2. Provide the reader result and the pack links.
3. Check whether the reader chose the correct family, asked the right questions, and stayed inside supported APIs.
4. Record what the pack failed to make obvious.

## Tightening Rules

- If the reader invents an API, strengthen the source-of-truth path or the quick start.
- If the reader picks the wrong chart family, tighten `/llm/chart.md` and the relevant family brief.
- If the reader never asks a crucial question, put that question directly into the family brief.
- If the reader correctly detects a novel request, keep that escape hatch explicit instead of forcing a fake preset.

## Success Condition

A first-read agent should be able to:

- choose a plausible chart family quickly,
- distinguish preset charts from base-wrapper charts,
- ask only the high-value clarifying questions,
- move into patterns and Flitter core knowledge only when the request genuinely requires it.
