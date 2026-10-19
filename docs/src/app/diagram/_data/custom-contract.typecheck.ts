import type { FlowDiagramCustom } from "flitter-ui/diagram";

// Keep this probe in the docs tsc input: disabling strictNullChecks must fail too.
// @ts-expect-error Empty custom parts must return SizedBox.shrink(), never null.
const emptyPart: FlowDiagramCustom["edgeLabel"] = () => null;
void emptyPart;

// All visual extension points return widgets, including the small children.
type VisualResult = ReturnType<FlowDiagramCustom[keyof FlowDiagramCustom]>;
const visualResult: import("flitter-ui").Widget = null as unknown as VisualResult;
void visualResult;

// @ts-expect-error Geometry belongs in getEdgePath, never in a visual slot.
const wrongGeometry: Partial<FlowDiagramCustom> = { edgePath: () => ({}) };
void wrongGeometry;
