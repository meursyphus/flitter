import path from "node:path";
import {
  createDefaultFlitterConfig,
  FLITTER_CONFIG_FILENAME,
  readFlitterConfig,
  writeFlitterConfig,
} from "../lib/config.mjs";

export async function runInit({ cwd }) {
  const existingConfig = await readFlitterConfig(cwd);
  if (existingConfig) {
    console.log(`${FLITTER_CONFIG_FILENAME} already exists at ${existingConfig.path}`);
    return;
  }

  const config = await createDefaultFlitterConfig(cwd);
  const writtenPath = await writeFlitterConfig(cwd, config);
  console.log(`Created ${path.relative(cwd, writtenPath) || FLITTER_CONFIG_FILENAME}`);
}
