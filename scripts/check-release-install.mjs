import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sandbox = mkdtempSync(path.join(tmpdir(), 'flitter-release-'));
const artifacts = path.join(sandbox, 'tarballs');
mkdirSync(artifacts);
const run = (command, args, cwd = sandbox) => execFileSync(command, args, { cwd, stdio: 'inherit' });
const directories = ['packages/core', 'packages/chart', 'packages/diagram', 'integrations/react', 'integrations/svelte', 'packages/flitter'];
const packages = directories.map(directory => JSON.parse(readFileSync(path.join(root, directory, 'package.json'), 'utf8')));
for (const directory of directories) run('pnpm', ['pack', '--pack-destination', artifacts], path.join(root, directory));
const tarballs = packages.map(pkg => path.join(artifacts, `${pkg.name.replace('@', '').replace('/', '-')}-${pkg.version}.tgz`));
writeFileSync(path.join(sandbox, 'package.json'), JSON.stringify({ name: 'flitter-release-consumer', private: true, type: 'module' }));
run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', ...tarballs, 'react@19', 'react-dom@19', 'svelte@5', 'typescript@5', '@types/react@19']);
const cli = path.join(sandbox, 'node_modules/@flitterjs/cli/cli/index.mjs');
run(process.execPath, [cli, 'init']);
for (const [name, style] of [['bar-chart', 'ag'], ['line-chart', 'toast'], ['pie-chart', 'ag'], ['flow-diagram', null]]) {
 run(process.execPath, [cli, 'add', name, ...(style ? ['--style', style] : [])]);
}
writeFileSync(path.join(sandbox, 'consumer.tsx'), `import Widget from '@flitterjs/adapter-react';
import { Container, Text } from 'flitterjs';
import { BarChart } from '@flitterjs/chart';
import { FlowDiagram } from '@flitterjs/diagram';
import SvelteWidget from '@flitterjs/adapter-svelte';
export const element = <Widget widget={Container({child: Text('installed')})} />;
export { BarChart, FlowDiagram, SvelteWidget };
`);
writeFileSync(path.join(sandbox, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'NodeNext', moduleResolution: 'NodeNext', jsx: 'react-jsx', strict: true, skipLibCheck: true, noEmit: true }, include: ['consumer.tsx'] }));
run(process.execPath, ['node_modules/typescript/bin/tsc', '--noEmit']);
// Copied templates intentionally use extensionless imports for app bundlers.
run(process.execPath, ['node_modules/typescript/bin/tsc', '--noEmit', '--module', 'ESNext', '--moduleResolution', 'bundler', '--strict', '--skipLibCheck', '--target', 'ES2022', ...['bar-chart', 'toast-line-chart', 'pie-chart'].map(name => `src/components/chart/${name}/index.ts`), 'src/components/diagram/flow-diagram/index.ts']);
run(process.execPath, ['--input-type=module', '-e', `import { Container } from 'flitterjs'; import { BarChart } from '@flitterjs/chart'; import { FlowDiagram } from '@flitterjs/diagram'; import Widget from '@flitterjs/adapter-react'; if (![Container, BarChart, FlowDiagram, Widget].every(x => typeof x === 'function')) throw new Error('Missing runtime export');`]);
run(process.execPath, ['--input-type=module', '-e', `import {readFileSync} from 'node:fs'; import {compile} from 'svelte/compiler'; compile(readFileSync('node_modules/@flitterjs/adapter-svelte/package/Widget.svelte','utf8'), {generate:'server', filename:'Widget.svelte'});`]);
const core = JSON.parse(readFileSync(path.join(sandbox, 'node_modules/flitterjs/package.json'), 'utf8'));
if (Object.keys({...core.dependencies, ...core.peerDependencies}).some(name => /react|svelte|linkedom|@flitterjs/.test(name))) throw new Error('Engine depends on an adapter or feature package');
console.log(`Release installation verified. Tarballs: ${artifacts}`);
