import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { runAdd } from "../cli/commands/add.mjs";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const directory = await mkdtemp(
  path.join(os.tmpdir(), "flitter-chart-install-"),
);
const chartNames = [
  "funnel-chart",
  "box-plot-chart",
  "bullet-chart",
  "histogram-chart",
  "sankey-chart",
  "sunburst-chart",
  "waterfall-chart",
];

try {
  await writeFile(
    path.join(directory, "package.json"),
    JSON.stringify({
      name: "chart-install-check",
      private: true,
      type: "module",
    }),
  );
  await writeFile(
    path.join(directory, "flitter.json"),
    JSON.stringify({
      tsx: true,
      framework: "react",
      defaultChartStyle: "ag",
      aliases: { charts: "./charts" },
    }),
  );
  await mkdir(path.join(directory, "node_modules"));
  await symlink(
    packageRoot,
    path.join(directory, "node_modules/flitter-ui"),
    "junction",
  );

  for (const chartName of chartNames) {
    for (const style of ["ag", "toast"]) {
      await runAdd({
        cwd: directory,
        chartName,
        style,
        overwrite: true,
        skipInstall: true,
      });
    }
  }

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
      include: ["charts/**/*.ts"],
    }),
  );
  await promisify(execFile)(process.execPath, [
    path.join(packageRoot, "node_modules/typescript/bin/tsc"),
    "-p",
    path.join(directory, "tsconfig.json"),
  ]);
  console.log(
    "All 14 copied chart variants typecheck against the built public package.",
  );
} catch (error) {
  console.error(error.stdout ?? error);
  process.exitCode = 1;
} finally {
  await rm(directory, { recursive: true, force: true });
}
