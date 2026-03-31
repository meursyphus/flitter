#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../src/app/chart/_data');

// Chart name → import mapping for user-facing code
const chartImportMap = {
  'bar-chart': { toast: 'ToastBarChart', ag: 'BarChart' },
  'line-chart': { toast: 'ToastLineChart', ag: 'LineChart' },
  'area-chart': { toast: 'ToastAreaChart', ag: 'AreaChart' },
  'pie-chart': { toast: 'ToastPieChart', ag: 'PieChart' },
  'scatter-chart': { toast: 'ToastScatterChart', ag: 'ScatterChart' },
  'bubble-chart': { toast: 'ToastBubbleChart', ag: 'BubbleChart' },
  'radar-chart': { toast: 'ToastRadarChart', ag: 'RadarChart' },
  'heatmap-chart': { toast: 'ToastHeatmapChart', ag: 'HeatmapChart' },
  'stacked-bar-chart': { toast: 'ToastStackedBarChart', ag: 'StackedBarChart' },
  'stacked-area-chart': { toast: 'ToastStackedAreaChart', ag: 'StackedAreaChart' },
};

// Build user-facing chart path from chart name + style
function getUserFacingImportPath(chartName, style) {
  if (style === 'toast') return `./charts/toast-${chartName}`;
  return `./charts/${chartName}`;
}

// Convert PascalCase to kebab-case
function toKebab(name) {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// Convert kebab-case filename to PascalCase export name
function toPascal(kebab) {
  return kebab.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
}

// Find all chart dirs that have toast/examples/ or ag/examples/ folders OR toast/examples.tsx files
const chartDirs = readdirSync(dataDir).filter(d => {
  const full = join(dataDir, d);
  if (!statSync(full).isDirectory()) return false;
  return (
    existsSync(join(full, 'toast/examples')) ||
    existsSync(join(full, 'ag/examples')) ||
    existsSync(join(full, 'toast/examples.tsx')) ||
    existsSync(join(full, 'ag/examples.tsx'))
  );
});

for (const chart of chartDirs) {
  for (const style of ['toast', 'ag']) {
    const examplesDir = join(dataDir, chart, style, 'examples');
    const legacyFile = join(dataDir, chart, style, 'examples.tsx');

    // Prefer examples/ folder, fall back to examples.tsx
    if (existsSync(examplesDir) && statSync(examplesDir).isDirectory()) {
      // --- New: individual files in examples/ folder ---
      const files = readdirSync(examplesDir)
        .filter(f => f.endsWith('.tsx') && f !== 'index.tsx')
        .sort();

      if (files.length === 0) continue;

      const exports = [];

      for (const file of files) {
        const filePath = join(examplesDir, file);
        const source = readFileSync(filePath, 'utf-8');
        const baseName = basename(file, '.tsx');
        const exportName = toPascal(baseName) + 'Code';

        exports.push(`export const ${exportName} = ${JSON.stringify(source)};`);
      }

      const outputPath = join(dataDir, chart, style, 'examples.generated.ts');
      const output = [
        '// AUTO-GENERATED — do not edit manually',
        '// Run: npm run gen:examples',
        '',
        ...exports,
        '',
      ].join('\n');

      writeFileSync(outputPath, output);
      console.log(`Generated ${chart}/${style} (${files.length} files from examples/)`);

    } else if (existsSync(legacyFile)) {
      // --- Legacy: single examples.tsx file ---
      const source = readFileSync(legacyFile, 'utf-8');

      const functionRegex = /export function (\w+)\(\)[^{]*\{/g;
      const functions = [];
      let match;

      while ((match = functionRegex.exec(source)) !== null) {
        const name = match[1];
        const startIdx = match.index;

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

      const outputPath = join(dataDir, chart, style, 'examples.generated.ts');
      const output = [
        '// AUTO-GENERATED — do not edit manually',
        '// Run: npm run gen:examples',
        '',
        ...functions.map(f =>
          `export const ${f.name}Code = ${JSON.stringify(f.source)};`
        ),
        '',
      ].join('\n');

      writeFileSync(outputPath, output);
      console.log(`Generated ${chart}/${style} (${functions.length} functions from legacy examples.tsx)`);
    }
  }
}

console.log('Done.');
