// ESM declarations must resolve in both NodeNext and bundler consumers.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { visit(file); continue; }
    if (!entry.name.endsWith('.d.ts')) continue;
    const source = readFileSync(file, 'utf8');
    writeFileSync(file, source.replace(/(['"])(\.{1,2}\/[^'"\n]+)\1/g, (match, quote, specifier) => {
      const target = path.resolve(directory, specifier);
      if (existsSync(`${target}.d.ts`)) return `${quote}${specifier}.js${quote}`;
      if (existsSync(path.join(target, 'index.d.ts'))) return `${quote}${specifier}/index.js${quote}`;
      return match;
    }));
  }
}
visit(path.resolve(process.argv[2] ?? 'dist'));
