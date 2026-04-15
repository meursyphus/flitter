import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const resolveFromHere = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
	resolve: {
		alias: [
			{ find: /^flitter-ui$/, replacement: resolveFromHere('../../packages/flitter/src/index.ts') },
			{ find: 'flitter-ui/chart', replacement: resolveFromHere('../../packages/flitter/src/chart.ts') },
			{ find: /^flitter-core$/, replacement: resolveFromHere('../../packages/core/src/index.ts') },
			{
				find: 'flitter-core/component/Tooltip',
				replacement: resolveFromHere('../../packages/core/src/component/Tooltip.ts')
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
