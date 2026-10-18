import DatabaseSchema from "./database-schema";
import Workflow from "./workflow";
import Organization from "./organization";
import ServiceMap from "./service-map";
import GroupedPipeline from "./grouped-pipeline";
import CardGrid from "./card-grid";
import HeadlessOrbit from "./headless";
import type { ExampleSlug } from "./catalog";
import type { Widget } from "flitter-ui";

export const exampleFactories = {
  "database-schema": DatabaseSchema,
  workflow: Workflow,
  organization: Organization,
  "service-map": ServiceMap,
  "grouped-pipeline": GroupedPipeline,
  "card-grid": CardGrid,
  headless: HeadlessOrbit,
} satisfies Record<ExampleSlug, (theme: "light" | "dark") => Widget>;
