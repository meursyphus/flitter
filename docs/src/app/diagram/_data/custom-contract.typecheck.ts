import type { FlowDiagramCustom } from "flitter-ui/diagram";

// Keep this probe in the docs tsc input: disabling strictNullChecks must fail too.
// @ts-expect-error Empty custom parts must return SizedBox.shrink(), never null.
const emptyPart: FlowDiagramCustom["edgeLabel"] = () => null;
void emptyPart;
