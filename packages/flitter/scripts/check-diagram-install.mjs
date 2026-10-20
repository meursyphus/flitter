import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { runAdd } from "../cli/commands/add.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const directory = await mkdtemp(path.join(os.tmpdir(), "diagram-install-"));

try {
  await writeFile(
    path.join(directory, "package.json"),
    JSON.stringify({ name: "diagram-install-check", private: true, type: "module" }),
  );
  await writeFile(
    path.join(directory, "flitter.json"),
    JSON.stringify({
      tsx: true,
      framework: "react",
      aliases: { diagrams: "./diagrams" },
    }),
  );
  await mkdir(path.join(directory, "node_modules"));
  await mkdir(path.join(directory, "node_modules/@flitterjs"), { recursive: true });
  for (const [name, folder] of [["flitterjs", "core"], ["@flitterjs/chart", "chart"], ["@flitterjs/diagram", "diagram"]]) {
    await symlink(path.resolve(packageRoot, "..", folder), path.join(directory, "node_modules", name), "junction");
  }

  await runAdd({ cwd: directory, chartName: "flow-diagram", overwrite: true, skipInstall: true });

  // A consumer file: the copied style must compile against the public engine entry.
  await writeFile(
    path.join(directory, "diagrams/usage.ts"),
    `import FlowDiagram, { type FlowDiagramProps } from "./flow-diagram";
import { layeredLayout, type FlowNode, type FlowEdge, FlowDiagramController } from "@flitterjs/diagram";

const nodes: FlowNode[] = [
  { id: "a", position: { x: 0, y: 0 }, data: { label: "A" }, resizable: true },
  { id: "b", position: { x: 0, y: 0 }, data: { label: "B" } },
];
const edges: FlowEdge[] = [{ id: "ab", source: "a", target: "b", markerEnd: "arrowclosed" }];
const props: FlowDiagramProps = {
  data: { nodes, edges },
  layout: layeredLayout,
  config: { colorMode: "dark", background: { variant: "lines" } },
  on: { connect: (connection) => void connection },
};
export const widget = FlowDiagram(props);
export const controller = new FlowDiagramController();
`,
  );
  await writeFile(
    path.join(directory, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "ES2020",
        module: "ESNext",
        moduleResolution: "bundler",
        strict: true,
        skipLibCheck: true,
        noEmit: true,
      },
      include: ["diagrams/**/*.ts"],
    }),
  );
  await promisify(execFile)(process.execPath, [
    path.join(packageRoot, "node_modules/typescript/bin/tsc"),
    "-p",
    path.join(directory, "tsconfig.json"),
  ]);
  console.log("The copied flow-diagram style typechecks against the built public package.");
} catch (error) {
  console.error(error.stdout ?? error);
  process.exitCode = 1;
} finally {
  await rm(directory, { recursive: true, force: true });
}
