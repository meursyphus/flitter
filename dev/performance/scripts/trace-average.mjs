import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ChromeTraceAnalyzer from '../src/lib/ChromeTraceAnalyzer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const performanceDir = path.resolve(__dirname, '..');
const traceDir = path.join(performanceDir, 'performance-history');
const durationFile = path.join(traceDir, 'duration.ts');
const RUN_COUNT = 10;
const MAX_ATTEMPTS_PER_RUN = 5;
const args = process.argv.slice(2);

function getOption(name, fallback = '') {
	const index = args.indexOf(name);
	if (index === -1) return fallback;
	const value = args[index + 1];
	return value != null && !value.startsWith('--') ? value : fallback;
}

const runNote = getOption('--note', getOption('--label', ''));

function formatDate(date) {
	const d = new Date(date);
	const pad = (num) => (num < 10 ? `0${num}` : `${num}`);
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}:${pad(
		d.getHours()
	)}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function runTraceCapture(tracePath) {
	const result = spawnSync(
		'pnpm',
		[
			'exec',
			'playwright',
			'test',
			'tests/tracking-performance.test.ts',
			'--grep',
			'Capture performance trace when diagram is rendered'
		],
		{
			cwd: performanceDir,
			stdio: 'inherit',
			env: {
				...process.env,
				TRACE_OUTPUT_PATH: tracePath
			}
		}
	);

	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}

function analyzeTrace(tracePath) {
	const trace = JSON.parse(fs.readFileSync(tracePath, { encoding: 'utf8' }));
	const analyzer = new ChromeTraceAnalyzer(trace);
	return {
		runApp: analyzer.getDurationMs('runApp'),
		mount: analyzer.getDurationMs('mount'),
		draw: analyzer.getDurationMs('draw'),
		layout: analyzer.getDurationMs('layout'),
		paint: analyzer.getDurationMs('paint')
	};
}

fs.mkdirSync(traceDir, { recursive: true });

const traceFiles = [];
const metricsList = [];
for (let index = 0; index < RUN_COUNT; index += 1) {
	let success = false;

	for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_RUN; attempt += 1) {
		const tracePath = path.join(
			traceDir,
			`${formatDate(new Date())}-run-${String(index + 1).padStart(2, '0')}-attempt-${String(
				attempt + 1
			).padStart(2, '0')}.json`
		);

		runTraceCapture(tracePath);

		try {
			const metrics = analyzeTrace(tracePath);
			traceFiles.push(tracePath);
			metricsList.push(metrics);
			success = true;
			break;
		} catch (error) {
			fs.rmSync(tracePath, { force: true });
			console.warn(
				`invalid trace for run ${index + 1}, attempt ${attempt + 1}: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
		}
	}

	if (!success) {
		throw new Error(`Failed to capture a valid trace for run ${index + 1}`);
	}
}

const totals = {
	runApp: 0,
	mount: 0,
	draw: 0,
	layout: 0,
	paint: 0
};

for (const metrics of metricsList) {
	totals.runApp += metrics.runApp;
	totals.mount += metrics.mount;
	totals.draw += metrics.draw;
	totals.layout += metrics.layout;
	totals.paint += metrics.paint;
}

const duration = {
	timestamp: Date.now(),
	runApp: totals.runApp / RUN_COUNT,
	mount: totals.mount / RUN_COUNT,
	draw: totals.draw / RUN_COUNT,
	layout: totals.layout / RUN_COUNT,
	paint: totals.paint / RUN_COUNT,
	note: runNote
};

console.log('****Execution Time****');
console.log(`runApp: ${duration.runApp}ms`);
console.log(`mount: ${duration.mount}ms`);
console.log(`draw: ${duration.draw}ms`);
console.log(`layout: ${duration.layout}ms`);
console.log(`paint: ${duration.paint}ms`);
console.log('********************');

let fileContent = fs.readFileSync(durationFile, { encoding: 'utf8' });
fileContent += `histories.push(${JSON.stringify(duration)});\n`;
fs.writeFileSync(durationFile, fileContent);
