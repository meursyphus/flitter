import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('..', import.meta.url));
const output = process.argv[2];
if (!output) {
	console.error('Usage: pnpm perf:engine <output-directory> [playwright options]');
	process.exit(1);
}
const result = spawnSync(
	'pnpm',
	[
		'exec',
		'playwright',
		'test',
		'tests/engine-performance.test.ts',
		'--workers=1',
		...process.argv.slice(3)
	],
	{
		cwd: dir,
		stdio: 'inherit',
		env: { ...process.env, PERF_ENGINE_OUTPUT: path.resolve(output) }
	}
);
if (result.error) throw result.error;
if (result.status === 0) {
	fs.writeFileSync(
		path.join(path.resolve(output), 'environment.json'),
		JSON.stringify(
			{
				timestamp: new Date().toISOString(),
				platform: process.platform,
				arch: process.arch,
				node: process.version,
				coreSource: process.env.FLITTER_PERF_CORE_SOURCE ?? 'workspace',
				commit: spawnSync('git', ['rev-parse', 'HEAD'], {
					cwd: dir,
					encoding: 'utf8'
				}).stdout.trim()
			},
			null,
			2
		)
	);
}
process.exit(result.status ?? 1);
