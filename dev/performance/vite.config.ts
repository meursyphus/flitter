import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const resolveFromHere = (path: string) => fileURLToPath(new URL(path, import.meta.url));
// A/B runs can compile the exact same fixtures against an archived core.
const coreSource =
	process.env.FLITTER_PERF_CORE_SOURCE ?? resolveFromHere('../../packages/core/src');

export default defineConfig({
	resolve: {
		alias: [
			{
				find: '@/components/diagram/flow-diagram',
				replacement: resolveFromHere('../../shared/diagram-presets/flow-diagram/index.ts')
			},
			{
				find: '@flitterjs/chart',
				replacement: resolveFromHere('../../packages/chart/src/index.ts')
			},
			{ find: /^flitterjs$/, replacement: `${coreSource}/index.ts` },
			{
				find: 'flitterjs/component/Tooltip',
				replacement: `${coreSource}/component/Tooltip.ts`
			},
			{
				find: /^@flitterjs\/diagram$/,
				replacement: resolveFromHere('../../packages/diagram/src/index.ts')
			},
			{ find: '@headless', replacement: resolveFromHere('../../packages/chart/src/headless') },
			{ find: '@shared', replacement: resolveFromHere('../../packages/chart/src/shared') },
			{ find: '@utils', replacement: resolveFromHere('../../packages/chart/src/shared/utils') }
		]
	},
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
