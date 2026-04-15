import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const forwardedArgs = [];
let note;

for (let i = 0; i < args.length; i += 1) {
	const arg = args[i];

	if (arg === '--note') {
		note = args[i + 1];
		i += 1;
		continue;
	}

	if (arg.startsWith('--note=')) {
		note = arg.slice('--note='.length);
		continue;
	}

	forwardedArgs.push(arg);
}

if (note == null || note.trim() === '') {
	console.error('Missing required argument: --note "<summary of the changes>"');
	console.error('Usage: pnpm run perf:trace -- --note "Issue #132 dry layout + sizedByParent"');
	process.exit(1);
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const performanceDir = path.resolve(scriptDir, '..');
const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

const child = spawn(
	pnpmCommand,
	[
		'exec',
		'playwright',
		'test',
		'--config',
		'playwright.config.ts',
		'tests/tracking-performance.test.ts',
		...forwardedArgs
	],
	{
		cwd: performanceDir,
		stdio: 'inherit',
		env: {
			...process.env,
			PERF_TRACE_NOTE: note.trim()
		}
	}
);

child.on('exit', (code, signal) => {
	if (signal != null) {
		process.kill(process.pid, signal);
		return;
	}

	process.exit(code ?? 1);
});
