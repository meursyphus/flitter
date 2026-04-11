#!/usr/bin/env node

import { runInit } from "./commands/init.mjs";
import { runAdd } from "./commands/add.mjs";

function printHelp() {
  console.log(`flitter

Usage:
  flitter init [--cwd <path>]
  flitter add <chart-name> [--style <toast|ag>] [--overwrite] [--skip-install] [--cwd <path>]
`);
}

function parseArgs(argv) {
  const args = { _: [] };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      args._.push(token);
      continue;
    }

    const key = token.slice(2);
    const next = argv[index + 1];
    if (next != null && !next.startsWith("--")) {
      args[key] = next;
      index += 1;
      continue;
    }
    args[key] = true;
  }

  return args;
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);

  if (!command || command === "--help" || command === "-h") {
    printHelp();
    process.exit(command ? 0 : 1);
  }

  const args = parseArgs(rest);
  const cwd = args.cwd ? String(args.cwd) : process.cwd();

  try {
    switch (command) {
      case "init":
        await runInit({ cwd });
        break;
      case "add":
        if (args._.length === 0) {
          throw new Error("Missing chart name. Example: flitter add bar-chart --style toast");
        }
        await runAdd({
          cwd,
          chartName: String(args._[0]),
          style: args.style ? String(args.style) : null,
          overwrite: Boolean(args.overwrite),
          skipInstall: Boolean(args["skip-install"]),
        });
        break;
      default:
        throw new Error(`Unknown command: ${command}`);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

await main();
