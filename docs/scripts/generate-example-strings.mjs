#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../src/app/chart/_data');

// Find all examples.tsx files
const chartDirs = readdirSync(dataDir).filter(d => {
  const full = join(dataDir, d);
  return existsSync(join(full, 'toast/examples.tsx')) || existsSync(join(full, 'ag/examples.tsx'));
});

for (const chart of chartDirs) {
  for (const style of ['toast', 'ag']) {
    const examplesPath = join(dataDir, chart, style, 'examples.tsx');
    if (!existsSync(examplesPath)) continue;

    const source = readFileSync(examplesPath, 'utf-8');

    // Extract exported functions
    const functionRegex = /export function (\w+)\(\)[^{]*\{/g;
    const functions = [];
    let match;

    while ((match = functionRegex.exec(source)) !== null) {
      const name = match[1];
      const startIdx = match.index;

      // Find the matching closing brace
      let braceCount = 0;
      let endIdx = startIdx;
      for (let i = startIdx; i < source.length; i++) {
        if (source[i] === '{') braceCount++;
        if (source[i] === '}') braceCount--;
        if (braceCount === 0) {
          endIdx = i + 1;
          break;
        }
      }

      functions.push({
        name,
        source: source.slice(startIdx, endIdx).replace(/^export /, ''),
      });
    }

    if (functions.length === 0) continue;

    // Write generated file
    const outputPath = join(dataDir, chart, style, 'examples.generated.ts');
    const output = [
      '// AUTO-GENERATED — do not edit manually',
      '// Run: node docs/scripts/generate-example-strings.mjs',
      '',
      ...functions.map(f =>
        `export const ${f.name}Code = ${JSON.stringify(f.source)};`
      ),
      '',
    ].join('\n');

    writeFileSync(outputPath, output);
    console.log(`Generated ${outputPath} (${functions.length} functions)`);
  }
}

console.log('Done.');
